#!/usr/bin/env python
import sys

class Parser:

    def __init__(self, feed):
        self.next = None
        self.feed = feed

    def p(self):
        self.scan()
        if self.next == '$':
            sys.exit(1)
        
        self.e()
        
        if self.next == '$':
            sys.stdout.write('Accepted; parse successful')
            return True
        else:
            print("Error")
            return False

    def e(self):
        ''' Match expression '''
        if self.next == "~":
            print('unary operator! ' + self.next)
            self.u()
        else:
            self.b()
            while self.next == '^':
                self.scan()
                self.b()

    def u(self):
        ''' Match unary function, negation (~) '''
        self.scan()
        self.e()

    def cond(self):
        if self.next == '>':
            self.scan()
            self.s()
        else:
            print('Conditional error')
            sys.exit(1)

    def bicond(self):
        if self.next == '-':
            self.scan()
            self.cond()
        else:
            print('Biconditional error')
            sys.exit(1)

    def b(self):
        ''' Match binary functions '''
        self.s()
        
        if self.next == '<':
            self.scan()
            self.bicond()

        elif self.next == '-':
            self.scan()
            self.cond()

        while self.next == 'v':
            self.scan()
            self.s()

    def s(self):
        ''' Match sentences '''
        if self.next.isalpha() and self.next.isupper():
            self.scan()
        elif self.next == '(':
            self.scan()

            self.e()

            if self.next == ')':
                self.scan()
            else:
                print('Error 3')
                sys.exit(1)
        elif self.next == '~':
            self.scan()
            self.e()
        else:
            print('Error 4')
            sys.exit(1)

    def getch(self):
        if not self.feed:
            return None
        c = self.feed[0]
        self.feed = self.feed[1:]
        print(self.feed)
        return c

    def scan(self):
        self.next = self.getch()
        if self.next == None:
            sys.exit(1)
        while self.next.isspace():
            self.next = self.getch()

def run_parse(arg):
    parser = Parser(arg)
    print("\nSource: " + arg)
    p = 1
    parser.p()

def test():
        test = "(P -> Q) ^ R$"
        test1 = "(P <-> F) v (D -> C)$"
        test2 = "H v ~(P -> Q)$"
        test3 = "P v ~W$"
        test4 = "~(Z ^ B)$"
        test5 = "S -> R$"

        print("Passing tests:")
        print(run_parse(test))
        print(run_parse(test1))
        print(run_parse(test2))
        print(run_parse(test3))
        print(run_parse(test4))
        print(run_parse(test5))

        btest = "(a v B)$"
        btest1 = "((A -> B)$"
        btest2 = "(A v (C v v B))$"
        btest3 = "(F F ^ B)$"
        btest4 = "A -> $"
        btest5 = "B ^ S)$"

        print("\nNon-passing tests:\n")
        try:
            print(run_parse(btest))
        except:
            print("\ntest failed\n")

        try:
            print(run_parse(btest1))
        except:
            print("\ntest failed\n")
        try:
            print(run_parse(btest2))
        except:
            print("\ntest failed\n")
        try:
            print(run_parse(btest3))
        except:
            print("\ntest failed\n")
        try:
            print(run_parse(btest4))
        except:
            print("\ntest failed\n")
        try:
            print(run_parse(btest5))
        except:
            print("\ntest failed\n")

test()
