#!/usr/bin/env python3
from OpStack import OpStack as os

o = os()

a = '~'
b = '^'
c = 'v'
d = '=>'
e = '<=>'

o.Push(b)
o.Push(e)
o.Push(a)
o.Push(c)
o.Push(d)

print('Unsorted:\n')
o.PrintSelf()
o.Sort()
print('Sorted:\n')
o.PrintSelf()
