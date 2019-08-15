###########
#SL_Engine#
###########
import os
import src.lexer as sl
import src.ast as ast
from src.gen import generate
from collections import defaultdict

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
        return 'F' if atom == 'T' else 'T'

    def and_val(self, x, y):
        ''' Return logical and '''
        return 'T' if x == 'T' and y == 'T' else 'F'

    def or_val(self, x, y):
        ''' Return logical or '''
        return 'T' if x == 'T' or y == 'T' else 'F'
    
    def cond_val(self, x, y):
        ''' Return logical conditional '''
        if x == 'T' and y == 'F':
            return 'F'
        return 'T'

    def bicond_val(self, x, y):
        ''' Return logical biconditional '''
        if (x == 'T' and y == 'T') or (x == 'F' and y == 'F'):
            return 'T'
        return 'F'

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
            #print(self.tt)
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
        tmpExp = []
        df = defaultdict(lambda: None)
        
        #FIXME: for exp in expressions...
        # for e in exp
        # if expressions[exp][e] == None
        for e in exp:
            if df[e] == None:
                x = t[0]
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
        return newArray, seen

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
        truth_values = list(generate(len(dist)))
        terms = []
        print('truth-values')
        print(truth_values)
        for t in truth_values:
            term = self.generate_terms(t,ts)
            terms.append(term)
        for t in terms:
            table = []
            self.tt = t
            self.print_tt(tree)
            self.in_order(tree, table)
            truth_table.append(table)
        truth_table = truth_table[::1]
        return truth_table, dist, truth_values

    def get_set_truth_table(self, tree, exp, total, master):
        # save total amount of distinct terms
        trus, total_distinct = self.strip_terms(exp)
        #TODO: get indices of each element of trus from their place in total_distinct
        truth_table = []
        indices = []
        for tn in trus:
            indices.append(total.index(tn))
        print('Master List:')
        print(master)
        # for each truth value state(row) in the list, strip out relevant truth values
        # TODO: refactor with map and lambda
        troos = []
        for tv in master:
            troo = []
            for i in indices:
                troo.append(tv[i])
            troos.append(troo)
        terms = []
        for tr in troos:
            term = self.generate_terms(tr, trus)
            terms.append(term)
        for t in terms:
            table = []
            self.tt = t
            self.print_tt(tree)
            self.in_order(tree, table)
            truth_table.append(table)
        print('\nTRUTH TABLE\n')
        for ttt in truth_table:
            print(ttt)
        print(total)    
        return truth_table #, total_distinct, troos


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
                formula += str(f)
                formulas.append(formula)
                formula = ''
            else:
                formula += str(f)
        return formulas

    def get_tables(self, data):
        ''' return the truth tables for a set of sentences '''
        tz, total = self.strip_terms(data)
        master_list = list(generate(len(total)))
    
        outtie = []
        
        # normalize expressions by newlines
        formulas = self.normalize(data)
        
        print('\nFORMULAS:\n')
        print(formulas)

        for f in formulas:
            output = self.lexer.shunting_yard_string(f)
            outtie += output 
        set_trus = []
        tables = []
        for idx, postfix in enumerate(outtie):
            for p in postfix:
                self.insert(p)
            tree = self.tree_stack.pop()

            tables.append(list(self.get_truth_table(tree, formulas[idx])))
        return tables
    


    def get_validity(self, data):
        ''' check whether or not a set of sentences is valid '''
        tz, total = self.strip_terms(data)
        master_list = list(generate(len(total)))
    
        outtie = []
        
        # normalize expressions by newlines
        formulas = self.normalize(data)
        
        print('\nFORMULAS:\n')
        print(formulas)

        # perform the shunting yard operation on each formula
        #outtie = list(map(lambda x: self.lexer.shunting_yard_string(x), formulas))
        for f in formulas:
            output = self.lexer.shunting_yard_string(f)
            outtie += output 
        
        set_trus = []
        for idx, postfix in enumerate(outtie):
            for p in postfix:
                self.insert(p)
            tree = self.tree_stack.pop()
            #TODO: set truth table code; PLZ refactor
            set_truth = list(self.get_set_truth_table(tree, formulas[idx], total, master_list))
            set_trus.append(set_truth)

            # return the master list appended to the output values
            print("Master list:")
            print(master_list)
            print("set_trus")
            print(set_trus)
        return [total] + [master_list] + set_trus
