from operator import *
class OpStack():

    def __init__(self):
        self.operators = []

    def Push(self, name):
        """ Push operator onto stack """
        op = Operator(name)
        self.operators.append(op)
        #self.Sort()         # Keep sorted
    
    def Top(self):
        if not self.operators:
            raise Exception('OpStack is empty!\n')
        a = self.operators.pop()
        self.operators.push(a)
        return a

    def Pop(self):
        """ Pop from stack """
        if not self.operators:
            raise Exception('OpStack is empty!\n')
        self.operators.pop()

    def Sort(self):
        """ Sort operators in stack according to precedence """
        self.operators.sort(key=lambda x: x.prec)

    def PrintSelf(self):
        """ Output stack """
        for e in self.operators:
            print(e.name + ' ')
