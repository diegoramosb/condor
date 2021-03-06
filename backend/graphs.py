from flask import Blueprint, request, jsonify
import utils
from db import *
import nltk
import numpy as np


graph = Blueprint('graphs', __name__)
nltk.download('stopwords')

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
    sumRts= []
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
    
    scaledUsage = []
    if len(usage) > 0:
        if max(usage)- min(usage) != 0:
            scaledUsage = [((40*(x - min(usage)) / (max(usage) - min(usage))) + 5) for x in usage]
        else:
            scaledUsage = [40 for x in usage]

    for userId in userIds:
        usr = searchUserId(userId)
        for username in usr:
            userNames.append(username['name'])

    o = [{"x": x, "y": y, "z": z, "w": w} for x,y,z,w in zip(sumRts, sumFavs, usage, scaledUsage)]
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

    tweets = get_filtros(words, date, accounts, polaridad)
    #todos los tweets y retweets y likes de las horas - suma de todos los tweets,

    requestTimes = []
    sumLikes = []
    sumRts = []

    for t in tweets: 
        requests = t['request_times']
        rts = t['retweet_count']
        likes = t['favorite_count']
        if rts[0] == 0 and likes[0] == 0:
            for i in range(1, len(requests)):
                requestTime = datetime.strftime(requests[i], '%d/%m/%Y %H:%M')
                if requestTime not in requestTimes:

                    if len(requestTimes) > 0:
                        j = len(requestTimes) - 1
                        while j >= 0 and requestTime < requestTimes[j]:
                            if j + 1 < len(requestTimes):
                                requestTimes[j + 1] = requestTimes[j]
                                sumRts[j + 1] = sumRts[j]
                                sumLikes[j + 1] = sumLikes[j]

                            else:
                                requestTimes.append(requestTimes[j])
                                sumRts.append(sumRts[j])
                                sumLikes.append(sumLikes[j])
                            j -= 1
                        if j + 1 < len(requestTimes):
                            requestTimes[j + 1] = requestTime
                            sumRts[j + 1] = rts[i]
                            sumLikes[j + 1] = likes[i]
                        else:
                            requestTimes.append(requestTime)
                            sumRts.append(rts[i])
                            sumLikes.append(likes[i])

                    else:

                        requestTimes.append(requestTime)
                        sumRts.append(rts[i])
                        sumLikes.append(likes[i])
                else:

                    index = requestTimes.index(requestTime)
                    sumRts[index] += rts[i]
                    sumLikes[index] += likes[i]
        else:
            for i in range(len(requests)):
                requestTime = datetime.strftime(requests[i], '%d/%m/%Y %H:%M')
                if requestTime not in requestTimes:

                    if len(requestTimes) > 0:
                        j = len(requestTimes) - 1
                        while j >= 0 and requestTime < requestTimes[j]:
                            if j + 1 < len(requestTimes):
                                requestTimes[j + 1] = requestTimes[j]
                                sumRts[j + 1] = sumRts[j]
                                sumLikes[j + 1] = sumLikes[j]

                            else:
                                requestTimes.append(requestTimes[j])
                                sumRts.append(sumRts[j])
                                sumLikes.append(sumLikes[j])
                            j -= 1
                        if j + 1 < len(requestTimes):
                            requestTimes[j + 1] = requestTime
                            sumRts[j + 1] = rts[i]
                            sumLikes[j + 1] = likes[i]
                        else:
                            requestTimes.append(requestTime)
                            sumRts.append(rts[i])
                            sumLikes.append(likes[i])

                    else:

                        requestTimes.append(requestTime)
                        sumRts.append(rts[i])
                        sumLikes.append(likes[i])
                else:

                    index = requestTimes.index(requestTime)
                    sumRts[index] += rts[i]
                    sumLikes[index] += likes[i]

    if len(sumLikes) > 0:
        sumLikes2 = [sumLikes[0]]
        sumRts2 = [sumRts[0]]
        for i in range(1, len(requestTimes)):
            sumLikes2.append(sumLikes2[i - 1] + sumLikes[i])
            sumRts2.append(sumRts2[i - 1] + sumRts[i])

    data = []
    for i in range(len(requestTimes)):
        data.append({"time": requestTimes[i], "sum_like": sumLikes2[i], "sum_rt": sumRts2[i]})


    users = get_tweets_with_its_user(tweets)
    n = [{"tweets": t, "user": u} for t, u in zip(tweets, users)]


    return {"tweets": n, "data": data}



#Palabras mas frecuentes en resultado de busqueda de tweets por palabra
@graph.route('/nube', methods=['GET'])
def show_frecuencia():

    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polaridad = request.args.getlist('polaridad')

    tweets = get_filtros(words, date, accounts, polaridad)
    users = get_tweets_with_its_user(tweets)
    n = [{"tweets": t, "user": u} for t, u in zip(tweets, users)]

    words3 = []
    counts = []
    for tweet in n:
        words2 = tweet["tweets"]["text"].split(" ")
        processedWords = utils.remove_stop_words(utils.emoji(utils.signos(utils.https(utils.numbers(words2)))))

        for word in processedWords:
            if word != '':
                if (word.lower() not in words3):
                    words3.append(word.lower())
                    counts.append(1)

                else:
                    index = words3.index(word.lower())
                    counts[index] += 1

    ans = [{"_id": word, "count": count} for word, count in zip(words3, counts)]
    fd = nltk.FreqDist(counts)
    freqq = []
    ans2 = []

    for item in ans:
        num = item['count']
        t = num/np.sum(counts)
        freqq.append(t)

    prom = np.mean(freqq)
    de = np.std(freqq)
    for item in ans:
        if freqq[ans.index(item)] > prom+de and item['_id'] not in words:
            ans2.append(item)

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
            sin_num = utils.numbers(palabras)
            sin_imag = utils.https(sin_num)
            sin_puntos = utils.signos(sin_imag)
            sin_emojis = utils.emoji(sin_puntos)
        users2.append({'name': user['user'], 'words': sin_emojis})

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



