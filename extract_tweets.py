import tweepy
import json
from pymongo import MongoClient


twitterKeys = {
    'apiKey': 'apiKey_here',
    'apiSecret': 'apiSecret_here',
    'accessTokenKey': 'accessTokenKey_here',
    'accesTokenSecret': 'accessTokenSecret_here'
}

auth = tweepy.OAuthHandler(twitterKeys['apiKey'], twitterKeys['apiSecret'])
auth.set_access_token(twitterKeys['accessTokenKey'], twitterKeys['accesTokenSecret'])

api = tweepy.API(auth)

def extractTweetsApi(accounts):
    jsons = []
    for id in accounts:
        for status in tweepy.Cursor(api.user_timeline, screen_name=id, tweet_mode="extended", count=5).items():
            jsonStr = json.dumps(status._json)
            parsed = json.loads(jsonStr)
            jsons.append(parsed)
            if len(jsons) > 50:
                break
    return jsons

def saveTweetsJsonFile(tweets):
    with open('tweets.json', 'w') as outfile:
        json.dump(tweets, outfile)

def readTweetsJson():
    with open('tweets.json', 'r') as file:
        return json.load(file)

def searchTweets(string, tweetArray):
    ans = []
    for tweet in tweetArray:
        if tweet['full_text'].find(string) != -1:
            ans.append(tweet)
    return ans

def saveTweetsMongo(tweets):
    client = MongoClient('localhost', 27017)
    db = client['proyecto2020']
    collection = db['tweets']
    for t in tweets:
        t['_id'] = t['id']
        t.pop('id')
        collection.insert_one(t)
