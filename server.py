#!/usr/bin/env python
import sys
import json
import requests
from flask import Flask, render_template, request, jsonify
from src import parser
from src import lexer

app = Flask(__name__)

@app.route('/ajax', methods=['POST'])
def ajax_req():
    ''' Evaluate formulae and return their truth values '''
    
    # decode formulae
    formulae = request.data.decode('UTF-8') 
    
    # construct a logic parser
    p = parser.Parser()

    # return a list of truth values
    package = p.read_string(formulae, True)
    
    print(package)
    
    return jsonify(package)

@app.route("/")
def server_static():
    ''' Return Organon's landing page '''
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(threaded=True)
