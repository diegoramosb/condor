from datetime import datetime, timedelta
from pprint import pprint
from tweepy import StreamListener
from tweepy import Stream

import tweepy
import json

from flask import Blueprint, request

from db import return_accounts, saveTweetsMongo, saveTweetsMongoOne, x

extract = Blueprint('extract', __name__)

"""Twitter API keys"""
twitterKeys = {
    'apiKey': 'apiKey here',
    'apiSecret': 'apiSecret here',
    'accessTokenKey': 'accessTokenKey here',
    'accesTokenSecret': 'accessTokenSecret here'
}

"""Twitter API authentication"""
auth = tweepy.OAuthHandler(twitterKeys['apiKey'], twitterKeys['apiSecret'])
auth.set_access_token(twitterKeys['accessTokenKey'], twitterKeys['accesTokenSecret'])
api = tweepy.API(auth, wait_on_rate_limit=True)


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


def extractTweetsSinceId(account, nTweets, id):
    jsons = []
    for status in tweepy.Cursor(api.user_timeline, screen_name=account, tweet_mode="extended", since_id=id - 1).items(
            nTweets):
        jsonStr = json.dumps(status._json)
        parsed = json.loads(jsonStr)
        jsons.append(parsed)
    return jsons


def searchTweetById(id):
    return api.get_status(id)._json

def lookup_user(screenName):
    users = []
    for user in api.search_users(screenName, 5):
        json = user._json
        img = json['profile_image_url']
        name = json['name']
        screenName = json['screen_name']
        id = json['id']
        users.append({"_id": id, "name": name, "screen_name": screenName, "profile_image": img})
    return users


class MyStreamListener(StreamListener):
    def on_status(self, status):

        is_ret = False
        # jsons = []
        # jsonStrs = json.dumps(status._json)
        # parsed = json.loads(jsonStrs)
        # jsons.append(parsed)
        # ##pprint(jsons)
        #decoded = json.loads(status)
        #pprint(decoded)
        if hasattr(status, 'retweeted_status'):
            is_ret = True

        try:
            if is_ret == False:
                saveTweetsMongoOne(status._json)
                pprint('ok')
            else:
                print('nada')
        except Exception as e:
            print(e)
            print('error')

        return True


listener = MyStreamListener()
myStream = Stream(auth, listener)


@extract.route('/updateTweetsByAccount', methods=['GET'])
def updateTweetsByAccount():

    follow = []
    for a in return_accounts():
        follow.append(str(a['_id']))
    pprint(follow)

       # follow.append(a['_id'])


    try:
        myStream.filter(follow=follow)
        return {}, 200

    except:
        return {}, 500
