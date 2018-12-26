class Slexer():

    def __init__(self):
        self.un_op = '~'
        self.log_ops = ['~', '^', 'v', '=>', '<=>']
        self.half_ops = ['<', '=', '<=', '>']
        self.poss_ops = ['~', '^', 'v', '=>', '<=>', '=', '<', '>']
        self.prec = ['[', '(', '~', '^', 'v', '=>', '<=>']
        self.braces = ['(', ')', '[', ']', '{', '}']
        self.braces_open = ['(', '[', '{']
        self.braces_closed = [')', ']', '}']
        self.w_space = ['\n', '\t', ' ']
        self.terms = [chr(i) for i in range(65, 91)]  # generate valid terms A-Z
        self.op_stack = []
        self.b_stack = []
        self.l_stack = []
        self.postfix = []

    def print_exp(self):
        print(self.postfix)

    def get_prec(self, c):
        return self.prec.index(c)

    def counter(self, c):
        """ Return corresponding brace """
        if c in self.braces_open:
            return self.braces_closed[self.braces_open.index(c)]
        elif c in self.braces_closed:
            return self.braces_open[self.braces_closed.index(c)]

    def build_op(self, c):
        """ Try to construct multi-token operator """
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
        """ Add valid operators and build operators from sub-operator tokens """

        if c in self.log_ops:
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
        if self.op_stack:
            a = self.op_stack.pop()
            if self.get_prec(a) < self.get_prec(c):
                while self.get_prec(a) < self.get_prec(c):
                    # as long as it isnt a paren
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
        if not self.op_stack:
            raise Exception('Stack empty!\n')
        else:
            a = self.op_stack.pop()
            while a != self.counter(c):
                self.postfix.append(a)
                if self.op_stack:
                    a = self.op_stack.pop()
                else:
                    raise Exception('Invalid braces; no opening brace detected\n')
            # account for when we reach opening brace

    def handle_braces(self, c):
        """ Make sure braces are balanced """
        if c in self.braces_open:
            self.open_brace(c)
        elif c in self.braces_closed:
            self.closed_brace(c)
        # if c in self.braces_open:
        #     if self.op_stack:
        #         a = self.op_stack.pop()
        #         if a in self.braces_open:
        #             self.op_stack.append(a)
        #             self.op_stack.append(c)
        #         elif a <= c:
        #             while a <= c:
        #                 self.postfix.append(a)
        #                 if self.op_stack:
        #                     a = self.op_stack.pop()
        #                 else:
        #                     self.op_stack.append(c)
        #         elif a > c:
        #             self.op_stack.append(a)
        #     else:
        #         self.op_stack.append(c)
        # else:
        #     if not self.op_stack:
        #         if c in self.braces_closed:
        #             raise Exception('invalid braces')
        #     else:
        #         a = self.op_stack.pop()
        #         while a != self.counter(c):
        #             self.postfix.append(a)
        #             if self.op_stack:
        #                 a = self.op_stack.pop()
        #             else:
        #                 return

    def open_file(self, filename):
        """ Try to open the file """
        try:
            fileObj = open(filename, 'r')
            return fileObj
        except:
            print('File could not be opened\n')

    def read_token(self, token):
        """ Read in tokens """
        if token in self.terms:             # handle terms
            self.postfix.append(token)
        elif token in self.braces:          # handle braces
            self.handle_braces(token)
        elif token in self.poss_ops:        # handle operators
            self.handle_operators(token)
        elif token in self.w_space:
            pass
        else:
            raise Exception('invalid token: ' + token)

    def read_expression(self, fileObj):
        """ Read in entire expression """
        for line in fileObj:
            for c in line:
                self.read_token(c)

        while self.op_stack:
            a = self.op_stack.pop()
            self.postfix.append(a)
        return
