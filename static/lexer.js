/* 
 * This is a lexer for analyzing the structure of well formed sentential logic formulas;
 * the analysis techniques have been greatly inspired by the following: http://www.cs.utsa.edu/~wagner/CS3723/rdparse/rdparser6.html
 * 
 * */

class Lexer {

	constructor(feed) {
		this.next = null;
		this.feed = feed;
	}

	p() {
		/* Try to parse the input */
		this.scan();
		if (this.next === '\n')
			return false;
		this.e();
		return this.next === '\n';
	}

	e() {
		/* Try to match expression */
		if (this.next === '~')
			this.u();
		else {
			this.b();
			while(this.next === '^') {
				this.scan();
				this.b();
			}
		}
	}

	u() {
		/* Try to match unary operator */
		this.scan();
		this.e();
	}

	b() {
		/* Try to match binary operator */
		this.s();

		if (this.next === '<') {
			this.scan();
			this.bicond();
		} else if (this.next === '-') {
			this.scan();
			this.cond();
		} while (this.next === 'v') {
			this.scan();
			this.s();
		}
	}

	cond() {
		/* Try to match a conditional */
		if (this.next === '>') {
			this.scan();
			this.s();
		} else
			throw 'Error parsing: invalid char: ', this.next;
	}

	bicond() {
		/* Try to match a biconditional */
		if (this.next === '-') {
			this.scan();
			this.cond();
		} else 
			throw 'Error parsing: invalid char: ', this.next;
	}

	s() {
		let reg = /[A-Z]/;
		if (this.next.match(reg)) {
			console.log(this.next, " matches");
			this.scan();
		}
		else if (this.next === '(') {
			this.scan();

			this.e();

			if (this.next === ')')
				this.scan();
			else
				throw 'Error: missing brace';
		} else if (this.next === '~') {
			this.scan();
			this.e();
		} else
			throw 'Error: not an acceptable expression: ', this.next;
	}

	read() {
		if (this.feed.length === 0)
			return null;
		let c = this.feed.slice(0, 1);
		this.feed = this.feed.slice(1);
		return c;
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
	let lexer = new Lexer(arg);
	try {
		if (lexer.p()) {
			console.log('Analysis successful\n');
			return 1
		} else
			throw 'Error: analysis unsuccessful;\n no end symbol \\n';
	} catch(error) {
		console.log("Analysis failed\n");
		return 0;
	}
}
