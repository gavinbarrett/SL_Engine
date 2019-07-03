function Page(props) {
	return(<div>
		{props.yo}
	</div>);
}

ReactDOM.render(<Page yo="yo"/>, document.getElementById('root'));
