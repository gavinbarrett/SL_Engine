#!/usr/bin/env python3
import sys
from lexer import Lexer

def run_parser(arg):
    l = Lexer()
    try:
        ls = l.lexify(arg)
        print('Printing')
        print(ls)
        print("\nParsing successful")
    except Exception as exc:
        print("Parsing failed")
        print(exc)

run_parser('(P -> Q) -> ~R\nZ ^ C\n')
