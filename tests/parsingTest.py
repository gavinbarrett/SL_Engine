#!/usr/bin/env python3
import sys
from lexer import Lexer

def run_parser(arg):
    l = Lexer()
    try:
        if l.lexify(arg):
            print("\nParsing successful")
            postfix = l.pop_stack()
            print(postfix)
    except Exception as exc:
        print("Parsing failed")
        print(exc)

run_parser('(P -> Q) -> ~R')
