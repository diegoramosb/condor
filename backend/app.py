from datetime import datetime
import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging, logging.config

from db import get_filtros, deleteUserAndTweets, saveTweetsMongoOne
from db import search_tweets_after, updateTweets, updatePolarity, saveTweetsMongo, return_tweets, searchUserId, return_accounts

from extract_tweets import searchTweetById, extractTweetsApi, extract, lookup_user, updateTweetsByAccount
from util.Preprocessor import Preprocessor
from graphs import graph

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
    updateTweets(updatedTweets)
    return {'nUpdated': len(updatedTweets)}, 200


@app.route('/extractTweets', methods=['GET'])
def extractTweetsByAccount():
    """
    Extrae un número de tweets de la API
    """
    number = int(request.args.get('number'))
    accounts = request.args.getlist('account')
    tweets = extractTweetsApi(accounts, number)
    result = model(tweets)
    newCount = saveTweetsMongo(tweets, result)
    
    return {'newTweets': newCount}, 200

def model(tweets):
    pipeline = joblib.load(open('util/filename.joblib', 'rb'))
    tuits = []
    for t in tweets:
        tuits.append(t['full_text'])
    result = pipeline.predict(tuits)

    return result


@app.route('/getAccounts', methods=['GET'])
def getAccounts():
    return jsonify(return_accounts())


@app.route('/tweets', methods=['GET'])
def get_all_tweets():
    tweets = return_tweets()
    users = []
    for t in tweets:
        t["_id"] = str(t["_id"])
        users.append(searchUserId(t['userId']))
    o = [{"account": x, "tweet": y} for x, y in zip(users, tweets)]
    return jsonify(o)


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
    return jsonify(o)


@app.route('/setPolarity', methods=['PUT'])
def set_polarity():
    updatePolarity(request.get_json()['tweetId'], request.get_json()['polarity'])
    return {}, 200

@app.route('/searchUser', methods=['GET'])
def search_user():
    return jsonify(lookup_user(request.args.get('screenName'))), 200


def register_error_handlers(app):

    @app.errorhandler(500)
    def internal_error(e):
        logging.exception(e)
        return "500 error", 500

    @app.errorhandler(404)
    def not_found(e):
        logging.error(e)
        return "404  error", 404

    @app.errorhandler(Exception)
    def exception_handler(error):
        logging.exception(error)
        return {"error": repr(error)}, 500
if __name__ == '__main__':
    register_error_handlers(app)

    logging.basicConfig(
        level = logging.INFO,
        format= "%(asctime)s [%(levelname)s] %(message)s",
        handlers = [
            logging.FileHandler('{}.log'.format(datetime.today().strftime('%Y-%m-%d'))),
            logging.StreamHandler()
        ]
    )
    app.run(host="0.0.0.0", port=9090, debug=False, threaded=True)


