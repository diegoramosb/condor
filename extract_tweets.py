import tweepy
import json
import pymongo
import firebase_admin as fb
from firebase_admin import credentials, firestore


twitterKeys = {
    'apiKey': 'apiKey here',
    'apiSecret': 'apiSecret here',
    'accessTokenKey': 'accessTokenKey here',
    'accesTokenSecret': 'accessTokenSecret here'
}

auth = tweepy.OAuthHandler(twitterKeys['apiKey'], twitterKeys['apiSecret'])
auth.set_access_token(twitterKeys['accessTokenKey'], twitterKeys['accesTokenSecret'])

api = tweepy.API(auth)

accounts = ['@realDonaldTrump', '@petrogustavo']
jsons = []

cred = fb.credentials.Certificate("./proyecto2020-82afc-5d1e189a764c.json")
fb.initialize_app(cred)
db = firestore.client()

def extractTweets():
    for id in accounts:
        for status in tweepy.Cursor(api.user_timeline, screen_name=id, tweet_mode="extended", count=5).items():
            jsonStr = json.dumps(status._json)
            parsed = json.loads(jsonStr)
            jsons.append(parsed)
            if len(jsons) > 50:
                break
    with open('tweets.json', 'w') as outfile:
        json.dump(jsons, outfile)

def searchTweets(word):
    ans = []
    with open('tweets.json', 'r') as file:
        data = json.load(file)
        for tweet in data:
            if tweet['full_text'].find(word) != -1:
                ans.append(tweet['full_text'])
    return ans    

def saveTweets():
    tweets = []
    with open('tweets.json', 'r') as file:
        data = json.load(file)
        for tweet in data:
            tweets.append(tweet)
    for t in tweets:
        id = t['id']
        print(t['place'])
        # t['place'].pop('bounding_box')
        # db.collection(u'tweets').document(str(id)).set(t)

# saveTweets()
print('done')