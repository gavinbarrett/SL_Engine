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
		{ id: "inputWrapper" },
		props.click
	);
}

function Main(props) {
	return React.createElement(
		"div",
		{ id: "initialFBox" },
		React.createElement(Page, null),
		React.createElement(Bottom, null)
	);
}

ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));