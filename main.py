from extract_tweets import *

accounts = ['@ELTIEMPO', '@elespectador']

tweets = extractTweetsApi(accounts)
filteredTweets = searchTweets('Bogotá', tweets)
saveTweetsMongo(filteredTweets)
print('done')
