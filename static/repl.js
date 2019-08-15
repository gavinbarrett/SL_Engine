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

var ValidOutput = function (_React$Component6) {
	_inherits(ValidOutput, _React$Component6);

	function ValidOutput(props) {
		_classCallCheck(this, ValidOutput);

		var _this6 = _possibleConstructorReturn(this, (ValidOutput.__proto__ || Object.getPrototypeOf(ValidOutput)).call(this, props));

		_this6.state = {
			valid: props.valid,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown
		};
		return _this6;
	}

	_createClass(ValidOutput, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			/* run scroll animation after object is created */
			this.state.scrollUp('validContainer');
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "validContainer", className: "scrollUpHidden" },
				React.createElement("div", { className: "close", onClick: this.state.scrollDown }),
				this.state.valid
			);
		}
	}]);

	return ValidOutput;
}(React.Component);

var TableOutput = function (_React$Component7) {
	_inherits(TableOutput, _React$Component7);

	function TableOutput(props) {
		_classCallCheck(this, TableOutput);

		var _this7 = _possibleConstructorReturn(this, (TableOutput.__proto__ || Object.getPrototypeOf(TableOutput)).call(this, props));

		_this7.state = {
			tables: props.tables,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown
		};
		return _this7;
	}

	_createClass(TableOutput, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			/* run scroll animation after object is created */
			this.state.scrollUp('tableContainer');
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

var Partition = function (_React$Component8) {
	_inherits(Partition, _React$Component8);

	function Partition(props) {
		_classCallCheck(this, Partition);

		return _possibleConstructorReturn(this, (Partition.__proto__ || Object.getPrototypeOf(Partition)).call(this, props));
	}

	_createClass(Partition, [{
		key: "render",
		value: function render() {
			return React.createElement("hr", { className: "partition" });
		}
	}]);

	return Partition;
}(React.Component);

var Button = function (_React$Component9) {
	_inherits(Button, _React$Component9);

	function Button(props) {
		_classCallCheck(this, Button);

		var _this9 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

		_this9.state = {
			retrieve: props.retInput,
			button: 'calculate'
		};
		return _this9;
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

var Truth = function (_React$Component10) {
	_inherits(Truth, _React$Component10);

	function Truth(props) {
		_classCallCheck(this, Truth);

		var _this10 = _possibleConstructorReturn(this, (Truth.__proto__ || Object.getPrototypeOf(Truth)).call(this, props));

		_this10.state = {
			a: "T",
			b: "F"
		};
		return _this10;
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

var SelectorLink = function (_React$Component11) {
	_inherits(SelectorLink, _React$Component11);

	function SelectorLink(props) {
		_classCallCheck(this, SelectorLink);

		var _this11 = _possibleConstructorReturn(this, (SelectorLink.__proto__ || Object.getPrototypeOf(SelectorLink)).call(this, props));

		_this11.state = {
			link: props.link,
			i: props.i,
			l: props.l
		};
		return _this11;
	}

	_createClass(SelectorLink, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: this.state.i, className: "selectorLink", onClick: this.state.l },
				this.state.link
			);
		}
	}]);

	return SelectorLink;
}(React.Component);

var Selector = function (_React$Component12) {
	_inherits(Selector, _React$Component12);

	function Selector(props) {
		_classCallCheck(this, Selector);

		var _this12 = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, props));

		_this12.state = {
			tables: "truth tables",
			validity: "validity check",
			link: props.link
		};
		return _this12;
	}

	_createClass(Selector, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "selector" },
				React.createElement(SelectorLink, { i: "t", link: this.state.tables, l: this.state.link }),
				React.createElement(SelectorLink, { i: "v", link: this.state.validity, l: this.state.link })
			);
		}
	}]);

	return Selector;
}(React.Component);

var ReplContainer = function (_React$Component13) {
	_inherits(ReplContainer, _React$Component13);

	function ReplContainer(props) {
		_classCallCheck(this, ReplContainer);

		var _this13 = _possibleConstructorReturn(this, (ReplContainer.__proto__ || Object.getPrototypeOf(ReplContainer)).call(this, props));

		_this13.state = {
			b: props.b,
			link: props.link
		};
		return _this13;
	}

	_createClass(ReplContainer, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "replContainer" },
				React.createElement(Selector, { link: this.state.link }),
				React.createElement("textarea", { id: "replInput" })
			);
		}
	}]);

	return ReplContainer;
}(React.Component);

