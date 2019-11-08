"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* The main project files for Organon are being temporarily consolidated in this file due to issue that occur when transpiling ES6 -> ES5; the first major block of code contains the front-end parser; the second block contains the definition*/

/* Begin Parser Definitions*/
var Parser =
/*#__PURE__*/
function () {
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
    key: "lex",
    value: function lex() {
      /* try to parse the input */
      this.scan();
      if (this.next === '\n') return false;
      this.expression();
      return this.next === '\n';
    }
  }, {
    key: "expression",
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
    key: "open_parenthesis",
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
    key: "closed_parenthesis",
    value: function closed_parenthesis() {
      /* handle closing parenthesis */
      if (this.feed === '' && this.open === this.closed) console.log("Terminating in parenthesis");else {
        this.scan();

        if (this.next === ')') {
          this.closed += 1;
          this.closed_parenthesis();
        } else if (this.binary_ops.includes(this.next)) this.binary();else {
          console.log("this.next: ");
          console.log(this.next.charCodeAt(0));
          throw "Error: malformed formula following closing parenthesis\n";
        }
      }
    }
  }, {
    key: "atomic",
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
    key: "unary",
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
    key: "binary",
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
    key: "biconditional",
    value: function biconditional() {
      this.scan();
      if (this.next === '-') this.conditional();else throw "Error: malformed biconditional operator\n";
    }
  }, {
    key: "conditional",
    value: function conditional() {
      this.scan();
      if (this.next === '>') this.binary();else throw "Error: malformed conditional operator\n";
    }
  }, {
    key: "read",
    value: function read() {
      if (this.feed.length === 0) return null;
      var character = this.feed.slice(0, 1);
      this.feed = this.feed.slice(1);
      return character;
    }
  }, {
    key: "scan",
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

function lexical_analysis(string) {
  if (!string) return;
  var expArray = string.split("\n");
  console.log(expArray);
  expArray.forEach(function (s) {
    var p = new Parser(s);
    console.log(s);

    try {
      p.expression();
      console.log('Analysis successful.\n');
    } catch (error) {
      console.log('Analysis failed.\n');
      return 0;
    }
  });
  return 1;
}
/* End Parser definitions */

/* Begin ReplPage definitions */


function request(url, method) {
  /* Open an http request */
  var xhr = new XMLHttpRequest();
  xhr.open(url, method, true);
  return xhr;
}

var Segment =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Segment, _React$Component);

  function Segment(props) {
    var _this;

    _classCallCheck(this, Segment);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Segment).call(this, props));
    _this.state = {
      symbol: props.sym,
      english: props.eng
    };
    return _this;
  }

  _createClass(Segment, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "Segment"
      }, React.createElement("div", {
        className: "sym"
      }, this.state.symbol), React.createElement("div", {
        className: "eng"
      }, this.state.english));
    }
  }]);

  return Segment;
}(React.Component);

var Banner =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Banner, _React$Component2);

  function Banner(props) {
    var _this2;

    _classCallCheck(this, Banner);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Banner).call(this, props));
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
      return React.createElement("div", {
        id: "BannerWrapper"
      }, React.createElement(Segment, {
        sym: this.state.negation,
        eng: this.state.neg
      }), React.createElement(Segment, {
        sym: this.state.conjunction,
        eng: this.state.con
      }), React.createElement(Segment, {
        sym: this.state.disjunction,
        eng: this.state.dis
      }), React.createElement(Segment, {
        sym: this.state.conditional,
        eng: this.state.cond
      }), React.createElement(Segment, {
        sym: this.state.biconditional,
        eng: this.state.bicond
      }));
    }
  }]);

  return Banner;
}(React.Component);

var TruthTableRow =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(TruthTableRow, _React$Component3);

  function TruthTableRow(props) {
    var _this3;

    _classCallCheck(this, TruthTableRow);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(TruthTableRow).call(this, props));

    _defineProperty(_assertThisInitialized(_this3), "addValues", function () {
      var newRow = [];

      for (var i = 0; i < _this3.state.r.length; i++) {
        newRow.push(_this3.state.r[i]);
      }

      newRow.push(' ');

      _this3.setState({
        row: newRow
      });
    });

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
      return React.createElement("div", {
        className: "ttRow"
      }, this.state.row);
    }
  }]);

  return TruthTableRow;
}(React.Component);

