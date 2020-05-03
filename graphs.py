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
import nltk

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




@graph.route('/bubble', methods=['GET'])
def show_favs_rts():
    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.get('polaridad')

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
    return {"tweets": tweets, "bubbles": m}




# se pasa una palabra y un dia
@graph.route('/historic', methods=['GET'])
def show_chart():
    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.get('polaridad')
    id = request.args.get('idTweet')

    tweets = get_filtros(words, date, accounts, polaridad)

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
    chart_response = json.dumps(ans)

    return utils.JSONResponse(chart_response)



#Palabras mas frecuentes en resultado de busqueda de tweets por palabra
@graph.route('/nube', methods=['GET'])
def show_nube_palabra():

    word = request.args.get('word')
    words = search_most_common_words(word)
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.get('polaridad')

    tweets = get_filtros(words, date, accounts, polaridad)

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

    return {"tweets": tweets, "data": ans2}





#Se pasan las palabras
@graph.route('/grafo', methods=['GET'])
def show_grafo_cuentas_palabras():

    words = request.args.getlist('words')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.get('polaridad')


    #pprint(words)
    tweets = []

    m =[]
    accounts = []
    for w in words:
        userNames = []
        userIds = []
        word = []

        tweets_by_word = search_by_keywords(w)
        tweets += tweets_by_word

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
    q = json.dumps({"nodes": nodes, "links": m})
    tuits = get_filtros(words, date, accounts, polaridad)

    p = [{"info": q} for q in zip(m)]

    return {"tweets": tuits, "data": p}


    




