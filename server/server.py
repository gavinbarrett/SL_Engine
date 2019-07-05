#!/usr/bin/env python
import sys
from flask import Flask, render_template, request, jsonify
sys.path.append('~/Deploy/SL_Engine/src/')
import parser

app = Flask(__name__)

@app.route('/ajax', methods=['POST'])
def ajax_req():
    print("request data:")
    print(request.data)
    g = request.data
    #parser.Formula(g)
    return jsonify(g)

@app.route("/")
def server_static():
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(debug = True)