var TruthTable =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(TruthTable, _React$Component4);

  function TruthTable(props) {
    var _this4;

    _classCallCheck(this, TruthTable);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(TruthTable).call(this, props));

    _defineProperty(_assertThisInitialized(_this4), "addValues", function () {
      var newTable = [];

      for (var i = 0; i < _this4.state.t.length; i++) {
        var tr = React.createElement(TruthTableRow, {
          row: _this4.state.t[i],
          key: i
        });
        newTable.push(tr);
      } // rerender the page with the Truth Table


      _this4.setState({
        Table: newTable
      });
    });

    _this4.state = {
      Table: [],
      t: props.Table,
      exp: props.exp
    };
    _this4.addValues = _this4.addValues.bind(_assertThisInitialized(_this4));
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
      return React.createElement("div", {
        className: "tt"
      }, this.state.exp, React.createElement("hr", null), this.state.Table);
    }
  }]);

  return TruthTable;
}(React.Component);

var TruthTableContainer =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(TruthTableContainer, _React$Component5);

  function TruthTableContainer(props) {
    _classCallCheck(this, TruthTableContainer);

    return _possibleConstructorReturn(this, _getPrototypeOf(TruthTableContainer).call(this, props));
  }

  _createClass(TruthTableContainer, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "ttContainer"
      }, React.createElement(TruthTable, null));
    }
  }]);

  return TruthTableContainer;
}(React.Component);

var Valid =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(Valid, _React$Component6);

  function Valid(props) {
    var _this5;

    _classCallCheck(this, Valid);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Valid).call(this, props));
    _this5.state = {
      Valid: props.Valid
    };
    return _this5;
  }

  _createClass(Valid, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "Valid"
      }, this.state.Valid);
    }
  }]);

  return Valid;
}(React.Component);

var Invalid =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(Invalid, _React$Component7);

  function Invalid(props) {
    var _this6;

    _classCallCheck(this, Invalid);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Invalid).call(this, props));
    _this6.state = {
      notValid: props.Invalid
    };
    return _this6;
  }

  _createClass(Invalid, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "Invalid"
      }, this.state.notValid);
    }
  }]);

  return Invalid;
}(React.Component);

var ValidOutput =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(ValidOutput, _React$Component8);

  function ValidOutput(props) {
    var _this7;

    _classCallCheck(this, ValidOutput);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(ValidOutput).call(this, props));
    _this7.state = {
      Valid: props.Valid,
      Validity: props.Validity,
      scrollUp: props.scrollUp,
      scrollDown: props.scrollDown
    };
    return _this7;
  }

  _createClass(ValidOutput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      /* run scroll animation after object is created */
      this.state.scrollUp('ValidContainer');
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "ValidContainer",
        className: "scrollUpHidden"
      }, React.createElement("div", {
        className: "close",
        onClick: this.state.scrollDown
      }), React.createElement("div", {
        id: "outputWrapper"
      }, React.createElement("div", {
        id: "outputHeader"
      }, this.state.Validity), React.createElement("div", {
        id: "outputTables"
      }, this.state.Valid)));
    }
  }]);

  return ValidOutput;
}(React.Component);

var TableOutput =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(TableOutput, _React$Component9);

  function TableOutput(props) {
    var _this8;

    _classCallCheck(this, TableOutput);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(TableOutput).call(this, props));
    _this8.state = {
      Tables: props.Tables,
      scrollUp: props.scrollUp,
      scrollDown: props.scrollDown
    };
    return _this8;
  }

  _createClass(TableOutput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      /* run scroll animation after object is created */
      this.state.scrollUp('TableContainer');
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "TableContainer",
        className: "scrollUpHidden"
      }, React.createElement("div", {
        className: "close",
        onClick: this.state.scrollDown
      }), this.state.Tables);
    }
  }]);

  return TableOutput;
}(React.Component);

