from extract_tweets import *
from pymongo import MongoClient

accounts = ['@ELTIEMPO', '@elespectador']

tweets = extractTweetsApi(accounts, 10)


client = MongoClient('localhost', 27017)
db = client['proyecto2020']
collection = db['tweets']

saveTweetsMongo(collection, tweets)
print('done')
