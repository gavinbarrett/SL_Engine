var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function request(url, method) {
	/* Open an http request */
	var xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr;
}

function validateFormula(formula) {
	/* Return true if formula is valid in SL */

}

function isValid(formula) {
	/* Returns true if formula is accepted in SL */

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
			console.log("calling TTR's addValue function");
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
			console.log("Calling TT's addValues function");
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
			t: props.table
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
				this.state.table
			);
		}
	}]);

	return TruthTable;
}(React.Component);

var TableOutput = function (_React$Component5) {
	_inherits(TableOutput, _React$Component5);

	function TableOutput(props) {
		_classCallCheck(this, TableOutput);

		var _this5 = _possibleConstructorReturn(this, (TableOutput.__proto__ || Object.getPrototypeOf(TableOutput)).call(this, props));

		_this5.state = {
			tables: props.tables,
			scroll: props.scroll
		};
		console.log(props.tables);
		return _this5;
	}

	_createClass(TableOutput, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			{
				this.state.scroll;
			}
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "tableContainer", className: "scrollUpHidden" },
				this.state.tables
			);
		}
	}]);

	return TableOutput;
}(React.Component);

var Button = function (_React$Component6) {
	_inherits(Button, _React$Component6);

	function Button(props) {
		_classCallCheck(this, Button);

		var _this6 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

		_this6.state = {
			retrieve: props.retInput,
			button: 'check'
		};
		return _this6;
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

var ReplPage = function (_React$Component7) {
	_inherits(ReplPage, _React$Component7);

	function ReplPage(props) {
		_classCallCheck(this, ReplPage);

		var _this7 = _possibleConstructorReturn(this, (ReplPage.__proto__ || Object.getPrototypeOf(ReplPage)).call(this, props));

		_this7.retrieveTruthTable = function (formulas) {
			var xhr = request('POST', '/ajax');
			xhr.onload = function () {
				console.log(xhr.responseText);
				var respText = JSON.parse(xhr.responseText);
				var respT = respText[0];
				_this7.showTT(respText);
			};
			console.log(formulas);
			for (var i = 0; i < formulas.length; i++) {
				xhr.send(formulas);
			}
		};

		_this7.retrieveInput = function (event) {
			var formulas = document.getElementById('replInput').value;
			//let formulas = event.target.value;
			/*FIXME: parse inputs*/

			for (var f = 0; f < formulas.length; f++) {
				if (formulas[f].slice(-1) == "\n") {
					console.log(formulas[f]);
					if (isValid(formulas[f])) {
						console.log("Formula is acceptable");
						console.log(formulas[f]);
					}
				}
			}
			if (formulas.slice(-1) != "\n") {
				console.log("adding newline");
				formulas += "\n";
			}
			_this7.retrieveTruthTable(formulas);
			/*
         	if ((formulas.slice(-1) == "\n")) {
                 	if (event.keyCode == "13")
                         	this.retrieveTruthTable(formulas);
                 	else if (event.keyCode == "8")
                         	console.log("deleted a formula");
         	}
   */
			/* tokenize by newline */
			console.log(formulas.split("\n"));

			/* if element in list is not null (""), pass it through the lexer */
			/* we now have the indices of all of the lines, and can report errors */
		};

		_this7.showTT = function (respT) {
			/* Display the truth tables */
			console.log("Displaying");
			console.log(respT);
			var truthArray = [];
			for (var i = 0; i < respT.length; i++) {
				/* Each respT[i] is a truth table */
				var tt = React.createElement(TruthTable, { table: respT[i], key: i });
				truthArray.push(tt);
			}

			var ttOut = React.createElement(TableOutput, { tables: truthArray, scroll: _this7.scrollUp });

			_this7.setState({
				out: ttOut
			}, function () {
				console.log(_this7.state.tables);
			});
		};

		_this7.retrieve = function () {
			var e = document.getElementById('replInput').value;
			console.log(e);
		};

		_this7.clearTables = function () {
			_this7.setState({
				tables: []
			});
		};

		_this7.scrollUp = function () {
			var s = document.getElementById('tableContainer');
			s.classList.toggle('scrollUp');
			s.classList.toggle('scrollUpHidden');
		};

		_this7.state = {
			tables: [],
			out: undefined
		};
		return _this7;
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

function ReplContainer(props) {
	return React.createElement(
		"div",
		{ id: "replContainer" },
		React.createElement("textarea", { id: "replInput" })
	);
}

function TruthTableContainer(props) {
	return React.createElement(
		"div",
		{ id: "ttContainer" },
		React.createElement(TruthTable, null)
	);
}

function RenderRepl() {
	ReactDOM.render(React.createElement(ReplPage, null), document.getElementById('root'));
}

function Page(props) {
	return React.createElement(
		"div",
		{ id: "message" },
		React.createElement(Heading, { heading: "Organon" })
	);
}

function Bottom(props) {
	return React.createElement(
		"div",
		{ id: "bottom" },
		React.createElement(InputRedirect, { click: "click here to enter the repl" })
	);
}

function Heading(props) {
	return React.createElement(
		"div",
		{ id: "heading" },
		props.heading
	);
}

function InputRedirect(props) {
	return React.createElement(
		"div",
		{ id: "inputWrapper", onClick: RenderRepl },
		props.click
	);
}

function RenderLanding(props) {
	return React.createElement(
		"div",
		{ id: "initialFBox" },
		React.createElement(Page, null),
		React.createElement(Bottom, null)
	);
}

ReactDOM.render(React.createElement(RenderLanding, null), document.getElementById('root'));