#!/usr/bin/env python
import sys

class Parser:
    
    def __init__(self, feed):
        self.next = None
        self.feed = feed

    def p(self):
        ''' Try to parse the input '''
        # get the first character
        self.scan()
        if self.next == '$':
            sys.exit(1)
        # try to match an expression
        self.e()
        # return true if parsing succeeded; return false otherwise
        return (True if self.next == '$' else False)
    
    def e(self):
        ''' Match an expression '''
        # match a unary expression
        if self.next == "~":
            self.u()
        #match a binary expression
        else:
            self.b()
            while self.next == '^':
                self.scan()
                self.b()

    def u(self):
        ''' Match unary function, negation (~) '''
        self.scan()
        self.e()


    def b(self):
        ''' Match binary functions '''
        # match the left argument
        self.s()
        # try to match biconditional head
        if self.next == '<':
            self.scan()
            self.bicond()
        # try to match conditional tail
        elif self.next == '-':
            self.scan()
            self.cond()
        # match the right argument
        while self.next == 'v':
            self.scan()
            self.s()
    
    def cond(self):
        ''' Match a conditional expression '''
        if self.next == '>':
            self.scan()
            self.s()
        else:
            raise Exception("Error parsing conditional; invalid char: " + str(self.next))

    def bicond(self):
        ''' Match a biconditional expression '''
        if self.next == '-':
            self.scan()
            self.cond()
        else:
            raise Exception('Error parsing biconditional; invalid char: ' + str(self.next))

    def s(self):
        ''' Match atomic sentences '''
        if self.next.isalpha() and self.next.isupper():
            self.scan()
        elif self.next == '(':
            self.scan()
            # try to match another expression
            self.e()
            if self.next == ')':
                self.scan()
            else:
                raise Exception('Error: missing brace')
        elif self.next == '~':
            self.scan()
            self.e()
        else:
            raise Exception('Error: not a valid expression: ' + str(self.next))

    def read(self):
        ''' Grab the next character '''
        if not self.feed:
            return None
        c = self.feed[0]
        self.feed = self.feed[1:]
        print(self.feed)
        return c

    def scan(self):
        ''' Advance through the string '''
        self.next = self.read()
        if self.next == None:
            raise Exception('Error: string terminated without end symbol `$`')
        while self.next.isspace():
            self.next = self.read()


def run_parser(arg):
    parser = Parser(arg)
    print("\nSource: " + arg)
    try:
        if parser.p():
            print("Parsing successful")
    except Exception as exc:
        print("Parsing failed")
        print(exc)
        
run_parser(sys.argv[1])
