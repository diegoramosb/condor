import parser

import matplotlib.pyplot as plt
from flask import Blueprint, request, jsonify
import numpy as np
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
    filtered = utils.remove_stop_words(ids)
    ans = []
    for obj in words:
        if obj['_id'].lower() in filtered:
            ans.append(obj)
    ans2 = []

    for item in ans:

        #pprint(word[ans.index(item)])
            #pprint(item['_id'])
        if item['count'] >= 3 and word[0] not in item['_id']:
            ans2.append(item)


    #pprint(ans2)
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')

    tweets = get_filtros(word, date, accounts, polaridad)

    users = get_tweets_with_its_user(tweets)
    n = [{"tweets": t, "user": u} for t, u in zip(tweets, users)]

    return {"tweets": n, "data": ans2}



#Se pasan las palabras
@graph.route('/grafo', methods=['GET'])
def show_grafo_cuentas_palabras():

    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')

    tweets = get_filtros(words, date, accounts, polaridad)

    userIds = []
    for tweet in tweets:
        userId = tweet['userId']
        if userId not in userIds:
            userIds.append(userId)

    users = []
    users2 = []

    for userId in userIds:
        userInfo = searchUserId(userId)
        if len(userInfo) > 0:
            userTweets = []
            for tweet in tweets:
                if userId == tweet['userId']:
                    userTweets.append(tweet['text'])
            users.append({'user': '@' + userInfo[0]['screen_name'], 'tweets': userTweets})
            
    for user in users:
        userWords = []
        for tweet in user['tweets']:
            for word in words:
                if word in tweet and word not in userWords:
                    userWords.append(word)
        users2.append({'name': user['user'], 'words': userWords})
    
    return {'tweets': tweets, 'data': users2}


















    # filteredTweets = []
    # for tweet in tweets:
    #     text = tweet['text'].split(' ')
    #     filteredText = []
    #     for word in text:
    #         for word2 in words:
    #             print(word, word2)
    #             if word.lower() == word2.lower():
    #                     print(tweet['_id'])
    #                     filteredText.append(word2)
    #     filteredTweets.append({'userId': tweet['userId'], 'words':filteredText})
    
    # usersWords = []
    # for i in range(len(filteredTweets)):
    #     for j in range(len(filteredTweets)):
    #         if i != j and filteredTweets[i]['userId'] == filteredTweets[j]['userId']:
    #             words = []
    #             for word in filteredTweets[i]['words']:
    #                 if word not in words:
    #                     words.append(word)
    #             for word in filteredTweets[j]['words']:
    #                 if word not in words:
    #                     words.append(word)
    #             usersWords.append({'userId': filteredTweets[i]['userId'], 'words': words})
        


    




