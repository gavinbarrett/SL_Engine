import lexical_analysis from './parser.js';

let request = (url, method) => {
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
		return(<div className="Segment">
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
		return(<div id="BannerWrapper">
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
			Table: [],
			t: props.Table,
			exp: props.exp,
		};
		this.addValues.bind(this);
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
		// rerender the page with the Truth Table
		this.setState({
			Table: newTable,
		});
	}
	render() {
		return(<div className="tt">
			{this.state.exp}
			<hr></hr>
			{this.state.Table}
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

class Valid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			valid: props.valid,
		};
	}
	render() {
		return(<div id="Valid">
			{this.state.valid}
		</div>);
	}
}

class Invalid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notvalid: props.invalid,
		};
	}
	render() {
		return(<div id="Invalid">
			{this.state.notvalid}
		</div>);
	}
}

class ValidOutput extends React.Component {
	constructor(props) {
                super(props);
                this.state = {
                        valid: props.valid,
			validity: props.validity,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown,
                };
        }
	componentDidMount() {
		/* run scroll animation after object is created */
		this.state.scrollUp('ValidContainer');
	}
        render() {
                return(<div id="ValidContainer" className="scrollUpHidden">
                        <div className="close" onClick={this.state.scrollDown}></div>
			<div id="outputWrapper">
			<div id="outputHeader">
			{this.state.validity}
			</div>
			<div id="outputTables">
			{this.state.valid}
			</div>
			</div>
		</div>);
        }
}

class TableOutput extends React.Component {
	constructor(props) {
                super(props);
                this.state = {
                        Tables: props.Tables,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown,
                };
        }
	componentDidMount() {
		/* run scroll animation after object is created */
		this.state.scrollUp('TableContainer');
	}
        render() {
                return(<div id="TableContainer" className="scrollUpHidden">
                        <div className="close" onClick={this.state.scrollDown}></div>
			{this.state.Tables}
                </div>);
        }
}

class Partition extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(<hr className="Partition"></hr>);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			retrieve: props.retInput,
			Button: 'calculate',
		}
	}
	render() {
		return(<div id="Button" onClick={this.state.retrieve}>
			{this.state.Button}
		</div>);
	}
}

class Truth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			a: "1",
			b: "0",
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
			i: props.i,
			l: props.l,
		};
	}
	render() {
		return(<div id={this.state.i} className="SelectorLink" onClick={this.state.l}>
			{this.state.link}
		</div>);
	}
}

class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Tables: "Truth Tables",
			validity: "Validity Check",
			link: props.link,
		};
	}
	render() {
		return(<div id="Selector">
			<SelectorLink i={"t"} link={this.state.Tables} l={this.state.link}/><SelectorLink i={"v"} link={this.state.validity} l={this.state.link}/>
		</div>);
	}
}

class ReplContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			b: props.b,
			link: props.link,
		};
	}
	render() {
        	return(<div id="ReplContainer">
               		<Selector link={this.state.link}/>
			<textarea id="ReplInput"></textarea>
        	</div>);
	}
}

class ReplPage extends React.Component {
	/* This page takes input and sends logical formulae to the server
	 * for processing; The page will display the Truth Tables if the input was
	 * accepted by the lexer */
	constructor(props) {
		super(props);
		this.state = {
			Table: [],
			valid: undefined,
			Tables: [],
			out: [],
			b: "t",
		};
	}
	componentDidMount() {
		let tab = document.getElementById("t");
		tab.classList.add("SelectorSelected");
	}
	selectSwitch = (bool) => {
		/* return correct api function based on state */
		//return (bool == true) ? '/Table':'/valid';
		if (bool == "t")
			return "/Table";
		else
			return "/valid";
	}
	retrieveTruthTable = (formulas, bool) => {
		/*  takes in valid formulas and sends them to the server; displays
		 * their Truth Tables upon return */
		// if nothing was input, do not send an AJAX request
		if (!formulas)
			return;
		// select appropriate api function
		//let api = this.selectSwitch(bool);
		
		// initialize http request
		let xhr = request('POST', '/valid');
		xhr.onload = () => {
			// parse retrieved JSON
			let respText = JSON.parse(xhr.responseText);
			/* output the Truth values */
			(bool == "t") ? this.showTT(respText, formulas) : this.showvalidity(respText, formulas);
		};
		formulas = [formulas] + [bool]
		/* send ajax request of the formulas */
		xhr.send(formulas);	
	}
	
