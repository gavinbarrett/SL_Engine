function Page(props) {
	return(<div id="message">
	<input></input>
	</div>);
}

function Bottom(props) {
	return(<div id="bottom">
	</div>);
}

function Main(props) {
	return(<div>
	<Page />,
	<Bottom />,
	</div>);
}

ReactDOM.render(<Main />, document.getElementById('root'));
