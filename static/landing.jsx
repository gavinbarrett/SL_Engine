import { ReplPage } from './repl.js';
import { ReplContainer } from './repl.js';
import { Banner } from './repl.js';

function RenderRepl() {
	ReactDOM.render(<ReplPage />, document.getElementById('root'));
}

function Page(props) {
	return(<div id="message">
		<Heading heading="Organon" sub="propositional logic analyzer"/>
	</div>);
}

function Bottom(props) {
	return(<div id="Bottom">
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

export {
	RenderLanding,
}
