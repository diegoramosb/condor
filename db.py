import joblib
from bson import ObjectId
from pymongo import MongoClient
from pprint import pprint
from pymongo.errors import DuplicateKeyError
from datetime import datetime, timedelta
from dateutil import parser

from utils import isAccount

"""MongoDB connection"""

username = 'mongodb username here'
mongodb mongodb_password_here here = '&Si93JSSWh%udMqV1rtu'
client = MongoClient('mongodb://{}:{}@172.24.99.115'.format(username, mongodb mongodb_password_here here))
db = client['proyecto20203']

tweetsCollection = db['tweets']
usersCollection = db['usuarios']


def return_accounts():
    return usersCollection.find()

def return_tweets():
    return list(tweetsCollection.find().sort([('date', -1)]))

def return_tweets_complete():

    us = usersCollection.find({'_id': id})
    for inf in us:
        return list(tweetsCollection.find({'userId': inf['_id']}))

def search_by_keywords(word):
    return list(tweetsCollection.find({"$text": {"$search": word}}))


def search_by_string(ph):
    return list(tweetsCollection.find({"$text": {"$search": ph}}))


def search_by_user(name):
    us = usersCollection.find({"$text": {"$search": name}})
    for inf in us:
        return list(tweetsCollection.find({'userId': inf['_id']}))


def search_by_date_range(startDate, endDate):
    return list(tweetsCollection.find({"date": {"$gte": startDate, "$lt": endDate}}))


def search_tweets_after(startDate):
    return list(tweetsCollection.find({"date": {"$gte": startDate}}))


def searchUserId(id):
    return list(usersCollection.find({'_id': id}))

def search_most_common_words(word):

    agr =[
        {
            "$match": {
                "$text": {
                    "$search": word
                }
            }
        },
        {
            "$project": {
                "words": {"$split": ["$text", " "]},

            }
        },
        {
            "$unwind": "$words"

        },
        {
            "$group": {
                "_id": "$words",
                "count": {"$sum": 1}

            }
        }

    ]
    return list(tweetsCollection.aggregate(agr))

def get_filtros(words, date, accounts, polarities):

    arr = []
    us = []

    if len(accounts) >0:
        for a in accounts:
            idm = usersCollection.find_one({"screen_name":  a})
            if idm is not None:
                us.append(idm['_id'])

        p = {'$or': []}
        if len(us) > 0:
            for u in us:
                p['$or'].append({'userId': u})
            arr.append(p)

    o = {'$text': {'$search': ""}}
    if len(words) > 0:
        for w in words:
            o['$text']['$search'] = o['$text']['$search'] + w + ' '
        o['$text']['$search'] = o['$text']['$search'].strip()
        arr.append(o)
    if date is not None:
        dt = datetime.strptime(date, "%Y-%m-%d")
        arr.append({"date": {"$gte": dt}})

    if len(polarities)>0:
        p = {'$or': []}
        for pol in polarities:
            p['$or'].append({'polarity': pol})    
        arr.append(p)

    if len(arr) > 0:
        return list(tweetsCollection.find({'$and': arr}))
    
    else:
        return return_tweets()


def getIdsAccounts():
    return list(usersCollection)

def saveTweetsMongo(tweets, result):
    """
    Saves the tweets in a MongoDB collection
    :param collection: MongoDB collection object
    :param tweets: tweets to save
    """
    cnt = 0

    for t in tweets:
        t['_id'] = t['id']

        date = datetime.strptime(t['created_at'], '%a %b %d %H:%M:%S %z %Y') - timedelta(hours=5)


        if t['entities'] is None:
            if t['entities']['media'] is None:

                newTweet = {
                    '_id': t['id'],
                    'url': 'twitter.com/{}/status/{}'.format(t['user']['screen_name'], t['id']),
                    'text': t['full_text'],
                    'date': date,
                    'userId': t['user']['id'],
                    'retweet_count': [t['retweet_count']],
                    'favorite_count': [t['favorite_count']],
                    'request_times': [datetime.now()],
                    'polarity': result[tweets.index(t)]
            }

            else:

                media = t['entities']['media'][0]['media_url']
                newTweet = {
                    '_id': t['id'],
                    'url': 'twitter.com/{}/status/{}'.format(t['user']['screen_name'], t['id']),
                    'text': t['full_text'],
                    'media_link': media,
                    'date': date,
                    'userId': t['user']['id'],
                    'retweet_count': [t['retweet_count']],
                    'favorite_count': [t['favorite_count']],
                    'request_times': [datetime.now()],
                    'polarity':result[tweets.index(t)]
            }
        else:
            newTweet = {
                '_id': t['id'],
                'url': 'twitter.com/{}/status/{}'.format(t['user']['screen_name'], t['id']),
                'text': t['full_text'],
                'date': date,
                'userId': t['user']['id'],
                'retweet_count': [t['retweet_count']],
                'favorite_count': [t['favorite_count']],
                'request_times': [datetime.now()],
                'polarity': result[tweets.index(t)]
            }
        try:
            print(newTweet)
            tweetsCollection.insert_one(newTweet)
            print("Added: {}".format(t['_id']))
            cnt += 1

        except:
            print('todo mal')
            #print("{} already in DB".format(t['_id']))

        if (usersCollection.find_one({"_id": t['user']['id']})) is None:
            newuser = {'_id': t['user']['id'], 'name': t['user']['name'], 'screen_name': t['user']['screen_name'], 'profile_image':  t['user']['profile_image_url_https']}
            usersCollection.insert_one(newuser)
    return(cnt)


