#!/usr/bin/env python
import sys
import json
from flask import Flask, render_template, request, jsonify
from src import parser
from src import lexer

app = Flask(__name__)

def respond(data):
	''' select correct function from parser interface '''
	p = parser.Parser()
	if data[-2] == ' ':
		data = data[:-2]
	return p.get_validity(data)

@app.route('/valid_api', methods=['POST'])
def valid_boolean():
	data = request.get_data()
	formulae = request.data.decode('UTF-8')
	package = respond(formulae)
	return json.dumps({'value':package[-1]})

@app.route('/valid', methods=['POST'])
def valid_req():
	''' return the validity of deriving a conclusion from a set of formulae '''
	# decode formulae
	formulae = request.data.decode('UTF-8')
	
	# parse the formulae and return the truth matrices
	return jsonify(respond(formulae))

@app.route("/")
def server_static():
	''' Return Organon's landing page '''
	return render_template('./index.html')

if __name__ == "__main__":
	app.run(threaded=True)
