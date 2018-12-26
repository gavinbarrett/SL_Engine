#!/usr/bin/env python3
import sys
sys.path.append("..")
from src import slexer as sl
s = sl.Slexer()

fileObj = s.open_file(sys.argv[1])

s.read_expression(fileObj)
s.print_exp()
