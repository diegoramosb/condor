from flask import Flask,render_template

from graphs import graph

app = Flask(__name__)
app.register_blueprint(graph)


@app.route('/')
def home():
    return render_template("index.html")

@app.route("/home", methods=["GET"])
def index():
    return "App running"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9090, debug=False, threaded=True)
