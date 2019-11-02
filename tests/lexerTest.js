/* 
 * This is a frontend lexer for analyzing the structure of well formed sentential logic formulas;
 * the analysis techniques have been greatly inspired by the following: http://www.cs.utsa.edu/~wagner/CS3723/rdparse/rdparser6.html
 * 
 * */

//export {lexical_analysis as default};

class Lexer {

	constructor(feed) {
		this.next = null;
		this.feed = feed;
		let reg = /[A-Z]/;
	}

	lex() {
		/* Try to parse the input */
		this.scan();
		if (this.next === '\n')
			return false;
		this.expression();
		return this.next === '\n';
	}

	expression() {
		//FIXME: refactor this function to only call binary when there is a binary function, and call atomic otherwise
		console.log("called exp");
		console.log("next is ", this.next);
		/* Try to match expression */
		if (this.next === '~')
			this.unary();
		else if (this.next === '('){
			this.scan();
			this.binary();
		} else if (this.next.match(this.reg));
			this.scan();
			//this.atomic();
			this.expression();
		while(this.next === 'v' || this.next === '^') {
			this.scan();
			this.binary();
		}
}
	unary() {
		console.log("called unary");
		console.log("next is ", this.next);
		/* Try to match unary operator */
		this.scan();
		if (this.next === '(') {
			this.scan();
			this.binary();
		} else
			this.expression();
		while (this.next === 'v' || this.next === '^') {
			this.scan();
			this.atomic()
		}
	}

	binary() {
		console.log("called binary");
		console.log("next is ", this.next);
		/* Try to match binary operator */
		this.atomic();
		if (this.next === '~')
			console.log('negative binary');
		if (this.next === '<') {
			this.scan();
			this.biconditional();
		} else if (this.next === '-') {
			this.scan();
			this.conditional();
		} else if (this.next === '(') {
			this.scan();
			this.expression();
			if (this.next === ')')
				this.scan();
			else
				throw 'Error: missing brace'
			
		} while (this.next === 'v' || this.next === '^') {
			this.scan();
			this.atomic();
		}
	}

	conditional() {
		console.log("called conditional");
		console.log("next is ", this.next);
		/* Try to match a conditional */
		if (this.next === '>') {
			this.scan();
			this.atomic();
		} else
			throw 'Error parsing: invalid char: ', this.next;
	}

	biconditional() {
		console.log("called biconditional");
		console.log("next is ", this.next);
		/* Try to match a biconditional */
		if (this.next === '-') {
			this.scan();
			this.conditional();
		} else 
			throw 'Error parsing: invalid char: ', this.next;
	}

	atomic() {
		console.log("called atomic");
		console.log("next is ", this.next);
		/* Try to match an atomic statement (i.e. A-Z) */
		if (this.next === '~') {
			//this.scan();
			this.unary();
		} else if (this.next.match(this.reg)) {
			this.scan();
			console.log("next is ", this.next);
		} else if (this.next === '(') {
			this.scan();
			this.expression();
			if (this.next === ')')
				this.scan();
			else
				throw 'Error: missing brace';
		} else
			throw 'Error: not an acceptable expression: ', this.next;
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
			throw 'Error: string terminated without end symbol \n';
		while (this.next === " ")
			this.next = this.read();
	}
}

function lexical_analysis(arg) {
	if (!arg)
		return;
	let lexer = new Lexer(arg);
	try {
		if (lexer.lex()) {
			console.log('Analysis successful\n');
			return 1;
		}
	} catch(error) {
		console.log("Analysis failed\n");
		return 0;
	}
}

console.log("~~P");
console.log(lexical_analysis("~~P\n"));
console.log("~P -> ~Q");
console.log(lexical_analysis("~P -> ~Q\n"));
console.log("Q v ~~W");
console.log(lexical_analysis("Q v ~~W\n"));
console.log("~(P ^ ~Q)");
console.log(lexical_analysis("~(P ^ ~Q)\n"));
console.log("R v B");
console.log(lexical_analysis("(R v B)\n"));
console.log("P -> Q");
console.log(lexical_analysis("P -> Q\n"));
console.log("A ^ B");
console.log(lexical_analysis("A ^ B\n"));
