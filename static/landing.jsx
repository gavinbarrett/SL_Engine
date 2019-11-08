/* The main project files for Organon are being temporarily consolidated in this file due to issue that occur when transpiling ES6 -> ES5; the first major block of code contains the front-end parser; the second block contains the definition*/


/* Begin Parser Definitions*/
class Parser {
	
	constructor(feed) {
		/* construct a parser to recognize propositional logic */
		this.next = null;
		this.feed = feed;
		this.reg = /[A-Z]/;
		this.open = 0;
		this.closed = 0;
		this.binary_ops = ['^','v','<','-'];
	}
	
	lex() {
		/* try to parse the input */
		this.scan();
		if (this.next === '\n')
			return false;
		this.expression();
		return this.next === '\n';
	}

	expression() {
		/* try to parse the expression */
		this.scan();
		if (this.next === '~')
			this.unary()
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next) {
			if (this.next.match(this.reg))
				this.atomic();
			else
				throw "Error: malformed expression\n";
		}
	}

	open_parenthesis() {
		/* handle opening parenthesis */
		this.scan();
		if (this.next === '~')
			this.unary();
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next === ')') {
			this.closed += 1;
			this.closed_parenthesis();
		} else if (this.next) {
			if (this.next.match(this.reg))
				this.atomic();
			
			else
				throw "Error: malformed formula following open parenthesis\n";
		}
	}

	closed_parenthesis() {
		/* handle closing parenthesis */
		if (this.feed === '' && (this.open === this.closed))
			console.log("Terminating in parenthesis");
		else {
			this.scan();
			if (this.next === ')') {
				this.closed += 1;
				this.closed_parenthesis();
			} else if (this.binary_ops.includes(this.next))
				this.binary();
			else {
				console.log("this.next: ");
				console.log(this.next.charCodeAt(0));
				throw "Error: malformed formula following closing parenthesis\n";
			}
		}
	}

	atomic() {
		/* handle an atomic sentence */
		this.scan();
		if (this.binary_ops.includes(this.next))
			this.binary();
		else if (this.next === ')') {
			this.closed += 1;
			this.closed_parenthesis();
		} else if (this.next) {
			if (this.next.match(this.reg))
				throw "Error: atomic sentences not seperated by operators\n";
			else if (this.next === '~')
				throw "Error: atomic sentence precedes negation\n"
		} else if (this.feed === '' && (this.open === this.closed))
			console.log("Terminating in atomic state");
		else
			throw "Error: malformed formula after atomic sentence\n";
	}

	unary() {
		/* handle a unary operator */
		this.scan();
		if (this.next === '~')
			this.unary();
		else if (this.next === '(') {
			this.open += 1;
			this.open_parenthesis();
		} else if (this.next) {
			if (this.next.match(this.reg))
				this.atomic();
			else
				throw "Error: malformed formula after unary operator\n";
		} else
			throw "Error: string terminated after unary operator\n";
	}

	binary() {
		/* handle a binary operator */
		if (this.next === '<')
			this.biconditional();
		else if (this.next === '-')
			this.conditional();
		else {
			this.scan();
			if (this.next === '~')
				this.unary();
			else if (this.next === '(') {
				this.open += 1;
				this.open_parenthesis();
			} else if (this.next) {
				if (this.next.match(this.reg))
					this.atomic();
				else
					throw "Error: malformed formula after binary operator\n";
			} else
				throw "Error: string terminated after binary operator\n"
		}
	}


	biconditional() {
		this.scan();
		if (this.next === '-')
			this.conditional();
		else
			throw "Error: malformed biconditional operator\n";
	}

	conditional() {
		this.scan();
		if (this.next === '>')
			this.binary();
		else
			throw "Error: malformed conditional operator\n";
	}

	read() {
		
		if (this.feed.length === 0)
			return null;
		let character = this.feed.slice(0, 1);
		this.feed = this.feed.slice(1);
		return character;
	}

	scan() {
		this.next = this.read();
		if (this.next == null)
			return null;
		while (this.next === " ")
			this.next = this.read();
	}
}

