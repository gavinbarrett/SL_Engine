###########
#SL_Engine#
###########
import os
import src.lexer as sl
import src.ast as ast
from src.colors import colors
from src.gen import generate
from collections import defaultdict
import drawtree

def Formula(formula):
    print("printy formula:")
    print(formula)

class Parser:
    ''' This parser builds ASTs that contain logical exps '''
    def __init__(self):
        ''' Create parser with expression lexer and tree stack '''
        self.lexer = sl.Lexer()
        self.tree_stack = []
        self.set = []
        self.seen = []
        self.output = []
        self.tt = []

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
            #print(colors.green + root.name + colors.default, end='')
            self.print_ast_(root.left)
    
    def clear_parser(self):
        self.tree_stack.clear()
        self.set.clear()
        self.seen.clear()

    def neg(self, atom):
        ''' Return the negation of the binary truth value '''
        return 0 if atom == 1 else 1

    def and_val(self, x, y):
        ''' Return logical and '''
        return x and y

    def or_val(self, x, y):
        ''' Return logical or '''
        return x or y
    
    def cond_val(self, x, y):
        ''' Return logical conditional '''
        if x and not y:
            return 0
        return 1

    def bicond_val(self, x, y):
        ''' Return logical biconditional '''
        if (x and y) or (not x and not y):
            return 1
        return 0

    #FIXME: Refactor code to use polymorphism
    def determine_truth(self, x, y, rootname):
        if rootname == '^':
            return self.and_val(x, y)
        elif rootname == 'v':
            return self.or_val(x, y)
        elif rootname == '=>':
            return self.cond_val(x, y)
        elif rootname == '<=>':
            return self.bicond_val(x, y)

    def eval(self, root):
        if root.name in self.lexer.terms:
            #FIXME: truth should be whatever value from tt
            #FIXME: tt is just the truth values of the terms
            # need to write a function to take in the expression
            # and the list of values in order to determine how many truth
            # values need to be inside of the list
            t = self.tt[0]
            self.tt = self.tt[1:]
            root.eval_stack.append(t)
        elif root.name in self.lexer.un_op:
            l = root.right.eval_stack[0]
            m = self.neg(l)
            root.eval_stack.append(m)
        elif root.name in self.lexer.log_ops:
            x = root.left.eval_stack[0]
            y = root.right.eval_stack[0]
            z = self.determine_truth(x,y,root.name)
            root.eval_stack.append(z)

    def handle_root(self, root):
        ''' Recursively return true values '''
        if not root:
            return
        #push return to ast's eval stack?
        self.handle_root(root.left)
        self.handle_root(root.right)
        self.eval(root)

    def generate_terms(self, t, exp, newExp):
        tmpExp = []
        df = defaultdict(lambda: None)
        for e in exp:
            if df[e] == None:
                x = t[0]
                t = t[1:]
                df[e] = x
                tmpExp.append(x)
            elif df[e] != None:
                x = df[e]
                tmpExp.append(x)
        newExp.append(tmpExp)

    def strip_terms(self, exp):
        newArray = []
        for e in exp:
            if e in self.lexer.terms:
                newArray.append(e)
        return newArray

    def in_order(self, root, table):
        if root is None:
            return
        self.in_order(root.left, table)
        table.append(root.eval_stack[0])
        root.eval_stack.pop()
        self.in_order(root.right, table)


    def get_truth_table(self):
        truth_table = []
        newExp = []
        tt = list(generate(len(self.seen)))
        s = self.strip_terms(self.lexer.expressions[0])
        for t in tt:
            self.generate_terms(t, s, newExp)
        if not self.set:
            print('No sentences loaded..')
            return

        for t in newExp:
            root = self.set[0]
            table = []
            self.tt = list(t)
            self.print_tt(root)
            self.in_order(root, table)
            truth_table.append(table)
        truth_table = truth_table[::-1]
        print('\n')
        for tru in truth_table:
            print(tru)

    def print_tt(self, root):
        if root is None:
            return
        self.handle_root(root.left)
        self.handle_root(root.right)
        self.eval(root)
    
    def gen_truth_table(self):
        self.get_truth_table()

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
            #print('[' + str(i) + ']: ', end='')
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
            #print(colors.green + root.name + colors.default, end=' ')
            stack += root.name
        elif h > 1:
            self.print_hierarchy_(root.left, h-1, s, stack)
            self.print_hierarchy_(root.right, h-1, s, stack)

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
        string = string[:-1]
        string += '}'
        print(string)
        self.draw_tree(string)

    def insert_op(self, op):
        ''' Pop stack and make new operator ast '''
        t = ast.AST(op)
        if op in self.lexer.un_op:
            if self.tree_stack:
                # if it is a negation, put as right child
                tree = self.tree_stack.pop()
                t.right = tree
                self.tree_stack.append(t)
            else:
                self.tree_stack.append(op)

        elif op in self.lexer.log_ops:
            if self.tree_stack:
                tree = self.tree_stack.pop()
                t.right = tree
                tree = self.tree_stack.pop()
                t.left = tree
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
        self.output = output
        for postfix in output:
            for a in postfix:
                self.insert(a)
            self.set.append(self.tree_stack.pop())
        print("printing set:")
        print(self.set)


    def read_string(self, formula):
        # turn formula into
        print(self.lexer.terms)
        # print("Formula: " + formula)
        if (formula == "P"):
            print("Formula equals hard string P")
        if (formula == self.lexer.terms[15]):
            print("Formula equals self.lexer.terms")
        props = formula
        print(props)
        output = self.lexer.shunting_yard_string(formula)
        print(output)
        for postfix in output:
            for p in postfix:
                self.insert(p)
            self.set.append(self.tree_stack.pop())
        self.get_truth_table()

