#!/usr/bin/env python3
from Slexer import *
import sys

s = Slexer()

fileObj = s.open_file(sys.argv[1])

s.read_expression(fileObj)
s.print_exp()