function lexical_analysis(string) {
	if (!string)
		return 0;
	let expArray = string.split("\n");
	console.log(expArray);
	for (let i = 0; i < expArray.length; i++) {
		let p = new Parser(expArray[i]);
		try {
			p.expression()
			console.log('Analysis successful.\n');
		} catch (error) {
			console.log('Analysis failed.\n');
			return 0;
		}
	}
	return 1;
}


/* End Parser definitions */


/* Begin ReplPage definitions */


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
		this.addValues = this.addValues.bind(this); 
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
			Valid: props.Valid,
		};
	}
	render() {
		return(<div id="Valid">
			{this.state.Valid}
		</div>);
	}
}

class Invalid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notValid: props.Invalid,
		};
	}
	render() {
		return(<div id="Invalid">
			{this.state.notValid}
		</div>);
	}
}

class ValidOutput extends React.Component {
	constructor(props) {
                super(props);
                this.state = {
                        Valid: props.Valid,
			Validity: props.Validity,
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
			{this.state.Validity}
			</div>
			<div id="outputTables">
			{this.state.Valid}
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
			Validity: "Validity check",
			link: props.link,
		};
	}
	render() {
		return(<div id="Selector">
			<SelectorLink i={"t"} link={this.state.Tables} l={this.state.link}/><SelectorLink i={"v"} link={this.state.Validity} l={this.state.link}/>
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
			Valid: undefined,
			Tables: [],
			out: [],
			b: "t",
		};
		this.showTT = this.showTT.bind(this);
		this.showValidity = this.showValidity.bind(this);
	}
	componentDidMount() {
		let tab = document.getElementById("t");
		tab.classList.add("SelectorSelected");
	}
	selectSwitch = (bool) => {
		/* return correct api function based on state */
		//return (bool == true) ? '/Table':'/Valid';
		if (bool == "t")
			return "/table";
		else
			return "/valid";
	}
	retrieveTruthTable = (formulas, bool) => {
		/*  takes in Valid formulas and sends them to the server; displays
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
			console.log(respText);
			console.log("bool: ", bool);
			if (bool == "t")
				this.showTT(respText, formulas);
			else
				this.showValidity(respText, formulas);
			//(bool == "t") ? () => {this.showTT(respText, formulas)} : () => {this.showValidity(respText, formulas) };
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
	showValidity = (respT, formulas) => {
		console.log("We are valid");
		/* test Validity */
		
		formulas = this.normalize(formulas);
		
		let TruthArray = [];

		let terms = respT[0];

		let Validity = respT.pop();
		
		// save the correct message
		let message = (Validity) ? <Valid Valid={"Valid!"} /> : <Invalid Invalid={"Invalid!"} />;
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
		let ttOut = <ValidOutput Valid={TruthArray} Validity={message} scrollUp={this.scrollUp} scrollDown={this.scrollDown}/>;
		
		/* change output state */
		this.setState({
			out: ttOut,
		});
	}

	updateLink = (event) => {
		/* update boolean to determine which api function to call 
		 * this method is called anytime the Selector Buttons are clicked */

		// access dom element
		let sel = document.getElementById(event.target.id);
		// save the other Selector to contrast selection highlighting
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

function RenderRepl() {
	ReactDOM.render(<ReplPage />, document.getElementById('root'));
}


/* End ReplPage Definitions */


/* Begin Landing Page Definitions */


function Page(props) {
	return(<div id="message">
		<Heading heading="Organon" sub="propositional logic analyzer"/>
	</div>);
}

function Bottom(props) {
	return(<div id="Bottom">
		<InputRedirect click="check my logic" />
	</div>);
}

function Heading(props) {
	return(<div id="heading">
		{props.heading}
		<div id="subHead">
		{props.sub}
		</div>
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

ReactDOM.render(<RenderLanding/>, document.getElementById('root'));

/* End Landing Page Definitions */


