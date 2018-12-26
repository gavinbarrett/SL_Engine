#!/usr/bin/env python3
import sys
sys.path.append("..")
from src import lexer as sl
s = sl.Slexer()

fileObj = s.open_file(sys.argv[1])

a = s.read_expression(fileObj)
print(a)
