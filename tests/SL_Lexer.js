/* This file includes a lexer class that recognizes formulas that are acceptable in sentential logic.*/

const return_alpha = () => {
	/* Return an uppercase alphabet */
	let alphabet = [];
	for (let i = 65; i < 91; i++) alphabet.push(String.fromCharCode(i));
	return alphabet;
};

class Lexer {
	/* Create a lexer to recognize sentential logic */
	constructor() {
		this.un_op = '~';
		this.log_ops = ['~', '^', 'v', '->', '<->'];
		this.half_ops = ['<', '-', '<-', '>'];
		this.poss_ops = ['~', '^', 'v', '->', '<->', '-', '<', '>'];
		this.prec = ['(', '[', '~', '^', 'v', '->', '<->'];
		this.braces = ['(', ')', '[', ']', '{', '}'];
		this.braces_open = ['(', '[', '{'];
		this.braces_closed = [')', ']', '}'];
		this.w_space = ['\n', '\t', ' '];
		this.space = ' ';
		this.newline = '\n';
		this.terms = return_alpha();
		this.op_stack = [];
		this.b_stack = [];
		this.l_stack = [];
		this.postfix = [];
		this.seen = [];
		this.tmp = [];
		this.expressions = [];
		this.t_count = 0;
		this.prev = undefined;
	}

	handle_terms(term) {
		/* Take care of atomic statements */
		if (this.seen.includes(term)) {} else {
			this.seen.push(term);
			this.t_count += 1;
		}
		this.postfix.push(term);
	}

	open_brace(brace) {
		/* Handle opening braces */
		if (this.op_stack.length != 0) {
			let a = this.op_stack.pop();
			if (this.get_prec(a) < this.get_prec(brace)) {
				while (this.get_prec(a) < this.get_prec(brace)) {
					this.postfix.push(a);
					if (this.op_stack.length == 0) a = this.op_stack.pop();else this.op_stack.push(brace);
				}
			} else {
				this.op_stack.push(a);
				this.op_stack.push(brace);
			}
		} else {
			this.op_stack.push(brace);
		}
	}

	closed_brace(brace) {
		/* Handle closing braces */
		if (this.op_stack.length == 0) console.log("Stack is empty!");else {
			let a = this.op_stack.pop();
			while (a != this.counter(brace)) {
				this.postfix.push(a);
				if (this.op_stack.length != 0) {
					a = this.op_stack.pop();
				} else {
					console.log('No opening brace detected!');
					throw brace;
				}
			}
		}
	}

	handle_braces(brace) {
		/* Take care of braces */
		if (this.braces_open.includes(brace)) this.open_brace(brace);else if (this.braces_closed.includes(brace)) this.closed_brace(brace);
	}

	get_prec(op) {
		/* Return the precedence of the given operator */
		return this.prec.indexOf(op);
	}

	counter(op) {
		/* Return the counter of the braces */
		if (this.braces_open.includes(op)) {
			return this.braces_closed[this.braces_open.indexOf(op)];
		} else if (this.braces_closed.includes(op)) {
			return this.braces_open[this.braces_closed.indexOf(op)];
		}
	}

	get_op(operator) {
		let op = '';
		for (let i = this.l_stack.length; i > 0; i--) op = this.l_stack.pop() + operator;
		return op;
	}

	build_op(operator) {
		/* Update a candidate operator to one of: (<,-,->,<-,<->) */
		let op = this.get_op(operator);
		if (this.log_ops.includes(op)) {
			if (this.op_stack.length == 0) this.op_stack.push(op);else {
				let a = this.op_stack.pop();
				if (this.get_prec(a) < this.get_prec(op)) {
					if (this.log_ops.includes(a)) this.postfix.push(a);else this.op_stack.push(a);
					this.op_stack.push(op);
				}
			}
		} else if (this.poss_ops.includes(operator)) {
			this.l_stack.push(op);
		}
	}

