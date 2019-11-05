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
		} else if (this.next) {
			if (this.next.match(this.reg))
				this.atomic();
			else
				throw "Error: malformed expression\n";
		}
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
		} else if (this.next) {
			if (this.next.match(this.reg))
				this.atomic();
			
			else
				throw "Error: malformed formula following open parenthesis\n";
		}
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
				throw "Error: malformed formula following closing parenthesis\n";
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
		} else if (this.next) {
			if (this.next.match(this.reg))
				throw "Error: atomic sentences not seperated by operators\n";
			else if (this.next === '~')
				throw "Error: atomic sentence precedes negation\n"
		} else if (this.feed === '' && (this.open === this.closed))
			console.log("Terminating in atomic state");
		else
			throw "Error: malformed formula after atomic sentence\n";
	}

	unary() {
		/* handle a unary operator */
		this.scan();
		if (this.next === '~')
			this.unary();
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next) {
			if (this.next.match(this.reg))
				this.atomic();
			else
				throw "Error: malformed formula after unary operator\n";
		} else
			throw "Error: string terminated after unary operator\n";
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
			} else if (this.next) {
				if (this.next.match(this.reg))
					this.atomic();
				else
					throw "Error: malformed formula after binary operator\n";
			} else
				throw "Error: string terminated after binary operator\n"
		}
	}


	biconditional() {
		this.scan();
		if (this.next === '-')
			this.conditional();
		else
			throw "Error: malformed biconditional operator\n";
	}

	conditional() {
		this.scan();
		if (this.next === '>')
			this.binary();
		else
			throw "Error: malformed conditional operator\n";
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
		while (this.next === " ")
			this.next = this.read();
	}
}

export default function lexical_analysis(string) {
	if (!string)
		return;
	let p = new Parser(string);
	console.log("Testing ", string);
	// change parser to normalize each string and pass each one in successively
	try {
		p.expression();
		console.log('Analysis successful\n');
		return 1;
	} catch (error) {
		console.log('Analysis failed\n', error);
		return 0;	
	}
}

