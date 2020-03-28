from flask import Flask, jsonify
from graphs import graph
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(graph)


@app.route('/')
def home():
    return jsonify({"text":"hello world"})

@app.route("/home", methods=["GET"])
def index():
    return "App running"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9090, debug=True, threaded=True)
