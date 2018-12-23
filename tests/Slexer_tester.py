#!/usr/bin/env python3
import sys
from .lexer.slexer import *

s = Slexer()

fileObj = s.open_file(sys.argv[1])

s.read_expression(fileObj)
s.print_exp()

