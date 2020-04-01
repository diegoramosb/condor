import matplotlib.pyplot as plt
from flask import Blueprint, request
import numpy as np
import utils
from statistics import mean
from db import *
import json

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
    bubble_response = json.dumps(m)
    return utils.JSONResponse(bubble_response)


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
        if req.day == datetime.today().day:
            horas.append(req.strftime("%H:%M"))
            rts.append(rt[requests.index(req)])
            favs.append(fav[requests.index(req)])
    # pprint(rts)
    usr = searchUserId(tweet['userId'])
    for username in usr:
        
        m = [{"hour": h, "numRts": r, "numFavs": f, "username": username['name'],"tweet": text} for h, r, f in zip(horas, rts, favs)]
        print(m)

    # pprint(json.dumps(m))
    chart_response = json.dumps(m)
    return utils.JSONResponse(chart_response)



#Palabras mas frecuentes en resultado de busqueda de tweets por palabra
@graph.route('/nube', methods=['GET'])
def show_nube_palabra():

    word = request.args.get('word')
    words = search_most_common_words(word)


    nube_response= utils.list_to_json(words)
    return utils.JSONResponse(nube_response)



#Se pasan las palabras
@graph.route('/grafo', methods=['GET'])
def show_grafo_cuentas_palabras():
    words = request.args.getlist('words')
    #pprint(words)

    userIds = []
    word = []

    m =[]

    for w in words:
        userNames = []

        tweets_by_word = search_by_keywords(w)

        for t in tweets_by_word:

            if t['userId'] not in userIds:
                userIds.append(t['userId'])

            word.append(w)
        #pprint(userIds)
        #pprint(word)
        if len(userIds)>1:

            for userId in userIds:
                usr = searchUserId(userId)
                for username in usr:
                    userNames.append(username['name'])

            userNames[:] = [','.join(userNames[:])]

            for a in userNames:
                cuenta1 = a.split(",")[0]
                cuenta2 = a.split(",")[1]

                m += [{"cuenta1": cuenta1, "cuenta2": cuenta2, "palabra": w}]

        userIds = []
        word = []

    pprint(m)
    pprint(json.dumps(m))
    grafo_response = json.dumps(m)
    return utils.JSONResponse(grafo_response)






