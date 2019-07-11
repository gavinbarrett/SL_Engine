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

var TruthTableRow = function (_React$Component) {
	_inherits(TruthTableRow, _React$Component);

	function TruthTableRow(props) {
		_classCallCheck(this, TruthTableRow);

		var _this = _possibleConstructorReturn(this, (TruthTableRow.__proto__ || Object.getPrototypeOf(TruthTableRow)).call(this, props));

		_this.addValues = function () {
			console.log("calling TTR's addValue function");
			var newRow = [];
			for (var i = 0; i < _this.state.r.length; i++) {
				newRow.push(_this.state.r[i]);
			}newRow.push(' ');
			_this.setState({
				row: newRow
			});
		};

		_this.state = {
			row: [],
			r: props.row
		};
		return _this;
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

var TruthTable = function (_React$Component2) {
	_inherits(TruthTable, _React$Component2);

	function TruthTable(props) {
		_classCallCheck(this, TruthTable);

		var _this2 = _possibleConstructorReturn(this, (TruthTable.__proto__ || Object.getPrototypeOf(TruthTable)).call(this, props));

		_this2.addValues = function () {
			console.log("Calling TT's addValues function");
			var newTable = [];
			for (var i = 0; i < _this2.state.t.length; i++) {
				var tr = React.createElement(TruthTableRow, { row: _this2.state.t[i], key: i });
				newTable.push(tr);
			}
			_this2.setState({
				table: newTable
			});
		};

		_this2.state = {
			table: [],
			t: props.table
		};
		return _this2;
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

var ReplPage = function (_React$Component3) {
	_inherits(ReplPage, _React$Component3);

	function ReplPage(props) {
		_classCallCheck(this, ReplPage);

		var _this3 = _possibleConstructorReturn(this, (ReplPage.__proto__ || Object.getPrototypeOf(ReplPage)).call(this, props));

		_this3.retrieveTruthTable = function (formulas) {
			var xhr = request('POST', '/ajax');
			xhr.onload = function () {
				console.log(xhr.responseText);
				var respText = JSON.parse(xhr.responseText);
				var respT = respText[0];
				_this3.showTT(respText);
			};
			console.log(formulas);
			for (var i = 0; i < formulas.length; i++) {
				xhr.send(formulas);
			}
		};

		_this3.retrieveInput = function (event) {
			var formulas = event.target.value;
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

			if (formulas.slice(-1) == "\n") {
				if (event.keyCode == "13") _this3.retrieveTruthTable(formulas);else if (event.keyCode == "8") console.log("deleted a formula");
			}

			/* tokenize by newline */
			console.log(formulas.split("\n"));

			/* if element in list is not null (""), pass it through the lexer */
			/* we now have the indices of all of the lines, and can report errors */
		};

		_this3.showTT = function (respT) {
			/* Display the truth tables */
			console.log("Displaying");
			console.log(respT);
			var truthArray = [];
			for (var i = 0; i < respT.length; i++) {
				/* Each respT[i] is a truth table */
				var tt = React.createElement(TruthTable, { table: respT[i], key: i });
				truthArray.push(tt);
			}
			_this3.setState({
				tables: truthArray
			}, function () {
				console.log(_this3.state.tables);
			});
		};

		_this3.clearTables = function () {
			_this3.setState({
				tables: []
			});
		};

		_this3.state = {
			tables: []
		};
		return _this3;
	}

	_createClass(ReplPage, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "replPage" },
				React.createElement(
					"div",
					{ id: "pageContainer" },
					React.createElement(ReplContainer, { input: this.retrieveInput }),
					React.createElement(
						"div",
						{ id: "tableContainer" },
						this.state.tables
					)
				)
			);
		}
	}]);

	return ReplPage;
}(React.Component);

function ReplContainer(props) {
	return React.createElement(
		"div",
		{ id: "replContainer" },
		React.createElement("textarea", { id: "replInput", onKeyUp: props.input })
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