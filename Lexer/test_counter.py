#!/usr/bin/env python3

braces = ['(', ')', '[', ']', '{', '}']
braces_open = ['(', '[', '{']
braces_closed = [')', ']', '}']

def counter(c):
        if c in braces_open:
            return braces_closed[braces_open.index(c)]
        elif c in braces_closed:
            return braces_open[braces_closed.index(c)]

for b in braces:
    print("Brace  |  Counter\n")
    print('  ' + b + '          ' + counter(b) + '\n')
