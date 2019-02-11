#################
###   Shell   ###
#################
import os
import sys
import src.parser as ps
import src.help as hlp
import src.text as txt
from src.colors import colors
from click import getchar

class SL_Shell:

    def __init__(self):
        txt.print_text()
        self.parser = ps.Parser()
        self.cmd_table = { ':q' : lambda: sys.exit(0), ':h' : lambda: hlp.print_help(), ':l' : lambda: self.parser.get_file(), ':p' : lambda: self.parser.get_set(), ':c' : lambda: self.clear_shell(), ':d' : lambda: self.del_prop(), ':tt' : lambda: self.print_tt(), ':hist' : lambda: self.print_hist()}
        self.cmd_hist = []

    def check_cmd(self, cmd):
        ''' Return true if command is valid '''
        if cmd in self.cmd_table.keys():
            return True
        else:
            return False
    
    def print_hist(self): #FIXME: iterate backwards and forwards
        ''' Handle shell history '''
        for r in self.cmd_hist:
            print(r)

    def get_func(self, cmd):
        ''' Return function from dictionary '''
        if self.check_cmd(cmd):
            self.cmd_hist.append(cmd)
            return self.cmd_table[cmd]
        else:
            print("Command '" + cmd + "' not found")
            print("Input ':h' for help")

    def get_cmds(self):
        ''' Grab commands from input '''
        return input()
    
    def add_prop(self):
        ''' Add exp to list of exps '''
        exp = input('Please enter the sentence to add')
        #FIXME: parse and add expression -> must mod input read

    def del_prop(self):
        ''' Delete particular exp '''
        if len(self.parser.lexer.expressions) == 0:
            print(colors.err + '\nNo sentences loaded\n' + colors.default)
            return
        print('\nWhich sentence would you like to delete?\n')
        self.parser.get_set()
        n = input()
        if int(n) >= len(self.parser.lexer.expressions):
                print(colors.err + '\nProposition ' + n + ' does not exist\n' + colors.default)
                return
        del self.parser.lexer.expressions[int(n)]
        self.parser.get_set()

    def print_tt(self):
        ''' Print truth tree '''
        tt = self.parser.get_truth_table()
        for exp in self.parser.set:
            self.parser.print_tt(exp, tt)

    def print_prompt(self):
        ''' Print prompt for engine '''
        print(colors.purple + '=>> ' + colors.default, end='')
    
    def clear_shell(self):
        ''' Clears the shell of text '''
        os.system('clear')

    def exit_cond(self, c):
        ''' Check to see if exit conditions have been passed '''
        if c == ':q':
            return True
        else:
            return False
    
    def run(self):
        ''' Run Shell '''
        while True:
            self.print_prompt()
            c = self.get_cmds()
            fn = self.get_func(c)
            if fn:
                fn()