def saveTweetsMongoOne(t, result):
    """
    Saves the tweets in a MongoDB collection
    :param collection: MongoDB collection object
    :param tweets: tweets to save
    """


    success = False
    t['_id'] = t['id']

    date = datetime.strptime(t['created_at'], '%a %b %d %H:%M:%S %z %Y') - timedelta(hours=5)
    newTweet = {}


    # try:
    #     pprint(t['_id'])
    #     newTweet = {
    #         '_id': t['id'],
    #         'url': 'twitter.com/{}/status/{}'.format(t['user']['screen_name'], t['id']),
    #         'text': t['extended_tweet']["full_text"],
    #         'date': date,
    #         'userId': t['user']['id'],
    #         'retweet_count': [t['retweet_count']],
    #         'favorite_count': [t['favorite_count']],
    #         'request_times': [datetime.now()],
    #         'polarity': result
    #     }
    #     #pprint(t['_id'])
    #
    # except AttributeError:
    #     newTweet = {
    #         '_id': t['id'],
    #         'url': 'twitter.com/{}/status/{}'.format(t['user']['screen_name'], t['id']),
    #         'text': t['text'],
    #         'date': date,
    #         'userId': t['user']['id'],
    #         'retweet_count': [t['retweet_count']],
    #         'favorite_count': [t['favorite_count']],
    #         'request_times': [datetime.now()],
    #         'polarity': result
    #
    #     }
    # finally:
    #     try:
    #         tweetsCollection.insert_one(newTweet)
    #         print("Added: {}".format(t['_id']))
    #         # print(newTweet['text'])
    #         print(newTweet)
    #         success = True
    #     except DuplicateKeyError:
    #         print("{} already in DB".format(t['_id']))
    #     if (usersCollection.find_one({"_id": t['user']['id']})) is None:
    #         newuser = {'_id': t['user']['id'], 'name': t['user']['name'], 'screen_name': t['user']['screen_name'],
    #                    'profile_image': t['user']['profile_image_url_https']}
    #         usersCollection.insert_one(newuser)
    #     return (success)


def updateTweets(tweets):
    for t in tweets:
        tweetsCollection.update({"_id": t["id"]}, {"$push": {"retweet_count": t["retweet_count"]}})
        tweetsCollection.update({"_id": t["id"]}, {"$push": {"favorite_count": t["favorite_count"]}})
        tweetsCollection.update({"_id": t["id"]}, {"$push": {"request_times": datetime.now()}})

def updatePolarity(tweetId, polarity):
    tweetsCollection.update_one({"_id": int(tweetId)}, {"$set": {"polarity": polarity}})

def deleteUserAndTweets(userId):
    tweetsCollection.delete_many({"userId": int(userId)})
    usersCollection.delete_one({"_id": int(userId)})


def get_filtros_or(words, date, accounts, polarities):
    arr = []
    us = []

    if len(accounts) > 0:
        for a in accounts:
            idm = usersCollection.find_one({"screen_name": a})
            if idm is not None:
                us.append(idm['_id'])

        p = {'$or': []}
        for u in us:
            p['$or'].append({'userId': u})

        arr.append(p)

    o = {'$text': {'$search': ""}}
    if len(words) > 0:
        for w in words:
            o['$text']['$search'] = o['$text']['$search'] + '"' + w + '"' + ' '
        o['$text']['$search'] = o['$text']['$search'].strip()
        arr.append(o)

    if date is not None:
        dt = parser.parse(date)
        arr.append({"date": {"$gte": dt}})

    if len(polarities) > 0:
        p = {'$or': []}
        for pol in polarities:
            p['$or'].append({'polarity': pol})
        arr.append(p)

    if len(arr) > 0:
        return list(tweetsCollection.find({'$and': arr}))

    else:
        return return_tweets()

