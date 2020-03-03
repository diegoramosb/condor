from extract_tweets import *
from pprint import pprint
from db import *
from graphs import *

accounts = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']
word = "Real Madrid"
string = '"Real Madrid"'
username= "@elespectador"

# tweets = extractTweetsApi(accounts, 50)
# saveTweetsMongo(tweets)

# results = search_by_word(word)
print(search_by_string(string))
# search_by_user(username)
# search_by_date(datetime(2020, 3, 1, 0, 0, 0), datetime(2020, 3, 2, 23, 59, 0))


# showWordFrequency(word)

print("done")
