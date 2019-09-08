#!/usr/bin/env python
import sys
import json
from flask import Flask, render_template, request, jsonify
from src import parser
from src import lexer

app = Flask(__name__)

def respond(data, p, switch):
    ''' select correct function from parser interface '''
    return p.get_tables(data) if switch else p.get_validity(data)

#TODO: refactor the two functions below into one function

@app.route('/valid', methods=['POST'])
def valid_req():
    ''' return the validity of deriving a conclusion from a set of formulae '''
    # decode formulae
    formulae = request.data.decode('UTF-8')
    print(formulae) 
    # construct a new parser
    p = parser.Parser()

    # parse the formulae and return the truth matrices
    package = respond(formulae, p, False)
    
    return jsonify(package)

@app.route('/table', methods=['POST'])
def table_req():
    ''' Evaluate formulae and return their truth values '''
    
    # decode formulae
    formulae = request.data.decode('UTF-8') 
    
    # construct a new parser
    p = parser.Parser()

    # parse the formulae and determine validity
    package = respond(formulae, p, True)

    return jsonify(package)

@app.route("/")
def server_static():
    ''' Return Organon's landing page '''
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(threaded=True)
