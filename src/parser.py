import src.lexer as sl
import src.ast as ast
class Parser:

    def __init__(self):
        self.lexer = sl.Slexer()
        self.tree_stack = []

    def print_ast_(self, root):
        if root is None:
            return
        else:
            self.print_ast_(root.right)
            print(root.name, end=" ")
            self.print_ast_(root.left)

    def print_ast(self):
        if self.tree_stack:
            tree = self.tree_stack.pop()
            self.print_ast_(tree)

    def print_hierarchy_(self, root):
        q = []
        q.append(root)
        while q:
            a = q.pop(0)
            print(a.name, end=" ")

            if a.right:
                q.append(a.right)
            if a.left:
                q.append(a.left)

    def print_hierarchy(self):
        if self.tree_stack:
            tree = self.tree_stack.pop()
            self.print_hierarchy_(tree)

    def insert_op(self, op):
        """ Pop stack and make new operator ast """
        t = ast.AST(op)
        if op in self.lexer.un_op:
            if self.tree_stack:
                tree = self.tree_stack.pop()
                # is this sufficient for swapping?
                t.left = tree
                self.tree_stack.append(t)
            else:
                self.tree_stack.append(op)
                #raise Exception('Postfix is out of order')

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
    
    def read(self, f):
        """ Read file f into postfix order """
        file_obj = self.lexer.open_file(f)
        postfix = self.lexer.read_expression(file_obj)
        for a in postfix:
            self.insert(a)
