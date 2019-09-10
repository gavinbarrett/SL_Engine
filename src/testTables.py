from parser import Parser

p = Parser()

exp = 'P -> Q\n'

truth_table = p.get_tables(exp)

print(truth_table)
