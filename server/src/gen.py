from itertools import product

def generate(n):
    return product(['T','F'], repeat=n)
