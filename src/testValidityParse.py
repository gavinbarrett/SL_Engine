from parser import *

p = Parser()

forms = "P <-> Q\nP -> Q\n"
# print root value columns followed by conclusion
b = p.get_validity(forms)
# print validity
print(b[-1])
