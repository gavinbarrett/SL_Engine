import string

class Parser:
	'''
	This module is designed to be capable of reading through and interpreting expressions of propositional logic. There are two core functionalities of this module:
	1.) To determine whether a given input is a valid expression in the language of propositional logic, and,
	2.) To perform the shunting-yard algorithm on such a valid expression in order to obtain the postfix form (e.g. `P -> Q` becomes `P Q ->`)
	Two functions comprise the API: lexify() and lexify_exp(), the first latter will take in a valid expression (e.g. `P -> Q`) and return the postfix;
	If a postfix expression is returned, then the program successfully passed the lexing stage and the expression considered can be considered acceptable.
	Calling lexify() will normalize any input to remove newlines and empty strings, and then pass each subsequent expression to lexify_exp()
	'''
	def __init__(self):
		self.next = None
		self.feed = ''
		self.open_paren = 0
		self.clos_paren = 0
		self.open = 0
		self.closed = 0
		self.build = ''
		self.postfix = []
		self.op_stack = []
		self.binary_stem = ['^', 'v', '<', '-']
		self.oparen = '('
		self.binary_op = ['~', '^', 'v', '->', '<->']
		self.prec = ['(', '~', '^', 'v', '->', '<->']
		self.terms = list(string.ascii_uppercase)

	def read(self):
		''' Grab the next character '''
		if not self.feed:
			return None
		# save the first element
		character = self.feed[0]
		# overwrite the feed with the tail
		self.feed = self.feed[1:]
		return character

	def scan(self):
		''' Advance through the string '''
		self.next = self.read()
		if self.next is None:
			return None
		while self.next.isspace():
			self.next = self.read()

	def get_precedence(self, operator):
		''' return the operator's precedence '''
		return self.prec.index(operator)

	def lexify(self, args):
		''' Pass each expression through the lexify_exp function '''
		# normalize input string by newlines
		args = args.split('\n')
		# filter out any empty strings
		args = list(filter(bool, args))
		# append operators to the output
		output = []
		print("args:")
		print(args)
		for arg in args:
			output.append(self.lexify_exp(arg))
		return output

	def lexify_exp(self, exp):
		''' Try to read the input into postfix '''
		# set the feed to the expression
		self.feed = exp
		# get the first character
		# self.scan()
		# try to match an expression
		self.exp()
		# reset the feed
		self.feed = ''
		# if number of parentheses don't match, raise an error
		#if self.next == ')' and (self.open_paren - (self.clos_paren + 1)) != 0:
		#	raise Exception("Error: unaccompanied closing brace")
		# return the final postfix representation
		return self.pop_stack()

	def exp(self):
		''' Match an expression '''
		# match a unary expression
		self.scan()
		if self.next == '~':
			self.unary()
		elif self.next == '(':
			self.open += 1
			self.o_paren()
		elif self.next:
			if self.next in self.terms:
				self.atomic()
		else:
			raise Exception("Error: malformed expression\n")

	def unary(self):
		''' Match unary function, negation (~) '''
		# append ~ to the stack and try to match its corresponding expression
		self.scan()
		self.op_stack.append('~')
		if self.next == '~':
			self.unary()
		elif self.next == '(':
			self.open += 1
			self.o_paren()
		elif self.next:
			if self.next in self.terms:
				self.atomic()
			else:
				raise Exception("Error: malformed formula after unary operator\n")
		else:
   			raise Exception("Error: string terminated after unary operator\n")
	
	def binary(self):
		''' Match binary functions: ^, v, ->, <-> '''
		print("self.next is: " + self.next)
		if self.next == '<':
			self.build += self.next
			self.biconditional()
		elif self.next == '-':
			self.build += self.next
			self.conditional()
		else:
			if self.next == '^' or self.next == 'v':
				self.process_op(self.next)
			self.scan()
			if self.next == '~':
				self.unary()
			elif self.next == '(':
				self.open += 1
				self.o_paren()
			elif self.next:
				if self.next in self.terms:
					self.atomic()
				else:
					raise Exception("Error: malformed formula after binary operator\n")
			else:
				raise Exception("Error: string terminated after binary operator\n")

	def conditional(self):
		''' Match a conditional expression '''
		print("self.next is: " + self.next)
		self.scan()
		if self.next == '>':
			# update operator to either -> or <->
			self.build += self.next
			# add operator to op_stack or postfix
			self.process_op(self.build)
			self.build = ''
			# return to binary state
			self.binary()
			# otherwise, operator is not in our language
		else:
			raise Exception("Error parsing conditional; invalid char: " + str(self.next))

	def biconditional(self):
		''' Match a biconditional expression '''
		print("self.next is: " + self.next)
		self.scan()
		if self.next == '-':
			# update the operator to either - or <-
			#self.build += self.next
			# try to match a conditional
			self.conditional()
			# otherwise, operator is not in out language
		else:
			raise Exception('Error parsing biconditional; invalid char: ' + str(self.next))

	def atomic(self):
		''' Match atomic sentences '''
		# if the next character is a negation, try to match a negated expression
		self.postfix += self.next
		if self.op_stack:
			if self.op_stack[-1] == '~':
				# append the term's negation
				self.op_stack.pop(-1)
				self.postfix += '~'
		self.scan()
		if self.next in self.binary_stem:
			self.binary()
		elif self.next == ')':
			self.closed += 1
			self.c_paren()
		elif self.next:
			if self.next in self.terms:
				raise Exception("Error: atomic sentences not seperated by operators\n")
			elif self.next == '~':
				raise Exception("Error: atomic sentence precedes negation\n")
		elif self.feed == '' and (self.open == self.closed):
			print("Terminating in atomic state\n")
		else:
			raise Exception("Error: malformed formula after atomic sentence\n")

	def o_paren(self):
		''' handle opening parentheses '''
		# if the stack is not empty, remove the top element
		if self.op_stack:
			prev_op = self.op_stack.pop()
			# if previous operator precedence is less, while less,
			# append previous operator to output
			if self.get_precedence(prev_op) < self.get_precedence(self.oparen):
				while self.get_precedence(prev_op) < self.get_precedence(self.oparen):
					self.postfix.append(prev_op)
					# if the stack is not empty, pop it
					if self.op_stack:
						prev_op = self.op_stack.pop()
					# otherwise, add the parenthesis to the stack
					else:
						self.op_stack.append(self.oparen)
			# otherwise, add both the previous operator and the parenthesis to the stack
			else:
				self.op_stack.append(prev_op)
				self.op_stack.append(self.oparen)
		# otherwise add paranthesis to the stack
		else:
			self.op_stack.append(self.oparen)

		self.scan()
		if self.next == '~':
			self.unary()
		elif self.next == '(':
			self.open += 1
			self.o_paren()
		elif self.next == ')':
			self.closed += 1	
			self.c_paren()
		elif self.next:
			if self.next in self.terms:
				self.atomic()
			else:
				raise Exception("Error: malformed formula following open parenthesis\n")


	def c_paren(self):
		''' handle closing parentheses  '''
		# if stack is not empty, remove the top operator
		if self.op_stack:
			prev_op = self.op_stack.pop()
            # while we have not found an opening paren, append operator to output
			while prev_op != '(':
				self.postfix.append(prev_op)
				# get the next stack operator
				if self.op_stack:
					prev_op = self.op_stack.pop()
				# if the stack is empty, raise an error
				else:
					raise Exception('No opening brace detected\n')
	
		if self.feed == '' and (self.open == self.closed):
			print("Terminating in parenthesis\n")
		else:
			self.scan()
			if self.next == ')':
				self.closed += 1
				self.c_paren()
			elif self.next in self.binary_stem:
				self.binary()
			else:
				raise Exception("Error: malformed formula following closing parenthesis\n")

	def process_op(self, operator):
		''' process operators into the postfix expression '''
		# if the stack is not empty, remove the top element
		if self.op_stack:
			prev_op = self.op_stack.pop()
			# if stack operator has lower precedence, add both to the stack
			if self.get_precedence(prev_op) <= self.get_precedence(operator):
				self.op_stack.append(prev_op)
				self.op_stack.append(operator)
		# otherwise, append the stack operator to output and push op to stack
			else:
				self.postfix.append(prev_op)
				self.op_stack.append(operator)
		# otherwise, add operator to stack
		else:
			self.op_stack.append(operator)

	def pop_stack(self):
		''' pop the remainder of the stack to the output queue '''
		output = []
		# while stack isn't empty, remove it and add to the output
		while self.op_stack:
			operator = self.op_stack.pop()
			self.postfix.append(operator)
		# append the operator lists
		output += self.postfix
		# erase postfix state
		self.postfix = []
		return output
