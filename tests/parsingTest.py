#!/usr/bin/env python3
import sys
from parse import Parser

def run_parser(arg):
    parser = Parser(arg)
    try:
        if parser.p():
            print("\nParsing successful")
            postfix = parser.pop_stack()
            print(postfix)
    except Exception as exc:
        print("Parsing failed")
        print(exc)

run_parser(sys.argv[1])
