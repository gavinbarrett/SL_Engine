'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Parser = function () {
	function Parser(feed) {
		_classCallCheck(this, Parser);

		/* construct a parser to recognize propositional logic */
		this.next = null;
		this.feed = feed;
		this.reg = /[A-Z]/;
		this.open = 0;
		this.closed = 0;
		this.binary_ops = ['^', 'v', '<', '-'];
	}

	_createClass(Parser, [{
		key: 'lex',
		value: function lex() {
			/* try to parse the input */
			this.scan();
			if (this.next === '\n') return false;
			this.expression();
			return this.next === '\n';
		}
	}, {
		key: 'expression',
		value: function expression() {
			/* try to parse the expression */
			this.scan();
			if (this.next === '~') this.unary();else if (this.next === '(') {
				this.open += 1;
				this.open_parenthesis();
			} else if (this.next) {
				if (this.next.match(this.reg)) this.atomic();else throw "Error: malformed expression\n";
			}
		}
	}, {
		key: 'open_parenthesis',
		value: function open_parenthesis() {
			/* handle opening parenthesis */
			this.scan();
			if (this.next === '~') this.unary();else if (this.next === '(') {
				this.open += 1;
				this.open_parenthesis();
			} else if (this.next === ')') {
				this.closed += 1;
				this.closed_parenthesis();
			} else if (this.next) {
				if (this.next.match(this.reg)) this.atomic();else throw "Error: malformed formula following open parenthesis\n";
			}
		}
	}, {
		key: 'closed_parenthesis',
		value: function closed_parenthesis() {
			/* handle closing parenthesis */
			if (this.feed === '' && this.open === this.closed) console.log("Terminating in parenthesis");else {
				this.scan();
				if (this.next === ')') {
					this.closed += 1;
					this.closed_parenthesis();
				} else if (this.binary_ops.includes(this.next)) this.binary();else throw "Error: malformed formula following closing parenthesis\n";
			}
		}
	}, {
		key: 'atomic',
		value: function atomic() {
			/* handle an atomic sentence */
			this.scan();
			if (this.binary_ops.includes(this.next)) this.binary();else if (this.next === ')') {
				this.closed += 1;
				this.closed_parenthesis();
			} else if (this.next) {
				if (this.next.match(this.reg)) throw "Error: atomic sentences not seperated by operators\n";else if (this.next === '~') throw "Error: atomic sentence precedes negation\n";
			} else if (this.feed === '' && this.open === this.closed) console.log("Terminating in atomic state");else throw "Error: malformed formula after atomic sentence\n";
		}
	}, {
		key: 'unary',
		value: function unary() {
			/* handle a unary operator */
			this.scan();
			if (this.next === '~') this.unary();else if (this.next === '(') {
				this.open += 1;
				this.open_parenthesis();
			} else if (this.next) {
				if (this.next.match(this.reg)) this.atomic();else throw "Error: malformed formula after unary operator\n";
			} else throw "Error: string terminated after unary operator\n";
		}
	}, {
		key: 'binary',
		value: function binary() {
			/* handle a binary operator */
			if (this.next === '<') this.biconditional();else if (this.next === '-') this.conditional();else {
				this.scan();
				if (this.next === '~') this.unary();else if (this.next === '(') {
					this.open += 1;
					this.open_parenthesis();
				} else if (this.next) {
					if (this.next.match(this.reg)) this.atomic();else throw "Error: malformed formula after binary operator\n";
				} else throw "Error: string terminated after binary operator\n";
			}
		}
	}, {
		key: 'biconditional',
		value: function biconditional() {
			this.scan();
			if (this.next === '-') this.conditional();else throw "Error: malformed biconditional operator\n";
		}
	}, {
		key: 'conditional',
		value: function conditional() {
			this.scan();
			if (this.next === '>') this.binary();else throw "Error: malformed conditional operator\n";
		}
	}, {
		key: 'read',
		value: function read() {

			if (this.feed.length === 0) return null;
			var character = this.feed.slice(0, 1);
			this.feed = this.feed.slice(1);
			return character;
		}
	}, {
		key: 'scan',
		value: function scan() {
			this.next = this.read();
			if (this.next == null) return null;
			while (this.next === " ") {
				this.next = this.read();
			}
		}
	}]);

	return Parser;
}();

var test = function test(string) {
	var p = new Parser(string);
	console.log("Testing ", string);
	try {
		p.expression();
		console.log('Analysis successful\n');
	} catch (error) {
		console.log('Analysis failed\n', error);
	}
};
console.log("##################\n# Passing States #\n##################\n");
test("~P v ~(A v ~B)");
test("P -> (I ^ ~(P v Q))");
test("P ^ B");
test("P");
test("~~P");
test("~~~~~T");
test("R <-> ~(B ^ Z)");
test("L ^ N ^ S");
test("(B v D v S) ^ ~F");
test("(A v B) ^ ~(A ^ B)");
test("P -> P");
test("~~P -> G");
test("(C ^ A) -> D");
test("~T ^ ~B");
test("~~T ^ ~T");
test("()");

console.log("########################\n# Non - Passing States #\n########################\n");
test("~P v ~(A v )");
test("-> (I ^ ~(P v Q))");
test("P B");
test("P P");
test("~~");
test("~~R~~~T");
test("R <- ~(B ^ Z)");
test("L ^  ^ S");
test("B v D v S) ^ ~F");
test("(A v B) ^ ~A ^ B)");
test("P -> ");
test("~~ -> G");
test("(C ^ A -> D");
test("~T ^");
test("~~T  ~T");
test("HELLO");
test("hello");
test("+_-");