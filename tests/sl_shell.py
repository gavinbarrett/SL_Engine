#!/usr/bin/env python3

import sys
sys.path.append('..')
import src.parser as ps
import src.help as h

class SL_Shell:

    def __init__(self):
        self.parser = ps.Parser()
        self.cmd_table = { ':q' : lambda: sys.exit(0), ':h' : lambda: h.print_help() }
    
    def get_func(self, cmd):
        #check if cmd is valid
        return self.cmd_table[cmd]


def get_cmds():
    ''' Grab commands from input  '''
    return input()

def print_prompt():
    ''' Print prompt for engine '''
    print('-> ', end='')

def exit_cond(c):
    ''' Check to see if exit conditions have been passed '''
    if c == ':q':
        return True
    else:
        return False

def loop():
    c = None
    sl = SL_Shell()
    exit = ':q'
    while not exit_cond(c):
        print_prompt()
        c = get_cmds()
        fn = sl.get_func(c)
        fn()

loop()
