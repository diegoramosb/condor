from datetime import datetime
from bson import ObjectId
import tweepy
import json
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

        except DuplicateKeyError:
            print("{} already in DB".format(t['_id']))


        if (user.find_one({"_id": t['user']['id']})) is None:
                newuser = {'_id': t['user']['id'], 'name': t['user']['name'], 'screen_name': t['user']['screen_name']}
                user.insert_one(newuser)
    print("--- Added {} new tweets ---".format(cnt))



def search_by_word(tweets, word):

    txt = tweets.find({ "$text": { "$search": word}})

    for texto in txt:
        pprint(texto)

def search_by_phrases(tweets, ph, user):

    txt = tweets.find({ "$text": { "$search": ph}})

    for texto in txt:
        us= user.find({'_id': texto['userId']})

        pprint(texto)
        pprint(us)



def search_by_user (user, name, tweets):

    us = user.find({"$text": {"$search": name}})

    for inf in us:
        tw = tweets.find({'userId': inf['_id']})
        for t in tw:
            pprint(t)


def search_by_date (tweets,user):
    startDate = datetime(2020, 2, 19, 0, 0, 0)
    endDate = datetime(2020, 3, 2, 0, 0, 0)

    txt = tweets.find({"date": {"$gte": startDate, "$lt": endDate}})

    for texto in txt:
        pprint(texto)