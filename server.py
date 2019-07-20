#!/usr/bin/env python
import sys
import json
from flask import Flask, render_template, request, jsonify
#sys.path.append('./src/')
#import parser.Formula as Formula
from src import parser
from src import lexer
from src import colors

app = Flask(__name__)

@app.route('/ajax', methods=['POST'])
def ajax_req():
    package = []
    print("request data:")
    g = str(request.data)
    print(g)
    p = parser.Parser()
    tables, dist, truth = p.read_string(g);
    print(tables)
    print(dist)
    print(truth)
    package.append(tables)
    package.append(dist)
    package.append(truth)
    return jsonify(package)

@app.route("/")
def server_static():
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(debug = True)
