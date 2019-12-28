import { ReplPage } from './repl.js';
import { ReplContainer } from './repl.js';
import { TableOutput } from './repl.js';
import { TruthTableContainer } from './repl.js';
import { TruthTableRow } from './repl.js';
import { TruthTable } from './repl.js';
import { Truth } from './repl.js';
import { Segment } from './repl.js';
import { Banner } from './repl.js';

function RenderRepl() {
  ReactDOM.render(React.createElement(ReplPage, null), document.getElementById('root'));
}

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

export { RenderLanding };