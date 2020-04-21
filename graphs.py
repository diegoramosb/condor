import parser

import matplotlib.pyplot as plt
from flask import Blueprint, request
import numpy as np
import utils
from statistics import mean
from db import *
import json
from itertools import combinations
from math import sin, cos, pi
from dateutil import parser
from  jsonmerge import merge

from extract_tweets import searchTweetById, extractTweetsApi

graph = Blueprint('graphs', __name__)


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


@graph.route('/tweets', methods=['GET'])
def get_all_tweets():
    tweets = return_tweets()
    for t in tweets:
        tweetss = search_tweets_userId(t['userId'])

    tweets_response = utils.list_to_json(tweets)
    return utils.JSONResponse(tweets_response)

@graph.route('/tweetsbydate', methods=['GET'])
def get_tweets_date():
    date = request.args.get('date')
    dt = parser.parse(date)
    tweets = search_tweets_after(dt)
    tweets_response = utils.list_to_json(tweets)
    return utils.JSONResponse(tweets_response)

@graph.route('/tweetsbyword', methods=['GET'])
def show_tweets_by_word():
    word = request.args.get('word')
    tweets= search_by_keywords(word)

    tweets_response = utils.list_to_json(tweets)
    return utils.JSONResponse(tweets_response)


@graph.route('/tweetsbyuser', methods=['GET'])
def show_tweets_by_user():
    user = request.args.get('user')
    tweets= search_by_user(user)

    tweets_response = utils.list_to_json(tweets)
    return utils.JSONResponse(tweets_response)


@graph.route('/bubble', methods=['GET'])
def show_favs_rts():
    word = request.args.get('word')
#x = media de RTS, y =MEDIA DE FAVS, r =NUMERO DE TWEETS
    tweets = search_by_keywords(word)
    userIds = []
    usage = []
    sumFavs = []
    mediaFavs = []
    sumRts= []
    mediaRts = []
    userNames = []
    for tweet in search_by_keywords(word):

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

    pprint(json.dumps(m))
    json.dumps(m)

    tweets_response = utils.list_to_json(tweets)
    bubble_response = json.dumps(m)
    result = merge(bubble_response, tweets_response)
    return utils.JSONResponse(result)


# se pasa una palabra y un dia
@graph.route('/historic', methods=['GET'])
def show_chart():
    word = request.args.get('word')
    #dayy = request.args.get('day')
    tweets = search_by_keywords(word)
    tweet = tweets[1]

    pprint(tweets[1])
    rts = []
    favs = []
    horas =[]

    requests = tweet['request_times']
    rt = tweet['retweet_count']
    fav = tweet['favorite_count']
    _id = tweet['_id']
    text = tweet['text']
    userNames = []


    for req in requests:
        if req.day == datetime(2020, 4, 1).day:
            horas.append(req.strftime("%H:%M"))
            rts.append(rt[requests.index(req)])
            favs.append(fav[requests.index(req)])
    # pprint(rts)


    ans = {"text": tweet["text"]}
    ans["hist"] = [{"hour": h, "numRts": r, "numFavs": f} for h, r, f in zip(horas, rts, favs)]
    print(ans)

    # pprint(json.dumps(m))

    tweets_response = utils.list_to_json(tweets)
    chart_response = json.dumps(ans)
    result = merge(chart_response, tweets_response)
    return utils.JSONResponse(result)



#Palabras mas frecuentes en resultado de busqueda de tweets por palabra
@graph.route('/nube', methods=['GET'])
def show_nube_palabra():

    word = request.args.get('word')
    words = search_most_common_words(word)
    tweets = search_by_keywords(word)
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
        if item['count'] >= 3 and word not in item['_id']:
            ans2.append(item)

    tweets_response = utils.list_to_json(tweets)
    nube_response = utils.list_to_json(ans2)
    result = merge(nube_response, tweets_response)



    return utils.JSONResponse(result)



#Se pasan las palabras
@graph.route('/grafo', methods=['GET'])
def show_grafo_cuentas_palabras():
    words = request.args.getlist('words')
    #pprint(words)


    m =[]
    accounts = []
    for w in words:
        userNames = []
        userIds = []
        word = []

        tweets_by_word = search_by_keywords(w)

        for t in tweets_by_word:

            if t['userId'] not in userIds:
                userIds.append(t['userId'])


            word.append(w)
        #pprint(userIds)
        #pprint(word)
        if len(userIds)>1:
            for i in range(len(userIds)):
                usr = searchUserId(userIds[i])
                for username in usr:
                    userNames.append(username['name'])
                    if username['name'] not in accounts:
                        accounts.append(username['name'])
            
            usersComb = combinations(userNames, 2)
            for a in usersComb:
                m += [{"cuenta1": a[0], "cuenta2": a[1], "palabra": w}]

    n = len(accounts)
    r = 4
    nodes = []
    for i in range(n):
        x = (sin(i / (n + 1) * 2 * pi) * r + 10)
        y = (cos(i / (n + 1) * 2 * pi) * r + 10)
        nodo = {"cuenta": accounts[i], "x": x, "y": y}
        nodes.append(nodo)
        for link in m:
            if link['cuenta1'] == nodo['cuenta']:
                link['origen'] = {'x': x, 'y': y}
            elif link['cuenta2'] == nodo['cuenta']:
                link['destino'] = {'x': x, 'y': y}
    # pprint(m)  
    # pprint(json.dumps(m))
    grafo_response = json.dumps({"nodes": nodes, "links": m})
    tweets = []

    tweets_response = utils.list_to_json(tweets_by_word)

    result = merge(grafo_response, tweets_response)
    return utils.JSONResponse(grafo_response)

    




