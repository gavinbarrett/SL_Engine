from itertools import product

def generate(n):
    ''' return a truth value matrix of (2**n) * n '''
    return product(['T','F'], repeat=n)
