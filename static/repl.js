var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import lexical_analysis from './lexer.js';

function request(url, method) {
	/* Open an http request */
	var xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr;
}

var Segment = function (_React$Component) {
	_inherits(Segment, _React$Component);

	function Segment(props) {
		_classCallCheck(this, Segment);

		var _this = _possibleConstructorReturn(this, (Segment.__proto__ || Object.getPrototypeOf(Segment)).call(this, props));

		_this.state = {
			symbol: props.sym,
			english: props.eng
		};
		return _this;
	}

	_createClass(Segment, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "segment" },
				React.createElement(
					"div",
					{ className: "sym" },
					this.state.symbol
				),
				React.createElement(
					"div",
					{ className: "eng" },
					this.state.english
				)
			);
		}
	}]);

	return Segment;
}(React.Component);

var Banner = function (_React$Component2) {
	_inherits(Banner, _React$Component2);

	function Banner(props) {
		_classCallCheck(this, Banner);

		var _this2 = _possibleConstructorReturn(this, (Banner.__proto__ || Object.getPrototypeOf(Banner)).call(this, props));

		_this2.state = {
			negation: "~",
			neg: "negation",
			conjunction: "^",
			con: "conjunction",
			disjunction: "v",
			dis: "disjunction",
			conditional: "->",
			cond: "conditional",
			biconditional: "<->",
			bicond: "biconditional"
		};
		return _this2;
	}

	_createClass(Banner, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "bannerWrapper" },
				React.createElement(Segment, { sym: this.state.negation, eng: this.state.neg }),
				React.createElement(Segment, { sym: this.state.conjunction, eng: this.state.con }),
				React.createElement(Segment, { sym: this.state.disjunction, eng: this.state.dis }),
				React.createElement(Segment, { sym: this.state.conditional, eng: this.state.cond }),
				React.createElement(Segment, { sym: this.state.biconditional, eng: this.state.bicond })
			);
		}
	}]);

	return Banner;
}(React.Component);

var TruthTableRow = function (_React$Component3) {
	_inherits(TruthTableRow, _React$Component3);

	function TruthTableRow(props) {
		_classCallCheck(this, TruthTableRow);

		var _this3 = _possibleConstructorReturn(this, (TruthTableRow.__proto__ || Object.getPrototypeOf(TruthTableRow)).call(this, props));

		_this3.addValues = function () {
			var newRow = [];
			for (var i = 0; i < _this3.state.r.length; i++) {
				newRow.push(_this3.state.r[i]);
			}newRow.push(' ');
			_this3.setState({
				row: newRow
			});
		};

		_this3.state = {
			row: [],
			r: props.row
		};
		return _this3;
	}

	_createClass(TruthTableRow, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.addValues();
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "ttRow" },
				this.state.row
			);
		}
	}]);

	return TruthTableRow;
}(React.Component);

var TruthTable = function (_React$Component4) {
	_inherits(TruthTable, _React$Component4);

	function TruthTable(props) {
		_classCallCheck(this, TruthTable);

		var _this4 = _possibleConstructorReturn(this, (TruthTable.__proto__ || Object.getPrototypeOf(TruthTable)).call(this, props));

		_this4.addValues = function () {
			var newTable = [];
			for (var i = 0; i < _this4.state.t.length; i++) {
				var tr = React.createElement(TruthTableRow, { row: _this4.state.t[i], key: i });
				newTable.push(tr);
			}
			_this4.setState({
				table: newTable
			});
		};

		_this4.state = {
			table: [],
			t: props.table,
			exp: props.exp
		};
		return _this4;
	}

	_createClass(TruthTable, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.addValues();
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "tt" },
				this.state.exp,
				React.createElement("hr", null),
				this.state.table
			);
		}
	}]);

	return TruthTable;
}(React.Component);

var TruthTableContainer = function (_React$Component5) {
	_inherits(TruthTableContainer, _React$Component5);

	function TruthTableContainer(props) {
		_classCallCheck(this, TruthTableContainer);

		return _possibleConstructorReturn(this, (TruthTableContainer.__proto__ || Object.getPrototypeOf(TruthTableContainer)).call(this, props));
	}

	_createClass(TruthTableContainer, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "ttContainer" },
				React.createElement(TruthTable, null)
			);
		}
	}]);

	return TruthTableContainer;
}(React.Component);

