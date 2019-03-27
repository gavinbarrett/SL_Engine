###########
#SL_Engine#
###########
import os
import src.lexer as sl
import src.ast as ast
from src.colors import colors
from src.gen import generate
import drawtree

class Parser:
    ''' This parser builds ASTs that contain logical exps '''
    def __init__(self):
        ''' Create parser with expression lexer and tree stack '''
        self.lexer = sl.Lexer()
        self.tree_stack = []
        self.set = []
        self.seen = []

    def get_height(self, root):
        ''' Return height of the tree '''
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
        ''' Recursively print AST '''
        if root is None:
            return
        else:
            self.print_ast_(root.right)
            print(colors.green + root.name + colors.default, end='')
            self.print_ast_(root.left)
    
    def clear_parser(self):
        self.tree_stack.clear()
        self.set.clear()
        self.seen.clear()

    ##############

    def evaluate(self, root, tt):
        ''' Perform evaluation of operators and terms '''
        print(root.name, end='')
        if root.name in self.lexer.log_ops:
            if root.name is self.lexer.un_op:
                pass
                # operator is unary (~)
            else:
                pass
                #t2 = self.eval_stack.pop()
                #t1 = self.eval_stack.pop()
                # operator is binary (^, v, =>, <=>)
        else:
            #FIXME delete below
            if root.t_value == True:
                print('T')
            else:
                print('F')
            # return respective truth value for term

    def handle_root(self, root, tt):
        ''' Recursively return true values '''
        if not root:
            return
        #push return to ast's eval stack?
        self.handle_root(root.left, tt)
        self.handle_root(root.right, tt)
        self.evaluate(root, tt)
    ##############


    def get_truth_table(self):
        tt = list(generate(len(self.seen)))
        if not self.set:
            print('No sentences loaded..')
            return
        root = self.set[0]
        self.print_tt(root, tt)

    def print_tt(self, root, tt):
        if root is None:
            return
        self.print_tt(root.left, tt)
        self.print_tt(root.right, tt)
        self.handle_root(root.left, tt)

    def print_ast(self):
        ''' Print AST out sequentially (In-Order) '''
        if self.tree_stack:
            tree = self.tree_stack.pop()
            self.print_ast_(tree)

    def get_set(self):
        ''' Print proposition set '''
        if len(self.lexer.expressions) == 0:
            print('\nNo sentences loaded\n')
            return
        i = 0
        print('\nProposition set:\n')
        for exp in self.lexer.expressions:
            print('[' + str(i) + ']: ', end='')
            print(colors.green + exp + colors.white + '\n')
            i += 1

    def get_space(self, i, h):
        return int((h - i) * 2)

    def print_hierarchy_(self, root, h, s, stack):
        ''' Print level order '''
        if root is None:
            stack += '#'
            return
        if h == 1:
            #for i in range(1, s+1):
            #    print(' ', end='')
            #Print(colors.green + root.name + colors.default, end=' ')
            stack += root.name
        elif h > 1:
            self.print_hierarchy_(root.right, h-1, s, stack)
            self.print_hierarchy_(root.left, h-1, s, stack)

    def draw_tree(self, tree_string):
        ''' Draw a pretty tree with drawtree '''
        print('Drawing tree')
        drawtree.draw_level_order(tree_string)


    def print_hierarchy(self):
        stack = []
        string = '{'
        ''' Print AST from root to leaves in level order '''
        prop = 0
        while self.set:
        #    print('\nProposition ' + str(prop+1) + ': \n')
            prop += 1
            tree = self.set.pop(0)
            h = self.get_height(tree)
            for i in range(1, h + 1):
                s = self.get_space(i, h)
                self.print_hierarchy_(tree, i, s, stack)
        #        print('\n')
        for e in stack:
            string += e
            if e != '=':
                string += ','
        string += '}'
        print(string)
        self.draw_tree(string)

    def insert_op(self, op):
        ''' Pop stack and make new operator ast '''
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
        ''' Create new ast with term as root '''
        if t not in self.seen:
            self.seen += t
        tree = ast.AST(t)  # create tree with term as root
        tree.init_t()      # initialize t_val to true
        self.tree_stack.append(tree)

    def insert(self, c):
        ''' Insert terms and ops accordingly '''
        if c in self.lexer.terms:
            self.insert_term(c)

        elif c in self.lexer.log_ops:
            self.insert_op(c)

    def valid_file(self, f):
        ''' Check to see if file exists '''
        if os.path.isfile(f):
            return True
        else:
            return False


    def get_file(self):
        ''' Ask for file within shell '''
        print('Enter the file you would like to load..')
        f = input()
        if self.valid_file(f):
            self.read(f)
            print('Loaded file ' + f)
        else:
            print(colors.err + 'File does not exist..' + colors.default)

    def read(self, f):
        ''' Read file f into postfix order '''
        file_obj = self.lexer.open_file(f)
        output = self.lexer.shunting_yard(file_obj)
        #self.lexer.print_t_count()
        for postfix in output:
            for a in postfix:
                self.insert(a)
            self.set.append(self.tree_stack.pop())
