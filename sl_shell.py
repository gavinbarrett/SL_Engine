#!/usr/bin/env python3
import sys
sys.path.append('..')
import src.shell as sh

def main():
    ''' Main engine loop '''
    shell = sh.SL_Shell()
    shell.run()

if __name__ == "__main__":
    main()
