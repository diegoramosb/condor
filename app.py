import json
import parser
from datetime import datetime

from flask import Flask, jsonify, request

import utils

from db import search_tweets_after, updateTweets, saveTweetsMongo, search_by_keywords, search_by_user, return_tweets, \
    searchUserId, deleteById

from db import search_tweets_after, updateTweets, updatePolarity, saveTweetsMongo, search_by_keywords, search_by_user, return_tweets, searchUserId, return_accounts

from extract_tweets import searchTweetById, extractTweetsApi
from graphs import graph
from flask_cors import CORS
from dateutil import parser

app = Flask(__name__)
CORS(app)
app.register_blueprint(graph)


accountsx = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']
word = "coronavirus"
string = '"Real Madrid"'
username= "@elespectador"

@app.route('/')
def home():
    return jsonify({"text":"hello world"})

@app.route("/home", methods=["GET"])
def index():
    return "App running"

@app.route('/updateTweets', methods=['GET'])
def updateTweetsToday():
    """
    Actualiza likes y retweets de los tweets del día
    """
    tweets = search_tweets_after(datetime.today())
    print("tweets: ", tweets)
    updatedTweets = []
    for t in tweets:
        updatedTweets.append(searchTweetById(t["_id"]))
    response = updateTweets(updatedTweets)
    for t in updatedTweets:
        print(t["id"])
    return response, 200

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
        users.append(searchUserId(t['userId']))
    #merged_list = tuple(zip(users, tweets))
    o = [{"account": x, "tweet": y} for x, y in zip(users, tweets)]
    tweets_response = utils.list_to_json(o)

    return utils.JSONResponse(tweets_response)

@app.route('/delete', methods=['DELETE'])
def delete_tweets_byAccount():
    id = request.args.get('id')
    deleteById(id)
    return 'Ok', 200

@app.route('/tweetsbydate', methods=['GET'])
def get_tweets_date():
    date = request.args.get('date')
    users = []
    dt = parser.parse(date)
    tweets = search_tweets_after(dt)

    for t in tweets:
        users.append(searchUserId(t['userId']))

    o = [{"account": x, "tweet": y} for x, y in zip(users, tweets)]


    tweets_response = utils.list_to_json(o)
    return utils.JSONResponse(tweets_response)

@app.route('/tweetsbyword', methods=['GET'])
def show_tweets_by_word():
    word = request.args.get('word')
    users = []
    tweets = search_by_keywords(word)

    for t in tweets:
        users.append(searchUserId(t['userId']))

    o = [{"account": x, "tweet": y} for x, y in zip(users, tweets)]

    tweets_response = utils.list_to_json(o)
    return utils.JSONResponse(tweets_response)

@app.route('/tweetsbyuser', methods=['GET'])
def show_tweets_by_user():
    user = request.args.get('user')
    tweets = search_by_user(user)
    print(tweets)
    #return 'Ok', 200
    #tweets_response = utils.list_to_json(tweets)
    #return utils.JSONResponse(tweets_response)


@app.route('/tweetsbyall', methods=['GET'])
def filters():
    #fecha, usuario,palabra
    info = request.args.getlist('info')
    o = []
    for i in info:
        if utils.is_date(i):

            users = []
            dt = parser.parse(i)
            tweets = search_tweets_after(dt)

            for t in tweets:
                users.append(searchUserId(t['userId']))

            o += [{"account": x, "tweet": y} for x, y in zip(users, tweets)]

        elif utils.isAccount(i):
            users = []
            tweets = search_by_user(i)

            o += [{"account": i, "tweet": y} for y in zip(tweets)]

        elif utils.hasString(i):
            users = []
            tweets = search_by_keywords(i)

            for t in tweets:
                users.append(searchUserId(t['userId']))

            o += [{"account": x, "tweet": y} for x, y in zip(users, tweets)]

    tweets_response = utils.list_to_json(o)
    return utils.JSONResponse(tweets_response)
    return 'Ok', 200
    # tweets_response = utils.list_to_json(tweets)


# return utils.JSONResponse(tweets_response)


@app.route('/setPolarity', methods=['PUT'])
def set_polarity():
    updatePolarity(request.args.get('tweetId'), request.args.get('polarity'))
    return {}, 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9090, debug=True, threaded=True)
