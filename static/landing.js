import { ReplPage } from './repl.js';
import { ReplContainer } from './repl.js';
import { Banner } from './repl.js';

function RenderRepl() {
  ReactDOM.render( /*#__PURE__*/React.createElement(ReplPage, null), document.getElementById('root'));
}

function Page(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "message"
  }, /*#__PURE__*/React.createElement(Heading, {
    heading: "Organon",
    sub: "propositional logic analyzer"
  }));
}

function Bottom(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "Bottom"
  }, /*#__PURE__*/React.createElement(InputRedirect, {
    click: "check my logic"
  }));
}

function Heading(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "heading"
  }, props.heading, /*#__PURE__*/React.createElement("div", {
    id: "subHead"
  }, props.sub));
}

function InputRedirect(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "inputWrapper",
    onClick: RenderRepl
  }, props.click);
}

function RenderLanding(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "initialFBox"
  }, /*#__PURE__*/React.createElement(Page, null), /*#__PURE__*/React.createElement(Bottom, null));
}

export { RenderLanding };