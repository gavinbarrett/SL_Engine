import src.lexer as sl
import src.ast as ast


class Parser:
    """ This parser builds ASTs that contain logical exps """
    def __init__(self):
        """ Create parser with expression lexer and tree stack"""
        self.lexer = sl.Lexer()
        self.tree_stack = []
        self.set = []

    def get_height(self, root):
        """ Return height of the tree """
        if root is None:
            return 0
        else:
            lh = self.get_height(root.left)
            rh = self.get_height(root.right)
        if lh > rh:
            return lh + 1
        else:
            return rh + 1

    def print_ast_(self, root):
        """ Recursively print AST"""
        if root is None:
            return
        else:
            self.print_ast_(root.right)
            print(root.name, end='')
            self.print_ast_(root.left)

    def print_ast(self):
        """ Print AST out sequentially (In-Order) """
        if self.tree_stack:
            tree = self.tree_stack.pop()
            self.print_ast_(tree)

    def get_space(self, i, h):
        return int((h - i) * 2)

    def print_hierarchy_(self, root, h, s):
        """ Recursively print levels """
        if root is None:
            return
        if h == 1:
            for i in range(1, s+1):
                print(' ', end='')
            print(root.name, end=' ')
        elif h > 1:
            self.print_hierarchy_(root.right, h-1, s)
            self.print_hierarchy_(root.left, h-1, s)

    def print_hierarchy(self):
        """ Print AST from root to leaves in level order """
        prop = 0
        while self.set:
            print('\nProposition ' + str(prop+1) + ': \n')
            prop += 1
            tree = self.set.pop(0)
            h = self.get_height(tree)
            for i in range(1, h + 1):
                s = self.get_space(i, h)
                self.print_hierarchy_(tree, i, s)
                print('\n')

    def insert_op(self, op):
        """ Pop stack and make new operator ast """
        t = ast.AST(op)
        if op in self.lexer.un_op:
            if self.tree_stack:
                tree = self.tree_stack.pop()
                t.left = tree
                self.tree_stack.append(t)
            else:
                self.tree_stack.append(op)

        elif op in self.lexer.log_ops:
            if self.tree_stack:
                tree = self.tree_stack.pop()
                t.left = tree
                tree = self.tree_stack.pop()
                t.right = tree
                self.tree_stack.append(t)
            else:
                raise Exception('Stack empty')

    def insert_term(self, t):
        """ Create new ast with term as root """
        tree = ast.AST(t)  # create tree with term as root
        tree.init_t()      # initialize t_val to true
        self.tree_stack.append(tree)

    def insert(self, c):
        """ Insert terms and ops accordingly """
        if c in self.lexer.terms:
            self.insert_term(c)

        elif c in self.lexer.log_ops:
            self.insert_op(c)

    def get_file(self):
        print('Enter the file you would like to load..')
        f = input()
        self.read(f)
        #return f

    def read(self, f):
        """ Read file f into postfix order """
        file_obj = self.lexer.open_file(f)
        output = self.lexer.read_expression(file_obj)
        for postfix in output:
            for a in postfix:
                self.insert(a)
            self.set.append(self.tree_stack.pop())
