from extract_tweets import *
from pprint import pprint
from matplotlib.ticker import FuncFormatter
import matplotlib.pyplot as plt

accounts = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']
word = "Real madrid"
phrase = "\"Bogotá\""
username= "@elespectador"

# tweets = extractTweetsApi(accounts, 50)
# saveTweetsMongo(collection, tweets, user)

client = MongoClient('localhost', 27017)
db = client['proyecto20202']
collection = db['tweets']
user =db['usuarios']

ans = search_by_word(word)
# search_by_phrases(collection,phrase, user)
search_by_user(username)
search_by_date(datetime(2020, 3, 1, 0, 0, 0), datetime(2020, 3, 2, 23, 59, 0))

for a in ans:
    pprint(a)




print("done")
