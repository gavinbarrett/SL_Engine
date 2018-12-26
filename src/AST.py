
class AST:
    """ Abstract syntax tree for expressions """
    def __init__(self):
        self.root = None
        self.log_ops = ['~'. '^', 'v', '=>', '<=>']
        self.terms = [chr(i) for i in range(65, 91)]
        self.tree_stack = []  # stack of ASTs
    
    def insert_op(self, op):
        """ Pop stack and make new tree with operator as root; make old root a child of new root """
        

    def insert_term(self, t):
        """ Construct a new tree with the term and push it onto the tree_stack """
        
    def insert(self, c):
        if c in self.log_ops:
            
        elif c in self.terms:
            
        else:
            raise Exception('token unrecognized..')
