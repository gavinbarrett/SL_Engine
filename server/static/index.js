function retrieveInput(event) {
	var formulas = event.target.value;
	if (formulas.slice(-1) == "\n") {
		if (event.keyCode == "13") console.log("entered a formula");else if (event.keyCode == "8") console.log("deleted a formula");
	}
	console.log(formulas.split("\n"));
}

function ReplPage(props) {
	return React.createElement(
		"div",
		{ id: "replPage" },
		React.createElement(ReplContainer, null)
	);
}

function ReplContainer(props) {
	return React.createElement(
		"div",
		{ id: "replContainer" },
		React.createElement("textarea", { id: "replInput", onKeyUp: retrieveInput })
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