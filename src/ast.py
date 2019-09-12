class AST:
    """ Atomic node of expression tree """

    def __init__(self, character):

        self.left = None
        self.right = None
        self.name = character
        self.eval_stack = []
        self.root = True

    def __str__(self):
        return self.name
