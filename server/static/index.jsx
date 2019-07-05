function request(url, method) {
	/* Open an http request */
	let xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr
}

function retrieveTruthTable(formulas) {
	let xhr = request('POST', '/ajax');
	xhr.onload = () => {
		console.log(xhr.responseText);
	};
	console.log(formulas);
	for (let i = 0; i < formulas.length; i++) {
		xhr.send(formulas);	
	}
}

function validateFormula(formula) {
	/* Return true if formula is valid in SL */

}

function retrieveInput(event) {
	let formulas = event.target.value;
	/*FIXME: parse inputs*/
	if ((formulas.slice(-1) == "\n")) {
		if (event.keyCode == "13")
			retrieveTruthTable(formulas);
		else if (event.keyCode == "8")
			console.log("deleted a formula");
	}

	/* tokenize by newline */
	console.log(formulas.split("\n"));

	/* if element in list is not null (""), pass it through the lexer */
	/* we now have the indices of all of the lines, and can report errors */

}

function ReplPage(props) {
	return(<div id="replPage">
		<ReplContainer />
	</div>);
}

function ReplContainer(props) {
	return(<div id="replContainer">
		<textarea id="replInput" onKeyUp={retrieveInput}></textarea>
	</div>);
}

function RenderRepl() {
	ReactDOM.render(<ReplPage />, document.getElementById('root'));
}

function Page(props) {
	return(<div id="message">
		<Heading heading="Organon" />
	</div>);
}

function Bottom(props) {
	return(<div id="bottom">
		<InputRedirect click="click here to enter the repl" />
	</div>);
}

function Heading(props) {
	return(<div id="heading">
		{props.heading}
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

ReactDOM.render(<RenderLanding />, document.getElementById('root'));
