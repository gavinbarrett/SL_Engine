#!/usr/bin/env python
import sys

class Parser:
    
    def __init__(self, feed):
        self.next = None
        self.feed = feed
        self.open_paren = 0
        self.clos_paren = 0
        self.build = ''
        self.postfix = []
        self.op_stack = []
        self.prec = ['~','^','v','->','<->']
        
    def p(self):
        ''' Try to parse the input '''
        # get the first character
        self.scan()
        # try to match an expression
        self.e()
        # return true if parsing succeeded; return false otherwise
        if self.next == ')' and (self.open_paren - (self.clos_paren + 1)) != 0:
            raise Exception("Error: unaccompanied closing brace")
        return (True if self.next == None else False)
    
    def e(self):
        ''' Match an expression '''
        # match a unary expression
        if self.next == "~":
            self.u()
        #match a binary expression
        else:
            self.b()
            #self.scan()
            while self.next == '^':
                self.scan()
                self.b()

    def u(self):
        ''' Match unary function, negation (~) '''
        self.op_stack.append('~')
        self.scan()
        self.e()

    def b(self):
        ''' Match binary functions '''
        # match the left argument
        self.s()
        self.build = ''
        # try to match biconditional head
        if self.next == '<':
            self.build += self.next
            self.scan()
            self.bicond()
        # try to match conditional tail
        elif self.next == '-':
            self.build += self.next
            self.scan()
            self.cond()
        # match the right argument
        while self.next == 'v' or self.next == '^':
            self.proc_op(self.next)
            self.scan()
            self.s()
    
    def cond(self):
        ''' Match a conditional expression '''
        if self.next == '>':
            self.build += self.next
            print(self.build)
            self.proc_op(self.build)
            self.scan()
            self.s()
        else:
            raise Exception("Error parsing conditional; invalid char: " + str(self.next))

    def bicond(self):
        ''' Match a biconditional expression '''
        if self.next == '-':
            self.build += self.next
            self.scan()
            self.cond()
        else:
            raise Exception('Error parsing biconditional; invalid char: ' + str(self.next))

    def s(self):
        ''' Match atomic sentences '''
        if self.next.isalpha() and self.next.isupper():
            self.postfix += self.next
            self.scan()
        elif self.next == '(':
            self.open_paren += 1
            self.scan()
            # try to match another expression
            self.e()
            if self.next == ')':
                self.clos_paren += 1
                self.scan()
            else:
                raise Exception('Error: unaccompanied opening brace')
        elif self.next == '~':
            self.u()
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
            return
        while self.next.isspace():
            self.next = self.read()

    def get_prec(self, op):
        ''' return the operator's precedence '''
        return self.prec.index(op)

    def proc_op(self, op):
        print(op)
        ''' process operators into the postfix expression '''
        # if the stack is not empty, remove the top element
        if self.op_stack:
            prev_op = self.op_stack.pop()
            # 
            if self.get_prec(prev_op) <= self.get_prec(op):
                self.postfix.append(prev_op)
                self.op_stack.append(op)
            #
            else:
                self.op_stack.append(prev_op)
                self.op_stack.append(op)
        # otherwise, add operator to stack
        else:
            self.op_stack.append(op)

    def pop_stack(self):
        output = []
        print(self.op_stack)
        while self.op_stack:
            op = self.op_stack.pop()
            self.postfix.append(op)
        output += self.postfix
        self.postfix = []
        return output

def run_parser(arg):
    parser = Parser(arg)
    print("\nSource: " + arg)
    try:
        if parser.p():
            print("Parsing successful")
            postfix = parser.pop_stack()
            print(postfix)
    except Exception as exc:
        print("Parsing failed")
        print(exc)
        
run_parser(sys.argv[1])
