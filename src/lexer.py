import string
class Lexer():

    ''' Sentential Logic Lexer '''
    def __init__(self):
        self.un_op = '~'
        self.log_ops = ['~', '^', 'v', '->', '<->']
        self.half_ops = ['<', '-', '<-', '>']
        self.poss_ops = ['~', '^', 'v', '->', '<->', '-', '<', '>']
        self.prec = ['[', '(', '~', '^', 'v', '->', '<->']
        self.braces = ['(', ')', '[', ']', '{', '}']
        self.braces_open = ['(', '[', '{']
        self.braces_closed = [')', ']', '}']
        self.w_space = ['\n', '\t', ' ']
        self.newline = '\n'
        self.terms = [chr(i) for i in range(65, 91)]
        self.op_stack = []
        self.b_stack = []
        self.l_stack = []
        self.postfix = []
        self.seen = []
        self.tmp = ''
        self.expressions = []
        self.t_count = 0

    def print_exp(self):
        ''' Print expression '''
        print(self.postfix)

    def get_prec(self, c):
        ''' Get precedence of operator '''
        return self.prec.index(c)

    def counter(self, c):
        ''' Return corresponding brace '''
        if c in self.braces_open:
            return self.braces_closed[self.braces_open.index(c)]
        elif c in self.braces_closed:
            return self.braces_open[self.braces_closed.index(c)]

    def build_op(self, c):
        ''' Try to construct multi-token operator '''
        while self.l_stack:
            op = self.l_stack.pop()
            op += c
        if op in self.log_ops:
            if not self.op_stack:
                self.op_stack.append(op)
            else:
                a = self.op_stack.pop()
                if self.get_prec(a) < self.get_prec(op):
                    if a in self.log_ops:
                        self.postfix.append(a)
                    else:
                        self.op_stack.append(a)
                    self.op_stack.append(op)
        elif c in self.poss_ops:
            self.l_stack.append(op)

    def handle_operators(self, c):
        ''' Add valid operators; build ops from sub-op tokens '''
        if c in self.un_op:
            self.op_stack.append(c)
        elif c in self.log_ops:
            if self.op_stack:
                a = self.op_stack.pop()
                if self.get_prec(a) <= self.get_prec(c):
                    if a in self.log_ops:
                        self.postfix.append(a)
                    else:
                        self.op_stack.append(a)
                    self.op_stack.append(c)
                elif self.get_prec(a) > self.get_prec(c):
                    self.op_stack.append(a)
                    self.op_stack.append(c)
                elif a == self.counter(c):
                    return
            else:
                self.op_stack.append(c)
        elif c in self.half_ops:
            if not self.l_stack:
                self.l_stack.append(c)
            else:
                self.build_op(c)

    def open_brace(self, c):
        ''' Handle opening brace '''
        if self.op_stack:
            a = self.op_stack.pop()
            if self.get_prec(a) < self.get_prec(c):
                while self.get_prec(a) < self.get_prec(c):
                    self.postfix.append(a)
                    if self.op_stack:
                        a = self.op_stack.pop()
                    else:
                        self.op_stack.append(c)
            else:
                self.op_stack.append(a)
                self.op_stack.append(c)
        else:
            self.op_stack.append(c)

    def closed_brace(self, c):
        ''' Handle closing brace '''
        if not self.op_stack:
            raise Exception('Stack empty!\n')
        else:
            a = self.op_stack.pop()
            while a != self.counter(c):
                self.postfix.append(a)
                if self.op_stack:
                    a = self.op_stack.pop()
                else:
                    raise Exception('No opening brace detected\n')

    def handle_braces(self, c):
        ''' Make sure braces are balanced '''
        if c in self.braces_open:
            self.open_brace(c)
        elif c in self.braces_closed:
            self.closed_brace(c)
    
    def handle_terms(self, t):
        ''' Append token t to postfix; track term count '''
        if t in self.seen:
            pass
        else:
            self.seen.append(t)
            self.t_count += 1
        self.postfix.append(t)

    def pop_remaining(self):
        ''' Moves remaining tokens from op_stack to output '''
        output = []
        while self.op_stack:
            op = self.op_stack.pop()
            if op in self.braces_open:
                raise Exception('no matching closing brace\n')
            self.postfix.append(op)
        output += self.postfix
        self.postfix = []
        return output


    def read_token(self, token):
        ''' Read in tokens and operators '''
        if token == '\n':
            self.expressions.append(self.tmp)
            self.tmp = ""
        elif token in self.terms:
            self.tmp += token
            self.handle_terms(token)
        elif token in self.braces:
            self.tmp += token
            self.handle_braces(token)
        elif token in self.poss_ops:
            self.tmp += token
            self.handle_operators(token)
        elif token.isspace():
            self.tmp += token
        elif token is self.newline:
            self.expressions.append(self.tmp)
            self.tmp = ''
        elif not token:
            print('no token!')
        else:
            raise Exception('invalid token: ' + str(ord(token)))

    def shunting_yard(self, formula):
        ''' Perform the shunting yard algorithm on the expression, returning its postfix '''
        # put each character in its appropriate structure
        list(map(lambda c: self.read_token(c), formula))

        # return the postfix expression
        return self.pop_remaining()
