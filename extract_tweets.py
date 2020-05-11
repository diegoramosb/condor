from pprint import pprint
from tweepy import StreamListener
from tweepy import Stream

import tweepy
import json

from flask import Blueprint, request

from db import return_accounts, saveTweetsMongo

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
            ##pprint(id)
            jsonStr = json.dumps(status._json)
            parsed = json.loads(jsonStr)
            pprint(parsed)
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
        users.append({"id": id, "name": name, "screen_name": screenName, "img": img})
    return users


class MyStreamListener(StreamListener):

    def on_status(self, status):
        print(status.text)


listener = MyStreamListener()
myStream = Stream(auth, listener)


@extract.route('/updateTweetsByAccount', methods=['GET'])
def updateTweetsByAccount():
    follow = []
    for a in return_accounts():
        follow.append(a['_id'])
    pprint(follow)

    try:
        #myStream.userstream('eltiempo')
        for a in follow:
            myStream.filter(follow=a)
        #tuit = myStream.filter(follow=['14834302'])
        #saveTweetsMongo(tuit)
        return 'ok', 200
    except:
        print
        "error!"
        myStream.disconnect()
