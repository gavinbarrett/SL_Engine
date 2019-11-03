from lexer import *

l = Lexer()

forms = 'P -> Q\nP\nQ v R\n'

print(l.lexify(forms))
