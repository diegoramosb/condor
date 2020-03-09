import tweepy
import json

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
            jsonStr = json.dumps(status._json)
            parsed = json.loads(jsonStr)
            jsons.append(parsed)
    return jsons


def extractTweetsSinceId(account, nTweets, id):
    jsons = []
    for status in tweepy.Cursor(api.user_timeline, screen_name=account, tweet_mode="extended", since_id=id-1).items(nTweets):
        jsonStr = json.dumps(status._json)
        parsed = json.loads(jsonStr)
        jsons.append(parsed)
    return jsons


def searchTweetById(id):
    return api.get_status(id)._json
