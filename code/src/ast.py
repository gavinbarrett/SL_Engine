
class AST:
    """ Atomic node of expression tree """

    def __init__(self, c):
        self.left = None
        self.right = None
        self.t_value = False
        self.name = c
        self.eval_stack = []

    def init_t(self):
        self.t_value = True

    def __str__(self):
        return self.name
