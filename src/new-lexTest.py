from newLexer import *

p = Parser()
forms = 'P -> (~Q v ~R)\n~~P\nQ v ~Q\nD v ~Q\n~(~H ^ R) -> T\n'
p.lexify(forms)
