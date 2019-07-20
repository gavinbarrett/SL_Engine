from itertools import product

def generate(n):
    return product([0,1], repeat=n)
