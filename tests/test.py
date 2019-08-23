from src.parser import Parser

def run():
    exp = 'P -> Q\nQ\nP\n'
    p = Parser()
    c = p.get_validity(exp)
    print("\nResult:\n")
    for cs in c:
        print(cs)
run()
