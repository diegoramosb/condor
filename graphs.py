import parser

import matplotlib.pyplot as plt
from flask import Blueprint, request, jsonify
import numpy as np
from nltk.corpus import stopwords

import utils
import nltk

from statistics import mean
from db import *
import json
from itertools import combinations
from math import sin, cos, pi
import nltk

from extract_tweets import searchTweetById, extractTweetsApi

graph = Blueprint('graphs', __name__)
nltk.download('stopwords')

def show_word_frequency(word):
    userIds = []
    usage = []
    userNames = []
    for tweet in search_by_keywords(word):
        if tweet['userId'] not in userIds:
            userIds.append(tweet['userId'])
            usage.append(1)
        else:
            usage[userIds.index(tweet['userId'])] += 1
    for userId in userIds:
        usr = searchUserId(userId)
        for username in usr:
            userNames.append(username['name'])

    n = np.arange(len(userNames))
    plt.bar(n, usage)
    plt.xticks(n, userNames)
    plt.title('Número de menciones de "{}"'.format(word))
    plt.show()

def get_tweets_with_its_user(tweets):

    ans = []
    tuit = []
    for t in tweets:
        user = searchUserId(t['userId'])
        ans += user
    return ans


@graph.route('/bubble', methods=['GET'])
def show_favs_rts():
    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')

    tweets = get_filtros(words, date, accounts, polaridad)
    userIds = []
    usage = []
    sumFavs = []
    mediaFavs = []
    sumRts= []
    mediaRts = []
    userNames = []
    for tweet in tweets:

        if tweet['userId'] not in userIds:
            userIds.append(tweet['userId'])
            usage.append(1)

            f = tweet['favorite_count']
            sumFavs.append(f[-1])

            r = tweet['retweet_count']
            sumRts.append(r[-1])

        else:
            usage[userIds.index(tweet['userId'])] += 1
            f = tweet['favorite_count']
            sumFavs[userIds.index(tweet['userId'])] += f[-1]

            r = tweet['retweet_count']
            sumRts[userIds.index(tweet['userId'])] += r[-1]

    for userId in userIds:
        usr = searchUserId(userId)
        for username in usr:
            userNames.append(username['name'])

    o = [{"x": x, "y": y, "z": z} for x,y,z in zip(sumRts, sumFavs, usage)]
    m = [{"label": l, "data": d} for l, d in zip(userNames, o)]
    users = get_tweets_with_its_user(tweets)
    n = [{"tweet": t, "user": u} for t, u in zip(tweets, users)]
    return {"tweets": n, "bubbles": m}




# se pasa una palabra y un dia
@graph.route('/historic', methods=['GET'])
def show_chart():
    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')
    id = request.args.get('idTweet')

    tweets = get_filtros(words, date, accounts, polaridad)
    data = {}
    rtTotal = 0
    likeTotal = 0
    #todos los tweets y retweets y likes de las horas - suma de todos los tweets,

    for t in tweets:
        if date is None or t['date'].strftime("%Y-%m-%d") == date:
            requests = t['request_times']
            rt = t['retweet_count']
            fav = t['favorite_count']
            for i in range(len(requests)):
                timeStr = requests[i].strftime("%d/%m/%Y %H:%M")
                rtTotal = rtTotal + rt[i]
                likeTotal = likeTotal + fav[i]
                data[timeStr] = {"sum_rt": rtTotal, "sum_like": likeTotal}

    dataList = []
    for item in data.items():
        dataList.append({"time":item[0], "sum_rt": item[1]["sum_rt"], "sum_like": item[1]["sum_like"]})
    dataList = sorted(dataList,
    key=lambda x: datetime.strptime(x['time'], '%d/%m/%Y %H:%M'), reverse=False)
    users = get_tweets_with_its_user(tweets)
    n = [{"tweets": t, "user": u} for t, u in zip(tweets, users)]
    return {"tweets": n, "data": dataList}



#Palabras mas frecuentes en resultado de busqueda de tweets por palabra
@graph.route('/nube', methods=['GET'])
def show_frecuencia():

    word = request.args.getlist('word')
    words = []

    for w in word:
        words += search_most_common_words(w)

    ids = []
    for obj in words:
        ids.append(obj['_id'].lower())
    sin_num = utils.numbers(ids)
    sin_imag= utils.numbers(sin_num)
    filtered = utils.remove_stop_words(sin_imag)
    ans = []
    for obj in words:
        if obj['_id'].lower() in filtered:
            ans.append(obj)
    #pprint(ans)
    #sinNum = utils.numbers(ans)
    ans2 = []

    for item in ans:

        #pprint(word[ans.index(item)])
            #pprint(item['_id'])
        if item['count'] >= 1 and word[0] not in item['_id']:
            ans2.append(item)


    #pprint(ans2)
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')

    tweets = get_filtros(word, date, accounts, polaridad)

    users = get_tweets_with_its_user(tweets)
    n = [{"tweets": t, "user": u} for t, u in zip(tweets, users)]

    return {"tweets": n, "data": ans2}


@graph.route('/grafo', methods=['GET'])
def show_grafo():

    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')

    tweets = get_filtros(words, date, accounts, polaridad)

    tweets_users = get_tweets_with_its_user(tweets)
    n = [{"tweets": t, "user": u} for t, u in zip(tweets, tweets_users)]

    # usuarios de los tweets
    userIds = []
    for tweet in tweets:
        userId = tweet['userId']
        if userId not in userIds:
            userIds.append(userId)

    users = []

    for userId in userIds:
        userInfo = searchUserId(userId)
        if len(userInfo) > 0:
            userTweets = []
            for tweet in tweets:
                if userId == tweet['userId']:
                    userTweets.append(tweet['text'])
            users.append({'user': '@' + userInfo[0]['screen_name'], 'tweets': userTweets})

    users2 = []

    for user in users:
        filtered = []
        for tweet in user['tweets']:
            words_text = list(tweet.split(" "))
            filtered.append(utils.remove_stop_words(words_text))
            palabras = filtered1(filtered)
            sinNum = utils.numbers(palabras)
        users2.append({'name': user['user'], 'words': sinNum})

    users3 = []
    for i in range(len(users2)):
        user1 = users2[i]
        words = []
        for j in range(len(users2)):
            user2 = users2[j]
            if i != j:
                for word in user1['words']:
                    for word2 in user2['words']:
                        if word.lower() == word2.lower() and word.lower() not in words and word != "":
                            words.append(word.lower())
        users3.append({'name': user1['name'], 'words': words})

    return {'tweets': n, 'data': users3}


def filtered1(lista):
    lista_palabras = []
    for sublist in lista:
        for item in sublist:
            lista_palabras.append(item)
    return lista_palabras



