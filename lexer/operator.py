
class Operator:

    def __init__(self, name):
        self.ops = ['~', '^', 'v', '=>', '<=>', '(', '[']
        self.name = name
        self.prec = self.ops.index(name)

    def __lt__(self, other):
        """ Enable sorting by precedence """
        return self.prec < other.prec

    def __le__(self, other):
        """ Enable sorting by precedence """
        return self.prec <= other.prec
