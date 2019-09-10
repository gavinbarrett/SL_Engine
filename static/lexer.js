/* 
 * This is a frontend lexer for analyzing the structure of well formed sentential logic formulas;
 * the analysis techniques have been greatly inspired by the following: http://www.cs.utsa.edu/~wagner/CS3723/rdparse/rdparser6.html
 * 
 * */

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
		/* Try to match expression */
		if (this.next === '~')
			this.unary();
		else {
			this.binary();
			while(this.next === '^') {
				this.scan();
				this.binary();
			}
		}
	}

	unary() {
		/* Try to match unary operator */
		this.scan();
		this.expression();
	}

	binary() {
		/* Try to match binary operator */
		this.atomic();

		if (this.next === '<') {
			this.scan();
			this.biconditional();
		} else if (this.next === '-') {
			this.scan();
			this.conditional();
		} while (this.next === 'v') {
			this.scan();
			this.atomic();
		}
	}

	conditional() {
		/* Try to match a conditional */
		if (this.next === '>') {
			this.scan();
			this.atomic();
		} else
			throw 'Error parsing: invalid char: ', this.next;
	}

	biconditional() {
		/* Try to match a biconditional */
		if (this.next === '-') {
			this.scan();
			this.conditional();
		} else 
			throw 'Error parsing: invalid char: ', this.next;
	}

	atomic() {
		/* Try to match an atomic statement (i.e. A-Z) */
		if (this.next.match(this.reg))
			this.scan();
		else if (this.next === '(') {
			this.scan();

			this.expression();

			if (this.next === ')')
				this.scan();
			else
				throw 'Error: missing brace';
		} else if (this.next === '~') {
			this.scan();
			this.expression();
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

export default function lexical_analysis(arg) {
	alert(arg);
	if (!arg)
		alert('empty');
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