	retrieveInput = (event) => {
        	let formulas = document.getElementById('ReplInput').value;
		console.log("formulas: \n", formulas);
		if (formulas.slice(-1) != "\n")
			formulas += "\n";
	
		let fs = formulas.split('\n');	
		
		let newForms = "";

		// strip formulas of unnecessary inputs caused by newlines
		let fs2 = fs.filter(val => { return val != "" });
		for (let f = 0; f < fs2.length; f++) {
			let a = fs2[f] + '\n'
			newForms += a;
			/* call lexical_analysis() to check grammar */
			let t = lexical_analysis(a);
			if (!t)
				return;
		}
		
		/* send data to be analyzed on the server */
		this.retrieveTruthTable(newForms, this.state.b);
	}
	
	normalize = (formulas) => {
		/* normalize expressions by newline */
		let forms = [];
		let form = ''
		for (let i = 0; i < formulas.length; i++) {
			if (formulas[i] == "\n") {
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
		/* Display the individual Truth Tables */
		formulas = this.normalize(formulas);
		let TruthArray = [];
		console.log("respT:");
		for (let i = 0; i < respT.length; i++) {
			/* Each respT[i] is a Truth Table */
			let Table = <div className="TableWrap"><TruthTable Table={respT[i][2]} exp={respT[i][1]} key={i}/><TruthTable Table={respT[i][0]} exp={formulas[i]} key={i}/></div>;

			TruthArray.push(Table);
		}
		let ttOut = <TableOutput Tables={TruthArray} scrollUp={this.scrollUp} scrollDown={this.scrollDown}/>;

		this.setState({
			out: ttOut,
		}, () => { console.log(this.state.Tables) });
	}
	showvalidity = (respT, formulas) => {
		/* test validity */
		
		formulas = this.normalize(formulas);
		
		let TruthArray = [];

		let terms = respT[0];

		let validity = respT.pop();
		
		// save the correct message
		let message = (validity) ? <Valid valid={"Valid!"} /> : <Invalid invalid={"Invalid!"} />;
		let init_vals = respT[1];
		
		let init_Table = <div className="TableWrap"><TruthTable Table={init_vals} exp={terms} key={0}/></div>;

		/* add initial Truth assignments */
		TruthArray.push(init_Table);
		let nextTable;
		let p = <Partition />;
		TruthArray.push(p);

		/* add calculated Tables*/
		for (let i = 2; i < respT.length; i++) {
			nextTable = <div className="TableWrap"><TruthTable Table={respT[i]} exp={formulas[(i-2)]} key={i}/></div>;
			TruthArray.push(nextTable);
			p = <Partition />;
			TruthArray.push(p);
		}
		
		/* package up all Tables */
		let ttOut = <ValidOutput valid={TruthArray} validity={message} scrollUp={this.scrollUp} scrollDown={this.scrollDown}/>;
		
		/* change output state */
		this.setState({
			out: ttOut,
		});
	}

	updateLink = (event) => {
		/* update boolean to determine which api function to call 
		 * this method is called anytime the selector Buttons are clicked */

		// access dom element
		let sel = document.getElementById(event.target.id);
		// save the other selector to contrast selection highlighting
		let unsel;
		let ttOut;
		let TruthArray = [];
		
		if (event.target.id == "t") {
			unsel = document.getElementById("v");
		} else if (event.target.id == "v"){
			unsel = document.getElementById("t");
		}
		// change class membership if necessary
		if (event.target.id == this.state.b) {
			//pass
		} else {
			unsel.classList.remove("SelectorSelected");
			sel.classList.remove("SelectorUnselected");
			unsel.classList.add("SelectorUnselected");
			sel.classList.add("SelectorSelected");
		}
		
		// update state property
		this.setState({
			b: event.target.id,
			Tables: [],
		});
	};
	
	clearTables = () => {
		this.setState({
			Tables: [],
		});
	}
	
	scrollUp = () => {
		/* move the output container into the user interface */
		let s;
		if (this.state.b == "t")
			s = document.getElementById('TableContainer');
		else
			s = document.getElementById('ValidContainer');
		s.classList.toggle('scrollUpHidden');
		s.classList.toggle('scrollUp');
	}
	
	scrollDown = () => {
		/* move the output container out of the user interface */
		let s;
		if (this.state.b == "t")
			s = document.getElementById("TableContainer");
		else
			s = document.getElementById("ValidContainer");
		s.classList.toggle('scrollDown');
		setTimeout(() => {
			this.setState({ 
				out: undefined,
				Tables: [],
			})
		}, 1000);
	}
	
	render() {
	return(<div id="ReplPage">
		<Banner />
		<div id="pageContainer">
		<ReplContainer b={this.state.b} link={this.updateLink}/>
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
