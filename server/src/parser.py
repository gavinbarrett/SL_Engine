###########
#SL_Engine#
###########
import os
import lexer as sl
import ast as ast
from gen import generate
from collections import defaultdict
import drawtree

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

    def determine_truth(self, x, y, rootname):
        ''' Determine the truth value of the formula using binary functions '''
        if rootname == '^':
            return self.and_val(x, y)
        elif rootname == 'v':
            return self.or_val(x, y)
        elif rootname == '->':
            return self.cond_val(x, y)
        elif rootname == '<->':
            return self.bicond_val(x, y)

    def eval(self, root):
        if root.name in self.lexer.terms:
            #FIXME: truth should be whatever value from tt
            #FIXME: tt is just the truth values of the terms
            # need to write a function to take in the expression
            # and the list of values in order to determine how many truth
            # values need to be inside of the list
            print(self.tt)
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

    def generate_terms(self, t, exp):
        #print("Generating terms...")
        #print(t)
        #print(exp)
        tmpExp = []
        df = defaultdict(lambda: None)
        #print("printing exp")
        #print(exp)
        
        #FIXME: for exp in expressions...
        # for e in exp
        # if expressions[exp][e] == None
        for e in exp:
            if df[e] == None:
                x = t[0]
                #print('x')
                #print(x)
                t = t[1:]
                df[e] = x
                tmpExp.append(x)
            elif df[e] != None:
                x = df[e]
                tmpExp.append(x)
        return tmpExp

    def strip_terms(self, exp):
        seen = []
        newArray = []
        for e in exp:
            if e in self.lexer.terms:
                newArray.append(e)
                if e not in seen:
                    seen.append(e)
        return newArray, len(seen)

    def in_order(self, root, table):
        if root is None:
            return
        self.in_order(root.left, table)
        table.append(root.eval_stack[0])
        root.eval_stack.pop()
        self.in_order(root.right, table)


    def get_truth_table(self, tree, exp):
        truth_table = []
        newExp = []
        ts, dist = self.strip_terms(exp)
        truth_values = list(generate(dist))
        #print(truth_values)
        terms = []
        for t in truth_values:
            term = self.generate_terms(t,ts)
            #print(term)
            terms.append(term)
        for t in terms:
            table = []
            self.tt = t
            self.print_tt(tree)
            self.in_order(tree, table)
            truth_table.append(table)
        truth_table = truth_table[::1]
        print(exp)
        for tru in truth_table:
            print(tru)
        print("\n")
        return truth_table

    '''
        #truth_table = []
        #newExp = []
        #form_terms = []
        
        numbers = []
        for exp in self.lexer.expressions:
            dist = 0
            ts, dist = self.strip_terms(exp)
            numbers.append(dist)
            form_terms.append(ts)

        for idx, terms in enumerate(form_terms):
            # num_terms is total number of terms
            # len(numbers) gives the amount of distinct terms
            num_terms = len(terms)
            truth_values = list(generate(numbers[idx]))

            print("Truth values")
            print(truth_values)
            print("exp:")
            print(terms)
            ne = []
            for i, t_vals in enumerate(truth_values):
                self.tt = t_vals
                if not t_vals:
                    print("no vals")
                ne.append(self.generate_terms(t_vals, form_terms[idx]))
                print("ne")
                print(ne)

            newExp.append(ne)
        print("Newexp")
        print(newExp)

        if not self.set:
            print('No sentences loaded..')
            return

        for t in newExp:
            print("t is ")
            print(newExp)
            root = self.set[0]
            #print("self.setsize")
            #print(len(self.set))
            table = []
            self.tt = [t]
            self.print_tt(root)
            self.in_order(root, table)
            truth_table.append(table)
        truth_table = truth_table[::-1]
        print('\n')
        for tru in truth_table:
            print(tru)
        return truth_table
        #self.tt = []
    '''

    def print_tt(self, root):
        if root is None:
            return
        self.handle_root(root.left)
        self.handle_root(root.right)
        self.eval(root)
    
    def print_ast(self):
        ''' Print AST out sequentially (In-Order) '''
        if self.tree_stack:
            tree = self.tree_stack.pop()
            self.print_ast_(tree)

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

    def normalize(self, fs):
        formulas = []
        formula = ''
        for f in fs:
            if f == '\n':
                formula += f
                formulas.append(formula)
                formula = ''
            else:
                formula += f
        return formulas

    def read_string(self, formula):
        tables = []
        outtie = []
        formulas = self.normalize(formula)
        for f in formulas:
            output = self.lexer.shunting_yard_string(f)
            outtie += output
        for idx, postfix in enumerate(outtie):
            for p in postfix:
                self.insert(p)
            tree = self.tree_stack.pop()
            #self.set.append(self.tree_stack.pop())
            table = self.get_truth_table(tree, formulas[idx])
            tables.append(table)
        return tables
