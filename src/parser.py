import string
import ast as ast
from lexer import *
from gen import generate
from collections import defaultdict

class Parser:
    ''' Constructs a parser that builds ASTs from logical expressions '''

    def __init__(self):
        ''' Create parser with expression lexer and tree stack '''
        self.lexer = Lexer()
        self.tree_stack = []
        self.set = []
        self.seen = []
        self.output = []
        self.tt = []
        self.dist = []
        self.valid = None
        self.validStack = []
        self.vStack = []
        self.alpha = list(string.ascii_uppercase)

    def clear_parser(self):
        ''' Return the parser to its initialized state '''
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

    def addValue(self, value):
        ''' Add the top level truth values in order to determine validity '''
        self.validStack += value
        #
        if len(self.validStack) == (2**len(self.dist)):
            self.vStack.append(self.validStack)
            self.validStack = []
    
    def insert_term_value(self, truth_value, root):
        ''' Insert a truth value for the term (/A-Z/) '''
        truth_value = self.tt[0]
        self.tt = self.tt[1:]
        root.eval_stack.append(truth_value)
        return truth_value

    def insert_unary_value(self, truth_value, root):
        ''' Add the negation of the truth value to the root's evaluation stack '''
        truth_value = root.right.eval_stack[0]
        negated_value = self.neg(truth_value)
        root.eval_stack.append(negated_value)
        return truth_value

    def insert_binary_value(self, truth_value, root):
        ''' Add the binary computation of the truth value to the root's evaluation stack '''
        left_arg = root.left.eval_stack[0]
        right_arg = root.right.eval_stack[0]
        truth_value = self.determine_truth(left_arg, right_arg, root.name)
        root.eval_stack.append(truth_value)
        return truth_value

    def eval(self, root):
        ''' Compute the parent node's truth value from its children '''
        truth_value = None
        # insert a truth value for an atomic sentence
        if root.name in self.lexer.terms:
            truth_value = self.insert_term_value(truth_value, root)
        # compute the negation of an expression
        elif root.name is '~':
            truth_value = self.insert_unary_value(truth_value, root)
        # compute the output of a binary function
        elif root.name in self.lexer.binary_op:
            truth_value = self.insert_binary_value(truth_value, root)
        # if token is the root of the tree, save truth value
        if root.root == True:
            self.addValue(truth_value)

    def handle_root(self, root):
        ''' Recursively return true values '''
        if not root:
            return
        #
        self.handle_root(root.left)
        self.handle_root(root.right)
        self.eval(root)

    def generate_truth_assign(self, t, expression):
        ''' Generate the initial truth assignments for each term '''
        tmpExp = []
        # create an empty dictionary to store seen terms
        char_map = defaultdict(lambda: None)
        for character in expression:
            # if the term hasn't been seen
            if char_map[character] == None:
                # pop the head character off and
                next_char = t[0]
                t = t[1:]
                # update character map with seen char
                char_map[character] = next_char
                # add character to temporary exp
                tmpExp.append(next_char)
            # otherwise, if the term has been seen
            elif char_map[character] != None:
                # append the seen term to the temporary exp
                next_char = char_map[character]
                tmpExp.append(next_char)
        return tmpExp

    def strip_terms(self, exp):
        ''' Return a list of used terms along with the same list without duplicates '''
        # filter out all propositional variables
        terms = list(filter(lambda x: True if x in self.alpha else False, list(exp)))
        # make a list of terms void of duplicates
        distinct = list(dict.fromkeys(terms))
        return terms, distinct

    def in_order(self, root, table):
        ''' Traverse the AST in in-order fashion '''
        # base case for recursion
        if root is None:
            return
        # traverse down the left branch
        self.in_order(root.left, table)
        # add the stack value to the table 
        value = root.eval_stack.pop(0)
        table.append(value)
        # traverse down the right branch
        self.in_order(root.right, table)

    def get_truth_table(self, tree, exp):
        ''' Return the truth table '''
        truth_table = []
        ts, dist = self.strip_terms(exp)
        truth_values = list(generate(len(dist)))
        terms = []
        #truth_values = list(map(self.generate_truth_assign(, ts), truth_values))
        for val in truth_values:
            terms.append(self.generate_truth_assign(val ,ts))
        
        for term in terms:
            table = []
            self.tt = term
            # calculate 
            self.print_tt(tree)
            # save
            self.in_order(tree, table)
            truth_table.append(table)
        truth_table = truth_table[::1]
        return truth_table, dist, truth_values

    def check_if_valid(self, vTable):
        ''' return false if truth matrix contains an instance of all true premises and a false conclusion '''
        for vT in vTable:
            for idx, v in enumerate(vT):
                # while the value is true, continue to read
                if v == 'T':
                    continue
                # if the last truth value is false, the argument is invalid
                elif v == 'F' and idx == (len(vT)-1):
                    return False
                else:
                    break
        # argument is valid
        return True

    def get_set_truth_table(self, tree, exp, total, master):
        ''' Return the truth table '''
        # save total amount of distinct terms
        trus, total_distinct = self.strip_terms(exp)
        truth_table = []
        indices = []
        for tn in trus:
            indices.append(total.index(tn))
        self.dist = total
        # for each truth value state(row) in the list, strip out relevant truth values
        
        # TODO: refactor with map and lambda
        truth_values = []
        for tv in master:
            truth_value = []
            for i in indices:
                truth_value.append(tv[i])
            truth_values.append(troo)
        
        # TODO: refactor below
        terms = []
        for tr in troos:
            terms.append(self.generate_truth_assign(tr, trus))
        
        for t in terms:
            table = []
            self.tt = t
            self.print_tt(tree)
            self.in_order(tree, table)
            truth_table.append(table)
        return truth_table


    def print_tt(self, root):
        ''' Loop through the AST and evaluate, returning the set of tables '''
        if root is None:
            return
        #
        self.handle_root(root.left)
        self.handle_root(root.right)
        # evaluate the root node
        self.eval(root)

    def insert_op(self, op):
        ''' Pop stack and make new operator ast '''
        #TODO: designate t as the root of the tree;
        # overwrite child nodes if they are specified as the root
        t = ast.AST(op)
        if op is '~':
            if self.tree_stack:
                # if it is a negation, put as right child
                tree = self.tree_stack.pop()
                tree.root = False
                t.right = tree
                self.tree_stack.append(t)
            else:
                self.tree_stack.append(op)
        elif op in self.lexer.binary_op:
            if self.tree_stack:
                tree = self.tree_stack.pop()
                tree.root = False
                t.right = tree
                tree = self.tree_stack.pop()
                tree.root = False
                t.left = tree
                self.tree_stack.append(t)
            else:
                raise Exception('Stack empty')

    def insert_term(self, term):
        ''' Create new ast with term as root '''
        if term not in self.seen:
            self.seen += term
        # create a tree with the term as a root
        tree = ast.AST(term)
        self.tree_stack.append(tree)

    def insert(self, c):
        ''' Insert terms and ops accordingly '''
        self.insert_term(c) if c in self.lexer.terms else self.insert_op(c)

    def normalize(self, fs):
        ''' split expression string by newline into expressions '''
        formulas = fs.split('\n')
        # return list of expressions after filtering out empty strings (i.e. '')
        return list(filter(lambda x: False if str(x) is '' else True, formulas))

    def get_tables(self, data):
        ''' return the truth tables for a set of sentences '''
        # normalize expressions by newlines
        formulas = self.normalize(data)
        
        # turn each expression into its postfix representation
        output = list(map(lambda x: self.lexer.lexify(x), formulas))

        #TODO: consider refactoring
        tables = []
        for idx, postfix in enumerate(output):
            for p in postfix:
                self.insert(p)
            tree = self.tree_stack.pop()
            tables.append(list(self.get_truth_table(tree, formulas[idx])))
        return tables
    
    def get_validity(self, data):
        ''' check whether or not a set of sentences is valid '''
        tz, total = self.strip_terms(data)
        master_list = list(generate(len(total)))
        
        # normalize expressions by newlines
        formulas = self.normalize(data)

        # perform the shunting yard operation on each formula
        output = list(map(lambda x: self.lexer.lexify(x), formulas))

        set_trus = []
        for idx, postfix in enumerate(output):
            # insert each item from the postfix array into an ast
            list(map(lambda x: self.insert(x), postfix))

            tree = self.tree_stack.pop()

            set_truth = list(self.get_set_truth_table(tree, formulas[idx], total, master_list))

            set_trus.append(set_truth)

        # reorganize the truth matrix by row
        vTable = zip(*self.vStack)

        # get the validity of the argument
        self.valid = self.check_if_valid(vTable)
        
        #TODO: reformat return value
        return [total] + [master_list] + set_trus + [self.valid]
