function request(url, method) {
	/* Open an http request */
	var xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr;
}

function retrieveTruthTable(formulas) {
	var xhr = request('POST', '/ajax');
	xhr.onload = function () {
		console.log(xhr.responseText);
	};
	console.log(formulas);
	for (var i = 0; i < formulas.length; i++) {
		xhr.send(formulas);
	}
}

function validateFormula(formula) {
	/* Return true if formula is valid in SL */

}

function retrieveInput(event) {
	var formulas = event.target.value;
	/*FIXME: parse inputs*/
	if (formulas.slice(-1) == "\n") {
		if (event.keyCode == "13") retrieveTruthTable(formulas);else if (event.keyCode == "8") console.log("deleted a formula");
	}

	/* tokenize by newline */
	console.log(formulas.split("\n"));

	/* if element in list is not null (""), pass it through the lexer */
	/* we now have the indices of all of the lines, and can report errors */
}

function ReplPage(props) {
	return React.createElement(
		'div',
		{ id: 'replPage' },
		React.createElement(ReplContainer, null)
	);
}

function ReplContainer(props) {
	return React.createElement(
		'div',
		{ id: 'replContainer' },
		React.createElement('textarea', { id: 'replInput', onKeyUp: retrieveInput })
	);
}

function RenderRepl() {
	ReactDOM.render(React.createElement(ReplPage, null), document.getElementById('root'));
}

function Page(props) {
	return React.createElement(
		'div',
		{ id: 'message' },
		React.createElement(Heading, { heading: 'Organon' })
	);
}

function Bottom(props) {
	return React.createElement(
		'div',
		{ id: 'bottom' },
		React.createElement(InputRedirect, { click: 'click here to enter the repl' })
	);
}

function Heading(props) {
	return React.createElement(
		'div',
		{ id: 'heading' },
		props.heading
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