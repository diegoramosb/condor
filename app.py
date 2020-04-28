import json
import parser
from datetime import datetime

from flask import Flask, jsonify, request

import utils
from db import search_tweets_after, updateTweets, saveTweetsMongo, search_by_keywords, search_by_user, return_tweets, \
    searchUserId, deleteById
from extract_tweets import searchTweetById, extractTweetsApi
from graphs import graph
from flask_cors import CORS
from dateutil import parser
from jsonmerge import merge

app = Flask(__name__)
CORS(app)
app.register_blueprint(graph)


accountsx = ['@ELTIEMPO', '@elespectador', '@RevistaSemana']
word = "coronavirus"
string = '"Real Madrid"'
username= "@elespectador"
accountsList = []

@app.route('/')
def home():
    return jsonify({"text":"hello world"})

@app.route("/home", methods=["GET"])
def index():
    return "App running"

@app.route('/updateTweets', methods=['GET'])
def updateTweetsToday():
    tweets = search_tweets_after(datetime.today())
    updatedTweets = []
    for t in tweets:
        updatedTweets.append(searchTweetById(t["_id"]))
    updateTweets(updatedTweets)
    for t in updatedTweets:
        print(t["id"])
    return 'Ok', 200
## poner OK en json
@app.route('/extractTweets', methods=['GET'])
def extractTweetsByAccount():
    accounts = request.args.getlist('account')
    for a in accounts:
        accountsList.append(a)

    tweets = extractTweetsApi(accounts, 5)
    saveTweetsMongo(tweets)

    return 'Ok', 200

@app.route('/getAccounts', methods=['GET'])
def getAccounts():
    print(accountsList)
    accounts_response = utils.list_to_json(accountsList)
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
    return 'Ok', 200
    #tweets_response = utils.list_to_json(tweets)
   # return utils.JSONResponse(tweets_response)



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9090, debug=True, threaded=True)
