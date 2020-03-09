from extract_tweets import *
from pprint import pprint
from db import *
from graphs import *

accounts = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']
word = "Bogotá"
string = '"Real Madrid"'
username= "@elespectador"

def updateTweetsToday():
    tweets = search_tweets_after(datetime.today())
    updatedTweets = []
    for t in tweets:
        updatedTweets.append(searchTweetById(t["_id"]))
    updateTweets(updatedTweets)

updateTweetsToday()

# tweets = extractTweetsApi([accounts[0]], 10)
# saveTweetsMongo(tweets)

# results = search_by_word(word)
# print(search_by_string(string))
# pprint(search_by_user(username))
# pprint(search_by_date(datetime(2020, 3, 1, 0, 0, 0), datetime(2020, 3, 2, 23, 59, 0)))

# showWordFrequency(word)

print("done")
