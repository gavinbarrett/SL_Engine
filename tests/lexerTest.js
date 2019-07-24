class Parser {

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
		console.log('c: ', c);
		this.feed = this.feed.slice(1);
		console.log('feed: ', this.feed);
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

function run_parser(arg) {
	arg = arg.replace('\s', '');
	let parser = new Parser(arg);
	console.log('\nSource: ', arg);
	try {
		if (parser.p()) {
			console.log('Parsing successful');
			return 1
		} else
			throw 'Error: parsing unsuccessful;\n no end symbol $';
	} catch(error) {
		//console.log("Parsing failed\n", error);
		return 0;
	}
}


function test() {
	console.log('Passing tests');
	let test = "(P -> Q) ^ R\n";
	let test1 = "(P <-> F) v (D -> C)\n";
	let test2 = "H v ~(P -> Q)\n";
	let test3 = "P v ~W\n";
	let test4 = "~(Z ^ B)\n";
	let test5 = "S -> R\n";

	run_parser(test);
	run_parser(test1);
	run_parser(test2);
	run_parser(test3);
	run_parser(test4);
	run_parser(test5);

	console.log("\nNon-passing tests");
	let btest = "(a v B)\n";
	let btest1 = "((A -> B)\n";
	let btest2 = "(A v (C v v B))\n";
	let btest3 = "(F F ^ B)\n";
	let btest4 = "A -> \n";
	let btest5 = "B ^ S)\n";

	run_parser(btest);
	run_parser(btest1);
	run_parser(btest2);
	run_parser(btest3);
	run_parser(btest4);
	run_parser(btest5);
}

test();

