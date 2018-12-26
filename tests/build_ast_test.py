#!/usr/bin/env python3
import sys
sys.path.append('..')
import src.parser as ps

tree = ps.Parser()
tree.read(sys.argv[1])
tree.print_stack()
