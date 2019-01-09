#!/usr/bin/env python3
import sys
sys.path.append('..')
import src.shell as sh

def main():
    ''' Main engine loop '''
    shell = sh.SL_Shell()
    while True:
        shell.print_prompt()
        c = shell.get_cmds()
        fn = shell.get_func(c)
        if fn:
            fn()
        shell.parser.print_hierarchy()

if __name__ == "__main__":
    main()
