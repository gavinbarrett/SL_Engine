from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def server_static():
    return render_template('./index.html')
