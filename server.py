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

@app.route('/valid', methods=['POST'])
def valid_req():

    formulae = request.data.decode('UTF-8')

    p = parser.Parser()
    
    package = respond(formulae, p, False)
    
    print('\nVALID PACKAGE\n')
    print(package)
    
    return jsonify(package)

@app.route('/table', methods=['POST'])
def table_req():
    ''' Evaluate formulae and return their truth values '''
    
    # decode formulae
    formulae = request.data.decode('UTF-8') 
    
    # construct a logic parser
    p = parser.Parser()

    # return a list of truth values
    package = respond(formulae, p, True)
    print('\nTABLE PACKAGE\n')
    print(package)
    
    return jsonify(package)

@app.route("/")
def server_static():
    ''' Return Organon's landing page '''
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(threaded=True)
