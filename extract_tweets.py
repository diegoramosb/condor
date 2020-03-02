from datetime import datetime
from bson import ObjectId
import tweepy
import json
from pymongo import MongoClient
from pprint import pprint
from pymongo.errors import DuplicateKeyError

"""Twitter API keys"""
twitterKeys = {
    'apiKey': 'apiKey_here',
    'apiSecret': 'apiSecret_here',
    'accessTokenKey': 'accessTokenKey_here',
    'accesTokenSecret': 'accessTokenSecret_here'
}

"""Twitter API authentication"""
auth = tweepy.OAuthHandler(twitterKeys['apiKey'], twitterKeys['apiSecret'])
auth.set_access_token(twitterKeys['accessTokenKey'], twitterKeys['accesTokenSecret'])
api = tweepy.API(auth)

"""MongoDB connection"""
# client = MongoClient('172.24.99.115', 27017)
client = MongoClient('localhost', 27017)
db = client['proyecto2020']
tweets = db['tweets']
users = db['usuarios']


def extractTweetsApi(accounts, nTweets):
    """
    Extracts tweets from the selected accounts and returns a dict array containing them
    :param accounts: string array with the account names. e.g. '@Uniandes'
    :param nTweets: maximum number of tweets to extract from each account
    :return: dict array with the tweets
    """
    jsons = []
    for id in accounts:
        for status in tweepy.Cursor(api.user_timeline, screen_name=id, tweet_mode="extended").items(nTweets):
            jsonStr = json.dumps(status._json)
            parsed = json.loads(jsonStr)
            jsons.append(parsed)
    return jsons

def searchTweets(string, tweetArray):
    """
    Searchs for a string in a tweet dict array
    :param string: string to search
    :param tweetArray: string of tweets in dict format
    :return: the tweets with the searched string
    """
    ans = []
    for tweet in tweetArray:
        if tweet['full_text'].find(string) != -1:
            ans.append(tweet)
    return ans

def saveTweetsMongo(collection, tweets, user):
    """
    Saves the tweets in a MongoDB collection
    :param collection: MongoDB collection object
    :param tweets: tweets to save
    """
    cnt = 0

    for t in tweets:
        t['_id'] = t['id']
        date = datetime.strptime(t['created_at'], '%a %b %d %H:%M:%S %z %Y')
        newTweet = {'_id':t['id'], 'text':t['full_text'], 'date':date, 'userId':t['user']['id']}
        try:
            collection.insert_one(newTweet)
            print("Added: {}".format(t['_id']))
            cnt += 1

        except DuplicateKeyError:
            print("{} already in DB".format(t['_id']))

        if (user.find_one({"_id": t['user']['id']})) is None:
                newuser = {'_id': t['user']['id'], 'name': t['user']['name'], 'screen_name': t['user']['screen_name']}
                user.insert_one(newuser)
    print("--- Added {} new tweets ---".format(cnt))

def search_by_word(word):
    return list(tweets.find({"$text": {"$search": word}}))

def search_by_phrases(ph, user):
    txt = tweets.find({ "$text": { "$search": ph}})

    for texto in txt:
        pprint(texto)
        cursor = user.find({'_id': texto['userId']})
        for usr in cursor:
            pprint(usr)

def search_by_user (name):
    us = users.find({"$text": {"$search": name}})
    for inf in us:
        return list(tweets.find({'userId': inf['_id']}))


def search_by_date (startDate, endDate):
    return list(tweets.find({"date": {"$gte": startDate, "$lt": endDate}}))