var TableOutput = function (_React$Component6) {
	_inherits(TableOutput, _React$Component6);

	function TableOutput(props) {
		_classCallCheck(this, TableOutput);

		var _this6 = _possibleConstructorReturn(this, (TableOutput.__proto__ || Object.getPrototypeOf(TableOutput)).call(this, props));

		_this6.state = {
			tables: props.tables,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown
		};
		return _this6;
	}

	_createClass(TableOutput, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			/* run scroll animation after object is created */
			this.state.scrollUp();
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "tableContainer", className: "scrollUpHidden" },
				React.createElement("div", { className: "close", onClick: this.state.scrollDown }),
				this.state.tables
			);
		}
	}]);

	return TableOutput;
}(React.Component);

var Button = function (_React$Component7) {
	_inherits(Button, _React$Component7);

	function Button(props) {
		_classCallCheck(this, Button);

		var _this7 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

		_this7.state = {
			retrieve: props.retInput,
			button: 'calculate'
		};
		return _this7;
	}

	_createClass(Button, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "button", onClick: this.state.retrieve },
				this.state.button
			);
		}
	}]);

	return Button;
}(React.Component);

var Truth = function (_React$Component8) {
	_inherits(Truth, _React$Component8);

	function Truth(props) {
		_classCallCheck(this, Truth);

		var _this8 = _possibleConstructorReturn(this, (Truth.__proto__ || Object.getPrototypeOf(Truth)).call(this, props));

		_this8.state = {
			a: "T",
			b: "F"
		};
		return _this8;
	}

	_createClass(Truth, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				this.state.a,
				React.createElement("hr", null),
				this.state.b
			);
		}
	}]);

	return Truth;
}(React.Component);

var SelectorLink = function (_React$Component9) {
	_inherits(SelectorLink, _React$Component9);

	function SelectorLink(props) {
		_classCallCheck(this, SelectorLink);

		var _this9 = _possibleConstructorReturn(this, (SelectorLink.__proto__ || Object.getPrototypeOf(SelectorLink)).call(this, props));

		_this9.state = {
			link: props.link
		};
		return _this9;
	}

	_createClass(SelectorLink, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "selectorLink" },
				this.state.link
			);
		}
	}]);

	return SelectorLink;
}(React.Component);

var Selector = function (_React$Component10) {
	_inherits(Selector, _React$Component10);

	function Selector(props) {
		_classCallCheck(this, Selector);

		var _this10 = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, props));

		_this10.state = {
			tables: "truth tables",
			validity: "validity check"
		};
		return _this10;
	}

	_createClass(Selector, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "selector" },
				React.createElement(SelectorLink, { link: this.state.tables }),
				React.createElement(SelectorLink, { link: this.state.validity })
			);
		}
	}]);

	return Selector;
}(React.Component);

var ReplContainer = function (_React$Component11) {
	_inherits(ReplContainer, _React$Component11);

	function ReplContainer(props) {
		_classCallCheck(this, ReplContainer);

		return _possibleConstructorReturn(this, (ReplContainer.__proto__ || Object.getPrototypeOf(ReplContainer)).call(this, props));
	}

	_createClass(ReplContainer, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "replContainer" },
				React.createElement(Selector, null),
				React.createElement("textarea", { id: "replInput" })
			);
		}
	}]);

	return ReplContainer;
}(React.Component);

