function request(url, method) {
	/* Open an http request */
	let xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr
}

function validateFormula(formula) {
	/* Return true if formula is valid in SL */

}

function isValid(formula) {
	/* Returns true if formula is accepted in SL */

}

class TruthTableRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			row: [],
			r: props.row,
		};
	}

	componentDidMount() {
		this.addValues();
	}	

	addValues = () => {
		console.log("calling TTR's addValue function");
		let newRow = [];
		for (let i = 0; i < this.state.r.length; i++)
			newRow.push(this.state.r[i]);
			newRow.push(' ');
		this.setState({
			row: newRow,
		});
	}

	render() {
		return(<div className="ttRow">
			{this.state.row}
		</div>);	
	}

}

class TruthTable extends React.Component {
	constructor(props) {
		super(props);
		this.state =  {
			table: [],
			t: props.table,
		};
	}

	componentDidMount() {
		this.addValues();
	}

	addValues = () => {
		console.log("Calling TT's addValues function");
		let newTable = [];
		for (let i = 0; i < this.state.t.length; i++) {
			let tr = <TruthTableRow row={this.state.t[i]} key={i}/>
			newTable.push(tr);
		}
		this.setState({
			table: newTable,
		});
	}

	render() {
		return(<div className="tt">
			{this.state.table}
		</div>);
	}

}

class ReplPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tables: [],
		};
	}

	retrieveTruthTable = (formulas) => {
		let xhr = request('POST', '/ajax');
		xhr.onload = () => {
			console.log(xhr.responseText);
			let respText = JSON.parse(xhr.responseText);
			console.log(respText[0][0]);
			/*this.setState({ table: xhr.respTest });*/
			let respT = respText[0];
			this.showTT(respText);
		};
		console.log(formulas);
		for (let i = 0; i < formulas.length; i++) {
			xhr.send(formulas);	
		}
	}

	retrieveInput = (event) => {
        	let formulas = event.target.value;
        	/*FIXME: parse inputs*/

        	for (let f = 0; f < formulas.length; f++) {
                	if (formulas[f].slice(-1) == "\n") {
                        	console.log(formulas[f]);
                        	if (isValid(formulas[f])) {
                                	console.log("Formula is acceptable");
                                	console.log(formulas[f]);
                        	}
                	}
        	}


        	if ((formulas.slice(-1) == "\n")) {
                	if (event.keyCode == "13")
                        	this.retrieveTruthTable(formulas);
                	else if (event.keyCode == "8")
                        	console.log("deleted a formula");
        	}

        	/* tokenize by newline */
        	console.log(formulas.split("\n"));

        	/* if element in list is not null (""), pass it through the lexer */
        	/* we now have the indices of all of the lines, and can report errors */

	}

	showTT = (respT) => {
		/* Display the truth tables */
		console.log("Displaying");
		console.log(respT);
		let truthArray = [];
		for (let i = 0; i < respT.length; i++) {
			/* Each respT[i] is a truth table */
			let tt = <TruthTable table={respT[i]} key={i}/>;
			truthArray.push(tt);
			/* create truth table object */
			/* create rows for truth table and pass in vals */
			/*  */
		

		}

		/*  */
		this.setState({
			tables: truthArray,
		}, () => { console.log(this.state.tables) });
	}

	clearTables = () => {
		this.setState({
			tables: [],
		});
	}

	render() {
	return(<div id="replPage">
		<div id="pageContainer">
		<ReplContainer input={this.retrieveInput}/>
		<div id="tableContainer">
		{this.state.tables}
		</div>
		</div>
	</div>);
	}
}

function ReplContainer(props) {
	return(<div id="replContainer">
		<textarea id="replInput" onKeyUp={props.input}></textarea>
	</div>);
}

function TruthTableContainer(props) {
	return(<div id="ttContainer">
		<TruthTable />
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
