import json
from datetime import datetime
from flask import Flask, jsonify, request
import utils
from pprint import pprint

from db import search_tweets_after, updateTweets, saveTweetsMongo, search_by_keywords, search_by_user, return_tweets, deleteUserAndTweets, get_filtros,searchUserId, deleteUserAndTweets
from db import search_tweets_after, updateTweets, updatePolarity, saveTweetsMongo, search_by_keywords, search_by_user, return_tweets, searchUserId, return_accounts
from extract_tweets import searchTweetById, extractTweetsApi, extract, lookup_user
from graphs import graph
from flask_cors import CORS
from dateutil import parser

app = Flask(__name__)
CORS(app)
app.register_blueprint(graph)
app.register_blueprint(extract)


@app.route('/updateTweets', methods=['GET'])
def updateTweetsToday():
    """
    Actualiza likes y retweets de los tweets del día
    """
    date = datetime.combine(datetime.today(), datetime.min.time())
    tweets = search_tweets_after(date)
    updatedTweets = []
    for t in tweets:
        updatedTweets.append(searchTweetById(t["_id"]))
    response = updateTweets(updatedTweets)
    for t in updatedTweets:
        print(t["id"])
    return {'nUpdated': len(response)}, 200


@app.route('/extractTweets', methods=['GET'])
def extractTweetsByAccount():
    """
    Extrae un número de tweets de la API
    """
    number = int(request.args.get('number'))
    accounts = request.args.getlist('account')
    tweets = extractTweetsApi(accounts, number)
    newCount = saveTweetsMongo(tweets)
    
    return {'newTweets': newCount}, 200


@app.route('/getAccounts', methods=['GET'])
def getAccounts():
    accounts = return_accounts()
    accounts_response = utils.list_to_json(accounts)
    return utils.JSONResponse(accounts_response)


@app.route('/tweets', methods=['GET'])
def get_all_tweets():
    tweets = return_tweets()
    users = []
    for t in tweets:
        t["_id"] = str(t["_id"])
        users.append(searchUserId(t['userId']))
    #merged_list = tuple(zip(users, tweets))
    o = [{"account": x, "tweet": y} for x, y in zip(users, tweets)]
    tweets_response = utils.list_to_json(o)

    return utils.JSONResponse(tweets_response)


@app.route('/unsubscribe', methods=['DELETE'])
def delete_tweets_byAccount():
    id = request.args.get('accountId')
    deleteUserAndTweets(id)
    return {}, 200


@app.route('/getfiltros', methods=['GET'])
def filters_db():

    words = request.args.getlist('word')
    date = request.args.get('date')
    accounts = request.args.getlist('account')
    polarities = request.args.getlist('polarity')

    tweets = get_filtros(words,date,accounts,polarities)
    users = []
    tweets = sorted(tweets, key=lambda tweet: tweet['date'], reverse=True)
    for t in tweets:
        t["_id"] = str(t["_id"])
        users.append(searchUserId(t['userId']))
    o = [{"account": x, "tweet": y} for x, y in zip(users, tweets)]
    tweets_response = utils.list_to_json(o)

    return utils.JSONResponse(tweets_response)
    #return {}, 200


@app.route('/setPolarity', methods=['PUT'])
def set_polarity():
    updatePolarity(request.get_json()['tweetId'], request.get_json()['polarity'])
    return {}, 200

@app.route('/searchUser', methods=['GET'])
def search_user():
    return jsonify(lookup_user(request.args.get('screenName'))), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9090, debug=True, threaded=True)
