import matplotlib.pyplot as plt
import numpy as np
from statistics import mean
from db import *

def showWordFrequency(word):
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

def showFavsRtsBubble(word):
    userIds = []
    usage = []
    sumFavs =  []
    sumRts=  []
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
            sumFavs.append(f[-1])

            r = tweet['retweet_count']
            sumRts.append(r[-1])

    for userId in userIds:
        usr = searchUserId(userId)
        for username in usr:
            userNames.append(username['name'])

    pprint(mean(sumFavs))
    pprint(mean(sumRts))