var ReplPage = function (_React$Component14) {
	_inherits(ReplPage, _React$Component14);

	/* This page takes input and sends logical formulae to the server
  * for processing; The page will display the truth tables if the input was
  * accepted by the lexer */
	function ReplPage(props) {
		_classCallCheck(this, ReplPage);

		var _this14 = _possibleConstructorReturn(this, (ReplPage.__proto__ || Object.getPrototypeOf(ReplPage)).call(this, props));

		_this14.selectSwitch = function (bool) {
			/* return correct api function based on state */
			//return (bool == true) ? '/table':'/valid';
			if (bool == "t") return "/table";else return "/valid";
		};

		_this14.retrieveTruthTable = function (formulas, bool) {
			/*  takes in valid formulas and sends them to the server; displays
    * their truth tables upon return */

			// select appropriate api function
			var api = _this14.selectSwitch(bool);

			// initialize http request
			var xhr = request('POST', api);

			xhr.onload = function () {
				// parse retrieved JSON
				var respText = JSON.parse(xhr.responseText);
				/* output the truth values */
				bool == "t" ? _this14.showTT(respText, formulas) : _this14.showValidity(respText, formulas);
			};

			/* send ajax request of the formulas */
			xhr.send(formulas);
		};

		_this14.retrieveInput = function (event) {
			var formulas = document.getElementById('replInput').value;

			if (formulas.slice(-1) != "\n") formulas += "\n";

			var fs = formulas.split('\n');

			var newForms = "";

			// strip formulas of unnecessary inputs caused by newlines
			var fs2 = fs.filter(function (val) {
				return val != "";
			});
			console.log('filtered: ', fs2);
			for (var f = 0; f < fs2.length; f++) {
				var a = fs2[f] + '\n';
				newForms += a;
				/* call lexical_analysis() to check grammar */
				var t = lexical_analysis(a);
				if (!t) return;
			}

			/* send data to be analyzed on the server */
			_this14.retrieveTruthTable(newForms, _this14.state.b);
		};

		_this14.normalize = function (formulas) {
			var forms = [];
			var form = '';
			for (var i = 0; i < formulas.length; i++) {
				if (formulas[i] == "\n") {
					form += formulas[i];
					forms.push(form);
					form = '';
				} else {
					form += formulas[i];
				}
			}
			return forms;
		};

		_this14.showTT = function (respT, formulas) {
			/* Display the individual truth tables */
			formulas = _this14.normalize(formulas);
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
			var ttOut = React.createElement(TableOutput, { tables: truthArray, scrollUp: _this14.scrollUp, scrollDown: _this14.scrollDown });

			_this14.setState({
				out: ttOut
			}, function () {
				console.log(_this14.state.tables);
			});
		};

		_this14.showValidity = function (respT, formulas) {
			/* test validity */
			formulas = _this14.normalize(formulas);
			var truthArray = [];
			var terms = respT[0];

			var init_vals = respT[1];
			var init_table = React.createElement(
				"div",
				{ className: "tableWrap" },
				React.createElement(TruthTable, { table: init_vals, exp: terms, key: 0 })
			);

			/* add initial truth assignments */
			truthArray.push(init_table);
			var nextTable = void 0;
			var p = React.createElement(Partition, null);
			truthArray.push(p);

			/* add calculated tables*/
			for (var i = 2; i < respT.length; i++) {
				nextTable = React.createElement(
					"div",
					{ className: "tableWrap" },
					React.createElement(TruthTable, { table: respT[i], exp: formulas[i - 2], key: i })
				);
				truthArray.push(nextTable);
				p = React.createElement(Partition, null);
				truthArray.push(p);
			}

			/* package up all tables */
			var ttOut = React.createElement(ValidOutput, { valid: truthArray, scrollUp: _this14.scrollUp, scrollDown: _this14.scrollDown });

			/* change output state */
			_this14.setState({
				out: ttOut
			});
		};

		_this14.updateLink = function (event) {
			/* update boolean to determine which api function to call 
    * this method is called anytime the selector buttons are clicked */

			// access dom element
			var sel = document.getElementById(event.target.id);
			// save the other selector to contrast selection highlighting
			var unsel = void 0;
			var ttOut = void 0;
			var truthArray = [];

			if (event.target.id == "t") {
				unsel = document.getElementById("v");
			} else if (event.target.id == "v") {
				unsel = document.getElementById("t");
			}
			// change class membership if necessary
			if (event.target.id == _this14.state.b) {
				//pass
			} else {
				unsel.classList.remove("selectorSelected");
				sel.classList.remove("selectorUnselected");
				unsel.classList.add("selectorUnselected");
				sel.classList.add("selectorSelected");
			}

			// update state property
			_this14.setState({
				b: event.target.id,
				tables: []
			});
		};

		_this14.clearTables = function () {
			_this14.setState({
				tables: []
			});
		};

		_this14.scrollUp = function () {
			var s = void 0;
			if (_this14.state.b == "t") s = document.getElementById('tableContainer');else s = document.getElementById('validContainer');
			s.classList.toggle('scrollUpHidden');
			s.classList.toggle('scrollUp');
		};

		_this14.scrollDown = function () {
			var s = void 0;
			if (_this14.state.b == "t") s = document.getElementById("tableContainer");else s = document.getElementById("validContainer");
			s.classList.toggle('scrollDown');
			setTimeout(function () {
				_this14.setState({
					out: undefined,
					tables: []
				});
			}, 1000);
		};

		_this14.state = {
			table: undefined,
			valid: undefined,
			tables: [],
			out: undefined,
			b: "t"
		};
		return _this14;
	}

	_createClass(ReplPage, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var tab = document.getElementById("t");
			tab.classList.add("selectorSelected");
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "replPage" },
				React.createElement(Banner, null),
				React.createElement(
					"div",
					{ id: "pageContainer" },
					React.createElement(ReplContainer, { b: this.state.b, link: this.updateLink }),
					React.createElement(Button, { retInput: this.retrieveInput })
				),
				this.state.out
			);
		}
	}]);

	return ReplPage;
}(React.Component);

export { ReplPage, ReplContainer, TableOutput, TruthTableContainer, TruthTableRow, TruthTable, Truth, Segment, Banner, Button };