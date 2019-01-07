#!/usr/bin/env python3
import sys
sys.path.append('..')
import src.shell as sh
import src.text as txt
def loop():
    c = None
    shell = sh.SL_Shell()
    txt.print_text()
    while True:
        shell.print_prompt()
        c = shell.get_cmds()
        fn = shell.get_func(c)
        if fn:
            fn()
        shell.parser.print_hierarchy()

loop()
