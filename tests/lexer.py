import string

class Lexer:

    def __init__(self):
        self.next = None
        self.feed = ''
        self.open_paren = 0
        self.clos_paren = 0
        self.build = ''
        self.postfix = []
        self.op_stack = []
        self.binary_op = ['~','^','v','->','<->']
        self.prec = ['(','~','^','v','->','<->']
        self.terms = string.ascii_uppercase
    
    def read(self):
        ''' Grab the next character '''
        if not self.feed:
            return None
        c = self.feed[0]
        self.feed = self.feed[1:]
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

    def lexify(self, args):
        ''' lexify each expression '''
        # filter out newlines and empty strings
        args = args.split('\n')
        args = list(filter(None, args))
        output = []
        for arg in args:
            output += self.lexify_exp(arg)
        return output

    def lexify_exp(self, exp):
        ''' Try to read the input into postfix '''
        self.feed = exp
        # get the first character
        self.scan()
        # try to match an expression
        self.exp()
        # return true if parsing succeeded; return false otherwise
        self.feed = ''
        if self.next == ')' and (self.open_paren - (self.clos_paren + 1)) != 0:
            raise Exception("Error: unaccompanied closing brace")
        return self.pop_stack()
        #return (True if self.next == None else False)
    
    def exp(self):
        ''' Match an expression '''
        # match a unary expression
        if self.next == "~":
            self.unary()
        #match a binary expression
        else:
            self.binary()
            while self.next == '^':
                self.scan()
                self.binary()

    def unary(self):
        ''' Match unary function, negation (~) '''
        self.op_stack.append('~')
        self.scan()
        self.exp()

    def binary(self):
        ''' Match binary functions '''
        # match the left argument
        self.atomic()
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
            self.atomic()
    
    def cond(self):
        ''' Match a conditional expression '''
        if self.next == '>':
            # update operator to either -> or <->
            self.build += self.next
            
            # add operator to op_stack or postfix
            self.proc_op(self.build)
            
            # scan the next character
            self.scan()
            
            # try to match an atomic statement
            self.atomic()
        # otherwise, operator is not in our language
        else:
            raise Exception("Error parsing conditional; invalid char: " + str(self.next))

    def bicond(self):
        ''' Match a biconditional expression '''
        if self.next == '-':
            # update the operator to either - or <-
            self.build += self.next
            
            # scan the next character
            self.scan()

            # try to match a conditional
            self.cond()
        # otherwise, operator is not in out language
        else:
            raise Exception('Error parsing biconditional; invalid char: ' + str(self.next))

    def atomic(self):
        ''' Match atomic sentences '''
        if self.next.isalpha() and self.next.isupper():
            self.postfix += self.next
            self.scan()
        elif self.next == '(':
            self.o_paren()
            self.open_paren += 1
            self.scan()
            # try to match another expression
            self.exp()
            if self.next == ')':
                self.c_paren()
                self.clos_paren += 1
                self.scan()
            else:
                raise Exception('Error: unaccompanied opening brace')
        elif self.next == '~':
            self.unary()
        else:
            raise Exception('Error: not a valid expression: ' + str(self.next))

    def o_paren(self):
        ''' handle opening parentheses '''
        op = '('
        if self.op_stack:    
            prev_op = self.op_stack.pop()
            if self.get_prec(prev_op) < self.get_prec(op):
                while self.get_prec(prev_op) < self.get_prec(op):
                    self.postfix.append(prev_op)
                    if self.op_stack:
                        prev_op = self.op_stack.pop()
                    else:
                        self.op_stack.append(op)
            else:
                self.op_stack.append(prev_op)
                self.op_stack.append(op)
        else:
            self.op_stack.append(op)

    def c_paren(self):
        ''' handle closing parentheses  '''
        if self.op_stack:
            prev_op = self.op_stack.pop()
            while prev_op != '(':
                self.postfix.append(prev_op)
                if self.op_stack:
                    prev_op = self.op_stack.pop()
                else:
                    raise Exception('No opening brace detected\n')

    def proc_op(self, op):
        ''' process operators into the postfix expression '''
        # if the stack is not empty, remove the top element
        if self.op_stack:
            prev_op = self.op_stack.pop()
            # 
            if self.get_prec(prev_op) <= self.get_prec(op):
                self.op_stack.append(prev_op)
                self.op_stack.append(op)
            #
            else:
                self.postfix.append(prev_op)
                self.op_stack.append(op)
        # otherwise, add operator to stack
        else:
            self.op_stack.append(op)

    def pop_stack(self):
        output = []
        while self.op_stack:
            op = self.op_stack.pop()
            self.postfix.append(op)
        output += self.postfix
        self.postfix = []
        return output

