#!/usr/bin/env python3
import sys
sys.path.append('..')
import src.parser as ps
import src.lexer
import src.ast

def main():
    tree = ps.Parser()
    tree.read(sys.argv[1])
    #tree.print_hierarchy()

if __name__ == "__main__":
    main()
