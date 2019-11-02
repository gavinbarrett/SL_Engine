from newLexer import *

p = Parser()
print('Passing tests:')
forms = 'P -> (~Q v ~R)\n~~P\nQ v ~Q\nD v ~Q\n~(~H ^ R) -> T\n((P -> Q) <-> ~~~R) ^ B\n(B ^ N ^ K) v F\nB ^ N ^ K v F\nF v B ^ N ^ K\nF v (B ^ N ^ K)\n'
#noforms = '((R v E))\n(~~ v B)\nD ^ ->\n'
#forms = '(B ^ N ^ K) v F\nB ^ N ^ K v F\n'
p.lexify(forms)
#print('Non-passing tests:')
#p.lexify(noforms)

