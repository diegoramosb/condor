from pymongo import MongoClient
from pprint import pprint
from pymongo.errors import DuplicateKeyError
from datetime import datetime

"""MongoDB connection"""
# client = MongoClient('172.24.99.115', 27017)
client = MongoClient('localhost', 27017)
db = client['proyecto2020']
tweetsCollection = db['tweets']
usersCollection = db['usuarios']

def search_by_keywords(word):
    return list(tweetsCollection.find({"$text": {"$search": word}}))


def search_by_string(ph):
    return list(tweetsCollection.find({"$text": {"$search": ph}}))

def search_by_user(name):
    us = usersCollection.find({"$text": {"$search": name}})
    for inf in us:
        return list(tweetsCollection.find({'userId': inf['_id']}))


def search_by_date(startDate, endDate):
    return list(tweetsCollection.find({"date": {"$gte": startDate, "$lt": endDate}}))


def searchUserId(id):
    return list(usersCollection.find({'_id': id}))

def saveTweetsMongo(tweets):
    """
    Saves the tweets in a MongoDB collection
    :param collection: MongoDB collection object
    :param tweets: tweets to save
    """
    cnt = 0

    for t in tweets:
        t['_id'] = t['id']
        date = datetime.strptime(t['created_at'], '%a %b %d %H:%M:%S %z %Y')
        newTweet = {
            '_id':t['id'],
            'url':'twitter.com/{}/status/{}'.format(t['user']['screen_name'],t['id']),
            'text':t['full_text'],
            'date':date,
            'userId':t['user']['id'],
            'retweet_count':[t['retweet_count']],
            'favorite_count':[t['retweet_count']],
            'request_times':[datetime.now()]
        }
        try:
            tweetsCollection.insert_one(newTweet)
            print("Added: {}".format(t['_id']))
            cnt += 1

        except DuplicateKeyError:
            print("{} already in DB".format(t['_id']))

        if (usersCollection.find_one({"_id": t['user']['id']})) is None:
                newuser = {'_id': t['user']['id'], 'name': t['user']['name'], 'screen_name': t['user']['screen_name']}
                usersCollection.insert_one(newuser)
    print("--- Added {} new tweets ---".format(cnt))


