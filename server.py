#!/usr/bin/env python
import sys
import json
from flask import Flask, render_template, request, jsonify
from src import parser
from src import lexer

app = Flask(__name__)

def respond(data, mode):
    ''' select correct function from parser interface '''
    p = parser.Parser()
    return p.get_tables(data) if mode == 't' else p.get_validity(data)

@app.route('/valid', methods=['POST'])
def valid_req():
    ''' return the validity of deriving a conclusion from a set of formulae '''
    # decode formulae
    formulae = request.data.decode('UTF-8')
    
    # determine the mode for the request
    # t -> truth tables
    # v -> validity
    mode = formulae[-1]
    
    # grab formulae
    formulae = formulae[0:-1]
    
    # parse the formulae and return the truth matrices
    package = respond(formulae, mode)
    
    return jsonify(package)

@app.route("/")
def server_static():
    ''' Return Organon's landing page '''
    return render_template('./index.html')

if __name__ == "__main__":
    app.run(threaded=True)