var ReplPage = function (_React$Component12) {
	_inherits(ReplPage, _React$Component12);

	/* This page takes input and sends logical formulae to the server
  * for processing; The page will display the truth tables if the input was
  * accepted by the lexer */
	function ReplPage(props) {
		_classCallCheck(this, ReplPage);

		var _this12 = _possibleConstructorReturn(this, (ReplPage.__proto__ || Object.getPrototypeOf(ReplPage)).call(this, props));

		_this12.retrieveTruthTable = function (formulas, bool) {
			/*  takes in valid formulas and sends them to the server; displays
    * their truth tables upon return */
			var xhr = request('POST', '/ajax');

			xhr.onload = function () {
				var respText = JSON.parse(xhr.responseText);
				console.log('respText');
				console.log(respText);
				/* output the truth values */
				if (bool == true) _this12.showValidity(respText, formulas);else _this12.showTT(respText, formulas);
			};

			/* send ajax request of the formulas */
			xhr.send(formulas);
		};

		_this12.retrieveInput = function (event) {
			var formulas = document.getElementById('replInput').value;

			if (formulas.slice(-1) != "\n") formulas += "\n";

			var fs = formulas.split('\n');

			// strip formulas of unnecessary inputs caused by newlines
			var fs2 = fs.filter(function (val) {
				return val != "";
			});

			for (var f = 0; f < fs2.length; f++) {
				var a = fs2[f] + '\n';

				/* call lexical_analysis() to check grammar */
				var t = lexical_analysis(a);
				if (t) console.log('1');else {
					console.log('0');
					return;
				}
			}
			/* send data to be analyzed on the server */
			console.log('AJAX package:\n');
			// setting bool to true will check validity of the arg
			var bool = true;
			_this12.retrieveTruthTable(formulas, bool);
		};

		_this12.normalize = function (formulas) {
			var forms = [];
			var form = '';
			for (var i = 0; i < formulas.length; i++) {
				if (formulas[i] == '\n') {
					form += formulas[i];
					forms.push(form);
					form = '';
				} else {
					form += formulas[i];
				}
			}
			return forms;
		};

		_this12.showTT = function (respT, formulas) {
			/* Display the individual truth tables */
			formulas = _this12.normalize(formulas);
			console.log(respT);
			var truthArray = [];

			for (var i = 0; i < respT.length; i++) {
				/* Each respT[i] is a truth table */

				var table = React.createElement(
					"div",
					{ className: "tableWrap" },
					React.createElement(TruthTable, { table: respT[i][2], exp: respT[i][1], key: i }),
					React.createElement(TruthTable, { table: respT[i][0], exp: formulas[i], key: i })
				);

				truthArray.push(table);
			}

			var ttOut = React.createElement(TableOutput, { tables: truthArray, scrollUp: _this12.scrollUp, scrollDown: _this12.scrollDown });

			_this12.setState({
				out: ttOut
			}, function () {
				console.log(_this12.state.tables);
			});
		};

		_this12.showValidity = function (respT, formulas) {
			/* test validity */
			formulas = _this12.normalize(formulas);
			var truthArray = [];

			/*
    * respT[0] = truth assignments
    * respT[1] = truth_matrices
    * respT[2] = truth values of each exp (?)
    * */

			var terms = respT[0];
			console.log('terms: ', terms);

			var init_vals = respT[1];
			var init_table = React.createElement(
				"div",
				{ className: "tableWrap" },
				React.createElement(TruthTable, { table: init_vals, exp: terms, key: 0 })
			);

			/* add initial truth assignments */
			truthArray.push(init_table);
			var nextTable = void 0;
			/* add  */
			for (var i = 2; i < respT.length; i++) {
				nextTable = React.createElement(
					"div",
					{ className: "tableWrap" },
					React.createElement(TruthTable, { table: respT[i], exp: formulas[i - 2], key: i })
				);
				truthArray.push(nextTable);
			}

			var ttOut = React.createElement(TableOutput, { tables: truthArray, scrollUp: _this12.scrollUp, scrollDown: _this12.scrollDown });

			_this12.setState({
				out: ttOut
			});
		};

		_this12.retrieve = function () {
			var e = document.getElementById('replInput').value;
		};

		_this12.clearTables = function () {
			_this12.setState({
				tables: []
			});
		};

		_this12.scrollUp = function () {
			var s = document.getElementById('tableContainer');
			s.classList.toggle('scrollUpHidden');
			s.classList.toggle('scrollUp');
		};

		_this12.scrollDown = function () {
			var s = document.getElementById('tableContainer');
			s.classList.toggle('scrollDown');
			setTimeout(function () {
				_this12.setState({ out: undefined });
			}, 1000);
		};

		_this12.state = {
			tables: [],
			out: undefined
		};
		return _this12;
	}

	_createClass(ReplPage, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "replPage" },
				React.createElement(Banner, null),
				React.createElement(
					"div",
					{ id: "pageContainer" },
					React.createElement(ReplContainer, null),
					React.createElement(Button, { retInput: this.retrieveInput })
				),
				this.state.out
			);
		}
	}]);

	return ReplPage;
}(React.Component);

export { ReplPage, ReplContainer, TableOutput, TruthTableContainer, TruthTableRow, TruthTable, Truth, Segment, Banner, Button };