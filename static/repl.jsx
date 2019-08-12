import lexical_analysis from './lexer.js';

function request(url, method) {
	/* Open an http request */
	let xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr;
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
			exp: props.exp,
		};
	}
	componentDidMount() {
		this.addValues();
	}
	addValues = () => {
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
			{this.state.exp}
			<hr></hr>
			{this.state.table}
		</div>);
	}
}

class TruthTableContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
        	return(<div id="ttContainer">
                	<TruthTable />
        	</div>);
	}
}

class TableOutput extends React.Component {
	constructor(props) {
                super(props);
                this.state = {
                        tables: props.tables,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown,
                };
        }
	componentDidMount() {
		/* run scroll animation after object is created */
		this.state.scrollUp();
	}
        render() {
                return(<div id="tableContainer" className="scrollUpHidden">
                        <div className="close" onClick={this.state.scrollDown}></div>
			{this.state.tables}
                </div>);
        }
}

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			retrieve: props.retInput,
			button: 'calculate',
		}
	}
	render() {
		return(<div id="button" onClick={this.state.retrieve}>
			{this.state.button}
		</div>);
	}
}

class Truth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			a: "T",
			b: "F",
		}
	}
	render() {
		return(<div>
			{this.state.a}
			<hr></hr>
			{this.state.b}
		</div>);
	}
}

class SelectorLink extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			link: props.link,
		};
	}
	render() {
		return(<div className="selectorLink">
			{this.state.link}
		</div>);
	}
}

class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tables: "truth tables",
			validity: "validity check",
		};
	}
	render() {
		return(<div id="selector">
			<SelectorLink link={this.state.tables} /><SelectorLink link={this.state.validity} />
		</div>);
	}
}

class ReplContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
        	return(<div id="replContainer">
               		<Selector />
			<textarea id="replInput"></textarea>
        	</div>);
	}
}

class ReplPage extends React.Component {
	/* This page takes input and sends logical formulae to the server
	 * for processing; The page will display the truth tables if the input was
	 * accepted by the lexer */
	constructor(props) {
		super(props);
		this.state = {
			tables: [],
			out: undefined,
		};
	}
	retrieveTruthTable = (formulas, bool) => {
		/*  takes in valid formulas and sends them to the server; displays
		 * their truth tables upon return */
		let xhr = request('POST', '/ajax');

		xhr.onload = () => {
			let respText = JSON.parse(xhr.responseText);
			console.log('respText');
			console.log(respText);			
			/* output the truth values */
			if (bool == true)
				this.showValidity(respText, formulas);
			else
				this.showTT(respText, formulas);
		};
		
		/* send ajax request of the formulas */
		xhr.send(formulas);	
	}
	retrieveInput = (event) => {
        	let formulas = document.getElementById('replInput').value;

		if (formulas.slice(-1) != "\n")
			formulas += "\n";
	
		let fs = formulas.split('\n');	
		
		// strip formulas of unnecessary inputs caused by newlines
		let fs2 = fs.filter(val => { return val != "" });
		
		for (let f = 0; f < fs2.length; f++) {
			let a = fs2[f] + '\n'

			/* call lexical_analysis() to check grammar */
			let t = lexical_analysis(a);
			if (t)
				console.log('1');
			else {
				console.log('0');
				return;
			}
		}
		/* send data to be analyzed on the server */
		console.log('AJAX package:\n');
		// setting bool to true will check validity of the arg
		let bool = true;
		this.retrieveTruthTable(formulas, bool);
	}
	normalize = (formulas) => {
		let forms = [];
		let form = ''
		for (let i = 0; i < formulas.length; i++) {
			if (formulas[i] == '\n') {
				form += formulas[i];
				forms.push(form);
				form = '';
			} else {
				form += formulas[i];
			}
		}
		return forms;
	}
	showTT = (respT, formulas) => {
		/* Display the individual truth tables */
		formulas = this.normalize(formulas);
		console.log(respT);
		let truthArray = [];



		for (let i = 0; i < respT.length; i++) {
			/* Each respT[i] is a truth table */

			let table = <div className="tableWrap"><TruthTable table={respT[i][2]} exp={respT[i][1]} key={i}/><TruthTable table={respT[i][0]} exp={formulas[i]} key={i}/></div>;

			truthArray.push(table);
		}

		let ttOut = <TableOutput tables={truthArray} scrollUp={this.scrollUp} scrollDown={this.scrollDown}/>;

		this.setState({
			out: ttOut,
		}, () => { console.log(this.state.tables) });
	}
	showValidity = (respT, formulas) => {
		/* test validity */
		formulas = this.normalize(formulas);
		let truthArray = [];
		
		/*
		 * respT[0] = truth assignments
		 * respT[1] = truth_matrices
		 * respT[2] = truth values of each exp (?)
		 * */

		let terms = respT[0];
		console.log('terms: ', terms);

		let init_vals = respT[1];
		let init_table = <div className="tableWrap"><TruthTable table={init_vals} exp={terms} key={0}/></div>;

		/* add initial truth assignments */
		truthArray.push(init_table);
		let nextTable;
		/* add  */
		for (let i = 2; i < respT.length; i++) {
			nextTable = <div className="tableWrap"><TruthTable table={respT[i]} exp={formulas[(i-2)]} key={i}/></div>;
			truthArray.push(nextTable);
		}

		let ttOut = <TableOutput tables={truthArray} scrollUp={this.scrollUp} scrollDown={this.scrollDown}/>;

		this.setState({
			out: ttOut,
		});
	}
	retrieve = () => {
		let e = document.getElementById('replInput').value;
	}
	clearTables = () => {
		this.setState({
			tables: [],
		});
	}
	scrollUp = () => {
		let s = document.getElementById('tableContainer');
		s.classList.toggle('scrollUpHidden');
		s.classList.toggle('scrollUp');
	}
	scrollDown = () => {
		let s = document.getElementById('tableContainer');
		s.classList.toggle('scrollDown');
		setTimeout(() => {
			this.setState({ out: undefined })
		}, 1000);
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

export {
	ReplPage,
	ReplContainer,
	TableOutput,
	TruthTableContainer,
	TruthTableRow,
	TruthTable,
	Truth,
	Segment,
	Banner,
	Button,
}