	handle_operators(operator) {
		/* Take care of operators */
		if (this.log_ops.includes(operator)) {
			if (this.op_stack) {
				let a = this.op_stack.pop();
				if (this.get_prec(a) <= this.get_prec(operator)) {
					if (this.log_ops.includes(a)) {
						this.postfix.push(a);
					} else {
						this.op_stack.push(a);
					}
					this.op_stack.push(operator);
				} else if (this.get_prec(a) > this.get_prec(operator)) {
					this.op_stack.push(a);
					this.op_stack.push(operator);
				} else if (a == this.counter(operator)) {
					return;
				}
			} else {
				this.op_stack.push(operator);
			}
		} else if (this.half_ops.includes(operator)) {
			if (this.l_stack.length == 0) {
				this.l_stack.push(operator);
			} else {
				this.build_op(operator);
			}
		}
	}

	read_charac(charac) {
		if (this.prev == undefined) {}
		/* Try to read the next character */
		if (charac == '\n') {
			this.expressions.push(this.tmp);
			this.tmp = '';
		} else if (this.terms.includes(charac)) {
			this.tmp += charac;
			this.handle_terms(charac);
		} else if (this.braces.includes(charac)) {
			this.tmp += charac;
			this.handle_braces(charac);
		} else if (this.poss_ops.includes(charac)) {
			this.tmp += charac;
			this.handle_operators(charac);
		} else if (charac == this.space) {
			return;
		} else throw "Invalid character " + charac;
	}

	pop_remaining(output) {
		/* Pop the remaining elements of the operator stack */
		while (this.op_stack.length > 0) {
			let a = this.op_stack.pop();
			//FIXME: sometimes undefined is added to the tail of the list; below is just a quick fix
			if (a == undefined) {
				continue;
			}
			if (this.braces_open.includes(a)) {
				console.log("braczorrs");
				console.log("No matching closing brace");
				throw a;
			}
			this.postfix.push(a);
		}
		output.push(this.postfix);
		output = output.reverse();
		this.postfix = [];
	}

	shunting_yard(formulas) {
		/* Return the postfix of the formula */
		let output = [];
		try {
			for (let i = 0; i < formulas.length; i++) this.read_charac(formulas[i]);
			this.pop_remaining(output);
		} catch (error) {
			console.log(error);
		}
		console.log(output);
	}
}

function run_test() {

	let test = "(P -> Q) ^ R\n";
	let test1 = "(P <-> F) v (D -> C)\n";
	let test2 = "H v ~(P -> Q)\n";
	let test3 = "P v ~W\n";
	let test4 = "~(Z ^ B)\n";
	let test5 = "S -> R\n";

	let lex = new Lexer();
	console.log("Passing tests");
	console.log(test);
	lex.shunting_yard(test);
	console.log(test1);
	lex.shunting_yard(test1);
	console.log(test2);
	lex.shunting_yard(test2);
	console.log(test3);
	lex.shunting_yard(test3);
	console.log(test4);
	lex.shunting_yard(test4);
	console.log(test5);
	lex.shunting_yard(test5);

	console.log("Non-passing tests");
	let btest = "(a v B)\n";
	let btest1 = "((A -> B)\n";
	let btest2 = "(A v (C v v B))\n";
	let btest3 = "(F F ^ B)\n";
	let btest4 = "A -> \n";
	let btest5 = "B ^ S)\n";
	console.log(btest);
	try {
		lex.shunting_yard(btest);
	} catch (error) {
		console.log("Error is: ");
		console.log(error);
	}
	console.log(btest1);
	try {
		lex.shunting_yard(btest1);
	} catch (error) {
		console.log("Error is: ");
		console.log(error);
	}
	console.log(btest2);
	try {
		lex.shunting_yard(btest2);
	} catch (error) {
		console.log("Error is: ");
		console.log(error);
	}
	console.log(btest3);
	try {
		lex.shunting_yard(btest3);
	} catch (error) {
		console.log("Error is: ");
		console.log(error);
	}
	console.log(btest4);
	try {
		lex.shunting_yard(btest4);
	} catch (error) {
		console.log("Error is: ");
		console.log(error);
	}
	console.log(btest5);
	try {
		lex.shunting_yard(btest5);
	} catch (error) {
		console.log("Error is: ");
		console.log(error);
	}
}

run_test();