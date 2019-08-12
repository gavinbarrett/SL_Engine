from src.parser import Parser

def run():
    exp = 'P -> Q\nQ -> R\n'
    p = Parser()
    c = p.read_string(exp, False)
    print("\nResult:\n")
    for cs in c:
        print(cs)
run()
