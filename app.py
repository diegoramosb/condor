from datetime import datetime

from flask import Flask, jsonify, request
from db import search_tweets_after, updateTweets, saveTweetsMongo
from extract_tweets import searchTweetById, extractTweetsApi
from graphs import graph
from flask_cors import CORS

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
    tweets = search_tweets_after(datetime.today())
    updatedTweets = []
    for t in tweets:
        updatedTweets.append(searchTweetById(t["_id"]))
    updateTweets(updatedTweets)
    for t in updatedTweets:
        print(t["id"])
    return 'Ok', 200

@app.route('/extractTweets', methods=['GET'])
def extractTweetsByAccount():
    accounts = request.args.getlist('account')
    tweets = extractTweetsApi(accounts, 5)
    saveTweetsMongo(tweets)

    return 'Ok', 200



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9090, debug=True, threaded=True)
