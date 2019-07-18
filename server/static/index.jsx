function request(url, method) {
	/* Open an http request */
	let xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr;
}

function validateFormula(formula) {
	/* Return true if formula is valid in SL */

}

function isValid(formula) {
	/* Returns true if formula is accepted in SL */

}

class Segment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			symbol: props.sym,
			english: props.eng,
		}
	}
	render() {
		return(<div className="segment">
			<div className="sym">
			{this.state.symbol}
			</div>
			<div className="eng">
			{this.state.english}
			</div>
		</div>);
	}
}

class Banner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			negation: "~",
			neg: "negation",
			conjunction: "^",
			con: "conjunction",
			disjunction: "v",
			dis: "disjunction",
			conditional: "->",
			cond: "conditional",
			biconditional: "<->",
			bicond: "biconditional",
		}
	}
	render() {
		return(<div id="bannerWrapper">
		<Segment sym={this.state.negation} eng={this.state.neg} />
		<Segment sym={this.state.conjunction} eng={this.state.con} />
		<Segment sym={this.state.disjunction} eng={this.state.dis} />
		<Segment sym={this.state.conditional} eng={this.state.cond} />
		<Segment sym={this.state.biconditional} eng={this.state.bicond} />
		</div>);
	}
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

class TableOutput extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        tables: props.tables,
			scroll: props.scroll,
                };
		console.log(props.tables);
        }
	
	componentDidMount() {
		{this.state.scroll}
	}

        render() {
                return(<div id="tableContainer" className="scrollUpHidden">
                        {this.state.tables}
                </div>);
        }
}


class Button extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			retrieve: props.retInput,
			button: 'check',
		}
	}

	render() {
		return(<div id="button" onClick={this.state.retrieve}>
			{this.state.button}
		</div>);
	}
}

class ReplPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tables: [],
			out: undefined,
		};
	}

	retrieveTruthTable = (formulas) => {
		let xhr = request('POST', '/ajax');
		xhr.onload = () => {
			console.log(xhr.responseText);
			let respText = JSON.parse(xhr.responseText);
			let respT = respText[0];
			this.showTT(respText);
		};
		console.log(formulas);
		for (let i = 0; i < formulas.length; i++) {
			xhr.send(formulas);	
		}
	}

	retrieveInput = (event) => {
        	let formulas = document.getElementById('replInput').value;
		//let formulas = event.target.value;
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
		if (formulas.slice(-1) != "\n") {
			console.log("adding newline");
			formulas += "\n";
		}
		this.retrieveTruthTable(formulas);
		/*
        	if ((formulas.slice(-1) == "\n")) {
                	if (event.keyCode == "13")
                        	this.retrieveTruthTable(formulas);
                	else if (event.keyCode == "8")
                        	console.log("deleted a formula");
        	}
		*/
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
		}

		let ttOut = <TableOutput tables={truthArray} scroll={this.scrollUp}/>

		this.setState({
			out: ttOut,
		}, () => { console.log(this.state.tables) });
	}
	
	retrieve = () => {
		let e = document.getElementById('replInput').value;
		console.log(e);
	}

	clearTables = () => {
		this.setState({
			tables: [],
		});
	}

	scrollUp = () => {
		let s = document.getElementById('tableContainer');
		s.classList.toggle('scrollUp');
		s.classList.toggle('scrollUpHidden');
	}

	render() {
	return(<div id="replPage">
		<Banner />
		<div id="pageContainer">
		<ReplContainer />
		<Button retInput={this.retrieveInput}/>
		</div>
		{this.state.out}
	</div>);
	}
}

function ReplContainer(props) {
	return(<div id="replContainer">
		<textarea id="replInput"></textarea>
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
