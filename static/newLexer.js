
class Parser {
	
	constructor(feed) {
		/* construct a parser to recognize propositional logic */
		this.next = null;
		this.feed = feed;
		this.reg = /[A-Z]/;
		this.open = 0;
		this.closed = 0;
		this.binary_ops = ['^','v','<','-'];
	}
	
	lex() {
		/* try to parse the input */
		this.scan();
		if (this.next === '\n')
			return false;
		this.expression();
		return this.next === '\n';
	}

	expression() {
		/* try to parse the expression */
		this.scan();
		if (this.next === '~')
			this.unary()
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next.match(this.reg))
			this.atomic();
		else
			throw "Error: malformed expression";
		return this.next === null;
	}

	open_parenthesis() {
		/* handle opening parenthesis */
		this.scan();
		if (this.next === '~')
			this.unary();
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next === ')') {
			this.closed += 1;
			this.closed_parenthesis();
		} else if (this.next.match(this.reg))
			this.atomic();
		else
			throw "Error: malformed formula following open parenthesis";
	}

	closed_parenthesis() {
		/* handle closing parenthesis */
		if (this.feed === '' && (this.open === this.closed))
			console.log("Terminating in parenthesis");
		else {
			this.scan();
			if (this.next === ')') {
				this.closed += 1;
				this.closed_parenthesis();
			} else if (this.binary_ops.includes(this.next))
				this.binary();
			else
				throw "Error: malformed formula following closing parenthesis";
		}
	}

	atomic() {
		/* handle an atomic sentence */
		this.scan();
		if (this.binary_ops.includes(this.next))
			this.binary();
		else if (this.next === ')') {
			this.closed += 1;
			this.closed_parenthesis();
		} else if (this.feed === '' && (this.open === this.closed))
			console.log("Terminating in atomic state");
		else
			throw "Error: malformed formula after atomic sentence";
	}

	unary() {
		/* handle a unary operator */
		this.scan();
		if (this.next === '~')
			this.unary();
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next.match(this.reg))
			this.atomic();
		else
			throw "Error: malformed formula after unary operator";
	}

	binary() {
		/* handle a binary operator */
		if (this.next === '<')
			this.biconditional();
		else if (this.next === '-')
			this.conditional();
		else {
			this.scan();
			if (this.next === '~')
				this.unary();
			else if (this.next === '(') {
				this.open += 1;
				this.open_parenthesis();
			} else if (this.next.match(this.reg))
				this.atomic();
			else
				throw "Error: malformed formula after binary operator";
		}

	}


	biconditional() {
		this.scan();
		if (this.next === '-')
			this.conditional();
		else
			throw "Error: malformed biconditional operator";
	}

	conditional() {
		this.scan();
		if (this.next === '>')
			this.binary();
		else
			throw "Error: malformed conditional operator";
	}

	read() {
		
		if (this.feed.length === 0)
			return null;
		let character = this.feed.slice(0, 1);
		this.feed = this.feed.slice(1);
		return character;
	}

	scan() {
		this.next = this.read();
		if (this.next == null)
			return null;
			//throw "Error: string terminated without end symbol";
		while (this.next === " ")
			this.next = this.read();
	}
	
	

}

let p = new Parser('(~~~T v Z)');
try {
	p.expression();
	console.log('\nAnalysis successful\n');
} catch (error) {
	console.log('Analysis failed\n', error);
}
