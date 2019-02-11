from click import getchar
import sys
def main():
    line = ['a','b','c','d','e','f']
    i = 0
    while line:
        c = getchar()
        if c == '[A':
            d = line[i]
            print(d + '\r', end='')
            i += 1
        elif c == 'q':
            sys.exit()
        else:
            print('dang')
main()
