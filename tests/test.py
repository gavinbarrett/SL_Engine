from lexer import *

def run():
    l = Lexer()
    print('~P v ~D')
    print(l.lexify('~P v ~D\n'))
    print('~Q -> R')
    print(l.lexify('~Q -> R\n'))
    print('F ^ ~R')
    print(l.lexify('F ^ ~R\n'))
    print('~~N v O')
    print(l.lexify('~~N v O\n'))
    print('Y ^ ~~T')
    print(l.lexify('Y ^ ~~T\n'))
    print('E v ~E')
    print(l.lexify('E v ~E'))

run()
