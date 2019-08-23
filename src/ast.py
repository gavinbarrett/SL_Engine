class AST:
    """ Atomic node of expression tree """

    def __init__(self, c):
        self.left = None
        self.right = None
        self.name = c
        self.eval_stack = []
        self.root = True

    def __str__(self):
        return self.name
