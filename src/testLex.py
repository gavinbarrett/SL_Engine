from src.lexer import Lexer

l = Lexer()

string = '~~R'

m = l.shunting_yard_string(string)

print(m)
