from extract_tweets import *
from pymongo import MongoClient
from pprint import pprint

accounts = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']
word = " Real madrid"
phrase = "\"Bogotá\""
username= "@elespectador"


client = MongoClient('localhost', 27017)
db = client['proyecto20202']
collection = db['tweets']
user =db['usuarios']


tweets = extractTweetsApi(accounts, 10)

saveTweetsMongo(collection, tweets, user)


search_by_word(collection, word)
search_by_phrases(collection,phrase, user)
search_by_user(user,username, collection)
search_by_date(collection, user)

print("done")
