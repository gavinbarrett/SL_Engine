#!/usr/bin/env python
from parser import *
from lexer import *
string = "P -> P\nR v D\n"

def run():
    p = Parser()
    p.read_string(string)
run()