var Partition =
/*#__PURE__*/
function (_React$Component10) {
  _inherits(Partition, _React$Component10);

  function Partition(props) {
    _classCallCheck(this, Partition);

    return _possibleConstructorReturn(this, _getPrototypeOf(Partition).call(this, props));
  }

  _createClass(Partition, [{
    key: "render",
    value: function render() {
      return React.createElement("hr", {
        className: "Partition"
      });
    }
  }]);

  return Partition;
}(React.Component);

var Button =
/*#__PURE__*/
function (_React$Component11) {
  _inherits(Button, _React$Component11);

  function Button(props) {
    var _this9;

    _classCallCheck(this, Button);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, props));
    _this9.state = {
      retrieve: props.retInput,
      Button: 'calculate'
    };
    return _this9;
  }

  _createClass(Button, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "Button",
        onClick: this.state.retrieve
      }, this.state.Button);
    }
  }]);

  return Button;
}(React.Component);

var Truth =
/*#__PURE__*/
function (_React$Component12) {
  _inherits(Truth, _React$Component12);

  function Truth(props) {
    var _this10;

    _classCallCheck(this, Truth);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(Truth).call(this, props));
    _this10.state = {
      a: "T",
      b: "F"
    };
    return _this10;
  }

  _createClass(Truth, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, this.state.a, React.createElement("hr", null), this.state.b);
    }
  }]);

  return Truth;
}(React.Component);

var SelectorLink =
/*#__PURE__*/
function (_React$Component13) {
  _inherits(SelectorLink, _React$Component13);

  function SelectorLink(props) {
    var _this11;

    _classCallCheck(this, SelectorLink);

    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(SelectorLink).call(this, props));
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
      return React.createElement("div", {
        id: this.state.i,
        className: "SelectorLink",
        onClick: this.state.l
      }, this.state.link);
    }
  }]);

  return SelectorLink;
}(React.Component);

var Selector =
/*#__PURE__*/
function (_React$Component14) {
  _inherits(Selector, _React$Component14);

  function Selector(props) {
    var _this12;

    _classCallCheck(this, Selector);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(Selector).call(this, props));
    _this12.state = {
      Tables: "Truth Tables",
      Validity: "Validity check",
      link: props.link
    };
    return _this12;
  }

  _createClass(Selector, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "Selector"
      }, React.createElement(SelectorLink, {
        i: "t",
        link: this.state.Tables,
        l: this.state.link
      }), React.createElement(SelectorLink, {
        i: "v",
        link: this.state.Validity,
        l: this.state.link
      }));
    }
  }]);

  return Selector;
}(React.Component);

var ReplContainer =
/*#__PURE__*/
function (_React$Component15) {
  _inherits(ReplContainer, _React$Component15);

  function ReplContainer(props) {
    var _this13;

    _classCallCheck(this, ReplContainer);

    _this13 = _possibleConstructorReturn(this, _getPrototypeOf(ReplContainer).call(this, props));
    _this13.state = {
      b: props.b,
      link: props.link
    };
    return _this13;
  }

  _createClass(ReplContainer, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "ReplContainer"
      }, React.createElement(Selector, {
        link: this.state.link
      }), React.createElement("textarea", {
        id: "ReplInput"
      }));
    }
  }]);

  return ReplContainer;
}(React.Component);

