'use strict';

var _repl = require('./repl.js');

function RenderRepl() {
	ReactDOM.render(React.createElement(_repl.ReplPage, null), document.getElementById('root'));
}

function Page(props) {
	return React.createElement(
		'div',
		{ id: 'message' },
		React.createElement(Heading, { heading: 'Organon', sub: 'propositional logic analyzer' })
	);
}

function Bottom(props) {
	return React.createElement(
		'div',
		{ id: 'bottom' },
		React.createElement(InputRedirect, { click: 'check my logic' })
	);
}

function Heading(props) {
	return React.createElement(
		'div',
		{ id: 'heading' },
		props.heading,
		React.createElement(
			'div',
			{ id: 'subHead' },
			props.sub
		)
	);
}

function InputRedirect(props) {
	return React.createElement(
		'div',
		{ id: 'inputWrapper', onClick: RenderRepl },
		props.click
	);
}

function RenderLanding(props) {
	return React.createElement(
		'div',
		{ id: 'initialFBox' },
		React.createElement(Page, null),
		React.createElement(Bottom, null)
	);
}

ReactDOM.render(React.createElement(RenderLanding, null), document.getElementById('root'));