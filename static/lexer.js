'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

exports.default = lexical_analysis;

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

/* 
 * This is a frontend lexer for analyzing the structure of well formed sentential logic formulas;
 * the analysis techniques have been greatly inspired by the following: http://www.cs.utsa.edu/~wagner/CS3723/rdparse/rdparser6.html
 * 
 * */

var Lexer = function () {
	function Lexer(feed) {
		_classCallCheck(this, Lexer);

		this.next = null;
		this.feed = feed;
		var reg = /[A-Z]/;
	}

	_createClass(Lexer, [{
		key: 'lex',
		value: function lex() {
			/* Try to parse the input */
			this.scan();
			if (this.next === '\n') return false;
			this.expression();
			return this.next === '\n';
		}
	}, {
		key: 'expression',
		value: function expression() {
			/* Try to match expression */
			if (this.next === '~') this.unary();else {
				this.binary();
				while (this.next === '^') {
					this.scan();
					this.binary();
				}
			}
		}
	}, {
		key: 'unary',
		value: function unary() {
			/* Try to match unary operator */
			this.scan();
			this.expression();
		}
	}, {
		key: 'binary',
		value: function binary() {
			/* Try to match binary operator */
			this.atomic();

			if (this.next === '<') {
				this.scan();
				this.biconditional();
			} else if (this.next === '-') {
				this.scan();
				this.conditional();
			}while (this.next === 'v') {
				this.scan();
				this.atomic();
			}
		}
	}, {
		key: 'conditional',
		value: function conditional() {
			/* Try to match a conditional */
			if (this.next === '>') {
				this.scan();
				this.atomic();
			} else throw 'Error parsing: invalid char: ', this.next;
		}
	}, {
		key: 'biconditional',
		value: function biconditional() {
			/* Try to match a biconditional */
			if (this.next === '-') {
				this.scan();
				this.conditional();
			} else throw 'Error parsing: invalid char: ', this.next;
		}
	}, {
		key: 'atomic',
		value: function atomic() {
			/* Try to match an atomic statement (i.e. A-Z) */
			if (this.next.match(this.reg)) this.scan();else if (this.next === '(') {
				this.scan();

				this.expression();

				if (this.next === ')') this.scan();else throw 'Error: missing brace';
			} else if (this.next === '~') {
				this.scan();
				this.expression();
			} else throw 'Error: not an acceptable expression: ', this.next;
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
			if (this.next == null) throw 'Error: string terminated without end symbol \n';
			while (this.next === " ") {
				this.next = this.read();
			}
		}
	}]);

	return Lexer;
}();

function lexical_analysis(arg) {
	if (!arg) return;
	var lexer = new Lexer(arg);
	try {
		if (lexer.lex()) {
			console.log('Analysis successful\n');
			return 1;
		}
	} catch (error) {
		console.log("Analysis failed\n");
		return 0;
	}
}