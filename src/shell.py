import sys
import src.parser as ps
import src.help as hlp

class SL_Shell:

    def __init__(self):
        self.parser = ps.Parser()
        self.cmd_table = { ':q' : lambda: sys.exit(0), ':h' : lambda: hlp.print_help(), ':l' : lambda: self.parser.get_file() }

    def check_cmd(self, cmd):
        ''' Return true if command is valid '''
        if cmd in self.cmd_table.keys():
            return True
        else:
            return False

    def get_func(self, cmd):
        ''' Return function from dictionary '''
        if self.check_cmd(cmd):
            return self.cmd_table[cmd]
        else:
            print("Command '" + cmd + "' not found\n", end='')

    def get_cmds(self):
        ''' Grab commands from input '''
        return input()

    def print_prompt(self):
        ''' Print prompt for engine '''
        print('-> ', end='')

    def exit_cond(self, c):
        ''' Check to see if exit conditions have been passed '''
        if c == ':q':
            return True
        else:
            return False

