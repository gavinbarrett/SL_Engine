function Page(props) {
	return React.createElement(
		"div",
		null,
		props.yo
	);
}

ReactDOM.render(React.createElement(Page, { yo: "yo" }), document.getElementById('root'));