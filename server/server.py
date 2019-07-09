#!/usr/bin/env python
import sys
from flask import Flask, render_template, request, jsonify
#sys.path.append('./src/')
#import parser.Formula as Formula
from src import parser
from src import lexer
from src import colors
import drawtree

app = Flask(__name__)

@app.route('/ajax', methods=['POST'])
def ajax_req():
    print("request data:")
    print(request.data)
    g = request.data
    p = parser.Parser()

    shunt = p.read_string(g);
    
    return jsonify(shunt)

@app.route("/")
def server_static():
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(debug = True)
