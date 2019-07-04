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
	return(<div id="inputWrapper">
		{props.click}
	</div>);
}

function Main(props) {
	return(<div id="initialFBox">
	<Page />
	<Bottom />
	</div>);
}

ReactDOM.render(<Main />, document.getElementById('root'));
