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

class TableOutput extends React.Component {
        constructor(props) {
                super(props);
                this.state = {
                        tables: props.tables,
			scrollUp: props.scrollUp,
			scrollDown: props.scrollDown,
                };
		console.log(props.tables);
        }
	
	componentDidMount() {
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
			let respT = respText;
			console.log(respText[1]);
			console.log(respText[2]);
			this.showTT(respT, formulas);
		};
		console.log(formulas);
		/*for (let i = 0; i < formulas.length; i++) {*/
		xhr.send(formulas);	
		/*}*/
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
		
		/* tokenize by newline *
		 */
        	
		console.log(formulas.split("\n"));
        	/* if element in list is not null (""), pass it through the lexer */
        	/* we now have the indices of all of the lines, and can report errors */
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
		/* Display the truth tables */
		formulas = this.normalize(formulas);
		let respT1 = respT[0];
		let re = respT[1];
		let respT2 = respT[2];
		console.log(respT);
		let truthArray = [];
		for (let i = 0; i < respT1.length; i++) {
			/* Each respT[i] is a truth table */

			let table = <div className="tableWrap"><TruthTable table={respT2[i]} exp={re[i]} key={i}/><TruthTable table={respT1[i]} exp={formulas[i]} key={i}/></div>;

			truthArray.push(table);
		}

		let ttOut = <TableOutput tables={truthArray} scrollUp={this.scrollUp} scrollDown={this.scrollDown}/>

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
		<Heading heading="Organon" sub="propositional logic analyzer"/>
	</div>);
}

function Bottom(props) {
	return(<div id="bottom">
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

ReactDOM.render(<RenderLanding />, document.getElementById('root'));
