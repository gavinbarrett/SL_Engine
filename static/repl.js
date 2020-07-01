function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import lexical_analysis from './parser.js';

var request = function request(url, method) {
  /* Open an http request */
  var xhr = new XMLHttpRequest();
  xhr.open(url, method, true);
  return xhr;
};

var Banner = /*#__PURE__*/function (_React$Component) {
  _inherits(Banner, _React$Component);

  var _super = _createSuper(Banner);

  function Banner(props) {
    var _this;

    _classCallCheck(this, Banner);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "valid", function () {
      var ban_wrap = document.getElementById('BannerWrapper');
      ban_wrap.style.color = "#2a9d8f";

      _this.setState({
        msg: 'Valid!'
      });
    });

    _defineProperty(_assertThisInitialized(_this), "invalid", function () {
      var ban_wrap = document.getElementById('BannerWrapper');
      ban_wrap.style.color = "#e76f51";

      _this.setState({
        msg: 'Invalid!'
      });
    });

    _defineProperty(_assertThisInitialized(_this), "reset", function () {
      var ban_wrap = document.getElementById('BannerWrapper');
      ban_wrap.style.color = "#264653";

      _this.setState({
        msg: 'Please Enter a WFF'
      });
    });

    _this.state = {
      msg: props.msg
    };
    return _this;
  }

  _createClass(Banner, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "BannerWrapper"
      }, this.state.msg);
    }
  }]);

  return Banner;
}(React.Component);

var ReplContainer = /*#__PURE__*/function (_React$Component2) {
  _inherits(ReplContainer, _React$Component2);

  var _super2 = _createSuper(ReplContainer);

  function ReplContainer(props) {
    var _this2;

    _classCallCheck(this, ReplContainer);

    _this2 = _super2.call(this, props);
    _this2.state = {
      input: props.inp
    };
    return _this2;
  }

  _createClass(ReplContainer, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "ReplContainer"
      }, /*#__PURE__*/React.createElement("textarea", {
        id: "ReplInput",
        onChange: this.state.input
      }));
    }
  }]);

  return ReplContainer;
}(React.Component);

var ReplPage = /*#__PURE__*/function (_React$Component3) {
  _inherits(ReplPage, _React$Component3);

  var _super3 = _createSuper(ReplPage);

  /* This page takes input and sends logical formulae to the server
   * for processing; The page will display the Truth Tables if the input was
   * accepted by the lexer */
  function ReplPage(props) {
    var _this3;

    _classCallCheck(this, ReplPage);

    _this3 = _super3.call(this, props);

    _defineProperty(_assertThisInitialized(_this3), "retrieveTruthTable", function (formulas) {
      /*  takes in valid formulas and sends them to the server; displays
       * their Truth Tables upon return */
      // if nothing was input, do not send an AJAX request
      if (!formulas) {
        _this3.banner.current.reset();

        return;
      } //formulas = [formulas];

      /*
      this.awaitValidity(formulas)
      	.then(response => {
      		let respText = JSON.parse(response);
      		// output validity
      		if (respText[0] == true) 
      			this.banner.current.valid();
      		else if (respText[0] == false)
      			this.banner.current.invalid();
      		else
      			this.banner.current.reset();
      	}
      );
      */
      // initialize http request
      // FIXME: change to fetch


      var xhr = request('POST', '/valid');

      xhr.onload = function () {
        // parse retrieved JSON
        var respText = JSON.parse(xhr.responseText); // output validity

        if (respText[0] == true) _this3.banner.current.valid();else if (respText[0] == false) _this3.banner.current.invalid();else _this3.banner.current.reset();
      };

      formulas = [formulas]; //send ajax request of the formulas

      xhr.send(formulas);
    });

    _defineProperty(_assertThisInitialized(_this3), "retrieveInput", function (event) {
      var formulas = document.getElementById('ReplInput').value;
      if (formulas.slice(-1) != "\n") formulas += "\n";
      var fs = formulas.split('\n');
      var newForms = ""; // strip formulas of unnecessary inputs caused by newlines

      var fs2 = fs.filter(function (val) {
        return val != "" && val != " ";
      });

      for (var f = 0; f < fs2.length; f++) {
        var a = fs2[f] + '\n';
        newForms += a;
        /* call lexical_analysis() to check grammar */

        var is_wff = 0;

        try {
          is_wff = lexical_analysis(a);
        } catch (error) {
          is_wff = error;

          _this3.banner.current.reset();

          return;
        }
      }
      /* send data to be analyzed on the server */


      _this3.retrieveTruthTable(newForms);
    });

    _defineProperty(_assertThisInitialized(_this3), "normalize", function (formulas) {
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

    _this3.banner = React.createRef();
    _this3.state = {
      valid: undefined,
      msg: "Please Enter a WFF"
    };
    return _this3;
  }
  /*
  awaitValidity = async formulas => {
  	const response = await fetch('/valid', { method: "POST", body: formulas });
  	return await response.json();
  }
  */


  _createClass(ReplPage, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "ReplPage"
      }, /*#__PURE__*/React.createElement(Banner, {
        msg: this.state.msg,
        ref: this.banner
      }), /*#__PURE__*/React.createElement("div", {
        "class": "tooltip"
      }, "What is a WFF?", /*#__PURE__*/React.createElement("span", {
        "class": "tooltiptext"
      }, "A WFF is composed of the following characters: ~, ^, v, -", ">", ", ", "<", "-", ">", ", (, ) ", /*#__PURE__*/React.createElement("a", {
        id: "l",
        href: "https://en.wikipedia.org/wiki/Well-formed_formula"
      }, "Definition of WFF"))), /*#__PURE__*/React.createElement("div", {
        id: "pageContainer"
      }, /*#__PURE__*/React.createElement(ReplContainer, {
        inp: this.retrieveInput
      })));
    }
  }]);

  return ReplPage;
}(React.Component);

export { ReplPage, ReplContainer, Banner };