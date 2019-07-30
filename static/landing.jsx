import {ReplPage} from './repl.js';
import {ReplContainer} from './repl.js';
import {TableOutput} from './repl.js';
import {TruthTable} from './repl.js';
import {TruthTableContainer} from './repl.js';
import {TruthTableRow} from './repl.js';
import {Truth} from './repl.js';
import {Segment} from './repl.js';
import {Banner} from './repl.js';
import {Button} from './repl.js';

function RenderRepl() {
	ReactDOM.render(<ReplPage />, document.getElementById('root'));
}

function Page(props) {
	return(<div id="message">
		<Heading heading="Organon" sub="propositional logic analyzer"/>
	</div>);
}

function Bottom(props) {
	return(<div id="bottom">
		<InputRedirect click="check my logic" />
	</div>);
}

function Heading(props) {
	return(<div id="heading">
		{props.heading}
		<div id="subHead">
		{props.sub}
		</div>
		</div>);
}

function InputRedirect(props) {
	return(<div id="inputWrapper" onClick={RenderRepl}>
		{props.click}
	</div>);
}

function RenderLanding(props) {
	return(<div id="initialFBox">
	<Page />
	<Bottom />
	</div>);
}

ReactDOM.render(<RenderLanding/>, document.getElementById('root'));