var ReplPage =
/*#__PURE__*/
function (_React$Component16) {
  _inherits(ReplPage, _React$Component16);

  /* This page takes input and sends logical formulae to the server
   * for processing; The page will display the Truth Tables if the input was
   * accepted by the lexer */
  function ReplPage(props) {
    var _this14;

    _classCallCheck(this, ReplPage);

    _this14 = _possibleConstructorReturn(this, _getPrototypeOf(ReplPage).call(this, props));

    _defineProperty(_assertThisInitialized(_this14), "selectSwitch", function (bool) {
      /* return correct api function based on state */
      //return (bool == true) ? '/Table':'/Valid';
      if (bool == "t") return "/table";else return "/valid";
    });

    _defineProperty(_assertThisInitialized(_this14), "retrieveTruthTable", function (formulas, bool) {
      /*  takes in Valid formulas and sends them to the server; displays
       * their Truth Tables upon return */
      // if nothing was input, do not send an AJAX request
      if (!formulas) return; // select appropriate api function
      //let api = this.selectSwitch(bool);
      // initialize http request

      var xhr = request('POST', '/valid');

      xhr.onload = function () {
        // parse retrieved JSON
        var respText = JSON.parse(xhr.responseText);
        /* output the Truth values */

        console.log(respText);
        console.log("bool: ", bool);
        if (bool == "t") _this14.showTT(respText, formulas);else _this14.showValidity(respText, formulas); //(bool == "t") ? () => {this.showTT(respText, formulas)} : () => {this.showValidity(respText, formulas) };
      };

      formulas = [formulas] + [bool];
      /* send ajax request of the formulas */

      xhr.send(formulas);
    });

    _defineProperty(_assertThisInitialized(_this14), "retrieveInput", function (event) {
      var formulas = document.getElementById('ReplInput').value;
      console.log("formulas: \n", formulas);
      if (formulas.slice(-1) != "\n") formulas += "\n";
      var fs = formulas.split('\n');
      var newForms = ""; // strip formulas of unnecessary inputs caused by newlines

      var fs2 = fs.filter(function (val) {
        return val != "";
      });

      for (var f = 0; f < fs2.length; f++) {
        var a = fs2[f] + '\n';
        newForms += a;
        /* call lexical_analysis() to check grammar */

        var t = lexical_analysis(a);
        if (!t) return;
      }
      /* send data to be analyzed on the server */


      _this14.retrieveTruthTable(newForms, _this14.state.b);
    });

    _defineProperty(_assertThisInitialized(_this14), "normalize", function (formulas) {
      /* normalize expressions by newline */
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
    });

    _defineProperty(_assertThisInitialized(_this14), "showTT", function (respT, formulas) {
      /* Display the individual Truth Tables */
      formulas = _this14.normalize(formulas);
      var TruthArray = [];

      for (var i = 0; i < respT.length; i++) {
        /* Each respT[i] is a Truth Table */
        var Table = React.createElement("div", {
          className: "TableWrap"
        }, React.createElement(TruthTable, {
          Table: respT[i][2],
          exp: respT[i][1],
          key: i
        }), React.createElement(TruthTable, {
          Table: respT[i][0],
          exp: formulas[i],
          key: i
        }));
        TruthArray.push(Table);
      }

      var ttOut = React.createElement(TableOutput, {
        Tables: TruthArray,
        scrollUp: _this14.scrollUp,
        scrollDown: _this14.scrollDown
      });

      _this14.setState({
        out: ttOut
      }, function () {
        console.log(_this14.state.Tables);
      });
    });

    _defineProperty(_assertThisInitialized(_this14), "showValidity", function (respT, formulas) {
      console.log("We are valid");
      /* test Validity */

      formulas = _this14.normalize(formulas);
      var TruthArray = [];
      var terms = respT[0];
      var Validity = respT.pop(); // save the correct message

      var message = Validity ? React.createElement(Valid, {
        Valid: "Valid!"
      }) : React.createElement(Invalid, {
        Invalid: "Invalid!"
      });
      var init_vals = respT[1];
      var init_Table = React.createElement("div", {
        className: "TableWrap"
      }, React.createElement(TruthTable, {
        Table: init_vals,
        exp: terms,
        key: 0
      }));
      /* add initial Truth assignments */

      TruthArray.push(init_Table);
      var nextTable;
      var p = React.createElement(Partition, null);
      TruthArray.push(p);
      /* add calculated Tables*/

      for (var i = 2; i < respT.length; i++) {
        nextTable = React.createElement("div", {
          className: "TableWrap"
        }, React.createElement(TruthTable, {
          Table: respT[i],
          exp: formulas[i - 2],
          key: i
        }));
        TruthArray.push(nextTable);
        p = React.createElement(Partition, null);
        TruthArray.push(p);
      }
      /* package up all Tables */


      var ttOut = React.createElement(ValidOutput, {
        Valid: TruthArray,
        Validity: message,
        scrollUp: _this14.scrollUp,
        scrollDown: _this14.scrollDown
      });
      /* change output state */

      _this14.setState({
        out: ttOut
      });
    });

    _defineProperty(_assertThisInitialized(_this14), "updateLink", function (event) {
      /* update boolean to determine which api function to call 
       * this method is called anytime the Selector Buttons are clicked */
      // access dom element
      var sel = document.getElementById(event.target.id); // save the other Selector to contrast selection highlighting

      var unsel;
      var ttOut;
      var TruthArray = [];

      if (event.target.id == "t") {
        unsel = document.getElementById("v");
      } else if (event.target.id == "v") {
        unsel = document.getElementById("t");
      } // change class membership if necessary


      if (event.target.id == _this14.state.b) {//pass
      } else {
        unsel.classList.remove("SelectorSelected");
        sel.classList.remove("SelectorUnselected");
        unsel.classList.add("SelectorUnselected");
        sel.classList.add("SelectorSelected");
      } // update state property


      _this14.setState({
        b: event.target.id,
        Tables: []
      });
    });

    _defineProperty(_assertThisInitialized(_this14), "clearTables", function () {
      _this14.setState({
        Tables: []
      });
    });

    _defineProperty(_assertThisInitialized(_this14), "scrollUp", function () {
      /* move the output container into the user interface */
      var s;
      if (_this14.state.b == "t") s = document.getElementById('TableContainer');else s = document.getElementById('ValidContainer');
      s.classList.toggle('scrollUpHidden');
      s.classList.toggle('scrollUp');
    });

    _defineProperty(_assertThisInitialized(_this14), "scrollDown", function () {
      /* move the output container out of the user interface */
      var s;
      if (_this14.state.b == "t") s = document.getElementById("TableContainer");else s = document.getElementById("ValidContainer");
      s.classList.toggle('scrollDown');
      setTimeout(function () {
        _this14.setState({
          out: undefined,
          Tables: []
        });
      }, 1000);
    });

    _this14.state = {
      Table: [],
      Valid: undefined,
      Tables: [],
      out: [],
      b: "t"
    };
    _this14.showTT = _this14.showTT.bind(_assertThisInitialized(_this14));
    _this14.showValidity = _this14.showValidity.bind(_assertThisInitialized(_this14));
    return _this14;
  }

  _createClass(ReplPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var tab = document.getElementById("t");
      tab.classList.add("SelectorSelected");
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        id: "ReplPage"
      }, React.createElement(Banner, null), React.createElement("div", {
        id: "pageContainer"
      }, React.createElement(ReplContainer, {
        b: this.state.b,
        link: this.updateLink
      }), React.createElement(Button, {
        retInput: this.retrieveInput
      })), this.state.out);
    }
  }]);

  return ReplPage;
}(React.Component);

function RenderRepl() {
  ReactDOM.render(React.createElement(ReplPage, null), document.getElementById('root'));
}
/* End ReplPage Definitions */

/* Begin Landing Page Definitions */


function Page(props) {
  return React.createElement("div", {
    id: "message"
  }, React.createElement(Heading, {
    heading: "Organon",
    sub: "propositional logic analyzer"
  }));
}

function Bottom(props) {
  return React.createElement("div", {
    id: "Bottom"
  }, React.createElement(InputRedirect, {
    click: "check my logic"
  }));
}

function Heading(props) {
  return React.createElement("div", {
    id: "heading"
  }, props.heading, React.createElement("div", {
    id: "subHead"
  }, props.sub));
}

function InputRedirect(props) {
  return React.createElement("div", {
    id: "inputWrapper",
    onClick: RenderRepl
  }, props.click);
}

function RenderLanding(props) {
  return React.createElement("div", {
    id: "initialFBox"
  }, React.createElement(Page, null), React.createElement(Bottom, null));
}

ReactDOM.render(React.createElement(RenderLanding, null), document.getElementById('root'));
/* End Landing Page Definitions */

