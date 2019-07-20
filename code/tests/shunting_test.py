#!/usr/bin/env python3
import sys
sys.path.append('..')
import src.lexer

def test_shunting(arg):
    lex = src.lexer.Lexer()
    f = lex.open_file(arg)
    output = lex.shunting_yard(f)
    print(output)

if __name__ == "__main__":
    arg = sys.argv[1]
    test_shunting(arg)
