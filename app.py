import pickle
from datetime import datetime

import joblib
from flask import Flask, jsonify, request


import utils

from db import get_filtros, deleteUserAndTweets, saveTweetsMongoOne
from db import search_tweets_after, updateTweets, updatePolarity, saveTweetsMongo, return_tweets, searchUserId, return_accounts

from joblib import load
from extract_tweets import searchTweetById, extractTweetsApi, extract, lookup_user, updateTweetsByAccount
from util.Preprocessor import Preprocessor
from graphs import graph
from flask_cors import CORS

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
        updated = searchTweetById(t["_id"])
        if updated is not None:
            updatedTweets.append(updated)
            response = updateTweets(updatedTweets)
    for t in updatedTweets:
        print(t["id"])
    return {'nUpdated': len(tweets)}, 200


@app.route('/extractTweets', methods=['GET'])
def extractTweetsByAccount():
    """
    Extrae un número de tweets de la API
    """
    number = int(request.args.get('number'))
    accounts = request.args.getlist('account')
    tweets = extractTweetsApi(accounts, number)
    result = model(tweets)
    #print(tweets)
    newCount = saveTweetsMongo(tweets, result)
    
    return {'newTweets': newCount}, 200

def model(tweets):
    pipeline = joblib.load(open('util/filename.joblib', 'rb'))
    tuits = []
    for t in tweets:
        tuits.append(t['full_text'])
    result = pipeline.predict(tuits)
    print(result)
    return result




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

@app.route('/delete', methods=['GET'])
def delete():
    userId = '916474355084857350'
    deleteUserAndTweets(userId)
    return {}, 200

@app.route('/searchUser', methods=['GET'])
def search_user():
    return jsonify(lookup_user(request.args.get('screenName'))), 200

if __name__ == '__main__':

    app.run(host="0.0.0.0", port=9090, debug=True, threaded=True)


