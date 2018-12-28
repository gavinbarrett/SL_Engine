
class AST:
    """ Atomic node of expression tree """

    def __init__(self, c):
        self.left = None
        self.right = None
        self.t_value = False
        self.name = c

    def init_t(self):
        self.t_value = True
