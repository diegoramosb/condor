import tweepy
import json
from pymongo.errors import DuplicateKeyError

"""Twitter API keys"""
twitterKeys = {
    'apiKey': 'M56Sn5yP02MGwzJCbn47PrL47',
    'apiSecret': 'NEO9ta8xgxqIWGKwW7IFjWdkDS6SMKDr2qZvbItJnPG3uEWIup',
    'accessTokenKey': '360954747-mb8DGzHeqckGJrjrju60eLG9ipHDG5LsyNIoYx09',
    'accesTokenSecret': '6MkOADmawkQqbP26douxoZ7cOMrpV4PgJfY6TLlzvQV1g'
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

def saveTweetsMongo(collection, tweets):
    """
    Saves the tweets in a MongoDB collection
    :param collection: MongoDB collection object
    :param tweets: tweets to save
    """
    cnt = 0
    for t in tweets:
        t['_id'] = t['id']
        newTweet = {'_id':t['id'], 'text':t['full_text'], 'date':t['created_at'], 'user':t['user']['screen_name']}
        try:
            collection.insert_one(newTweet)
            print("Added: {}".format(t['_id']))
            cnt += 1
        except DuplicateKeyError:
            print("{} already in DB".format(t['_id']))
    print("--- Added {} new tweets ---".format(cnt))

