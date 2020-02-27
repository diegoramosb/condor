from extract_tweets import *
from pymongo import MongoClient

accounts = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']


client = MongoClient('172.24.99.115', 27017)
db = client['proyecto2020']
collection = db['tweets']

tweets = extractTweetsApi(accounts, 10)
saveTweetsMongo(collection, tweets)

print("done")
