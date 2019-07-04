function Page(props) {
	return React.createElement(
		"div",
		{ id: "message" },
		React.createElement("input", null)
	);
}

function Bottom(props) {
	return React.createElement("div", { id: "bottom" });
}

function Main(props) {
	return React.createElement(
		"div",
		null,
		React.createElement(Page, null),
		",",
		React.createElement(Bottom, null),
		","
	);
}

ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));