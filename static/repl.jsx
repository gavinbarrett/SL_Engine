import lexical_analysis from './parser.js';

let request = (url, method) => {
	/* Open an http request */
	let xhr = new XMLHttpRequest();
	xhr.open(url, method, true);
	return xhr;
}

class Banner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			msg: props.msg,
		}
	}
	valid = () => {
		let ban_wrap = document.getElementById('BannerWrapper');
		ban_wrap.style.color = "#2a9d8f"
		this.setState({ msg: 'Valid!' });
	}
	invalid = () => {
		let ban_wrap = document.getElementById('BannerWrapper');
		ban_wrap.style.color = "#e76f51"
		this.setState({ msg: 'Invalid!' });
	}
	reset = () => {
		let ban_wrap = document.getElementById('BannerWrapper');
		ban_wrap.style.color = "#264653"
		this.setState({ msg: 'Please Enter a WFF' });
	}
	render() {
		return(<div id="BannerWrapper">
			{this.state.msg}
		</div>);
	}
}

class ReplContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: props.inp,
		};
	}
	render() {
        	return(<div id="ReplContainer">
			<textarea id="ReplInput" onChange={this.state.input}></textarea>
        	</div>);
	}
}

class ReplPage extends React.Component {
	/* This page takes input and sends logical formulae to the server
	 * for processing; The page will display the Truth Tables if the input was
	 * accepted by the lexer */
	constructor(props) {
		super(props);
		this.banner = React.createRef();
		this.state = {
			valid: undefined,
			msg: "Please Enter a WFF",
		};
	}
	
	/*
	awaitValidity = async formulas => {
		const response = await fetch('/valid', { method: "POST", body: formulas });
		return await response.json();
	}
	*/

	retrieveTruthTable = (formulas) => {
		/*  takes in valid formulas and sends them to the server; displays
		 * their Truth Tables upon return */
		// if nothing was input, do not send an AJAX request
		if (!formulas) {
			this.banner.current.reset();
			return;
		}
		//formulas = [formulas];
		/*
		this.awaitValidity(formulas)
			.then(response => {
				let respText = JSON.parse(response);
				// output validity
				if (respText[0] == true) 
					this.banner.current.valid();
				else if (respText[0] == false)
					this.banner.current.invalid();
				else
					this.banner.current.reset();
			}
		);
		*/
		
		// initialize http request
		// FIXME: change to fetch
		let xhr = request('POST', '/valid');
		xhr.onload = () => {
			// parse retrieved JSON
			let respText = JSON.parse(xhr.responseText);
			// output validity
			if (respText[0] == true) 
				this.banner.current.valid();
			else if (respText[0] == false)
				this.banner.current.invalid();
			else
				this.banner.current.reset();
		};
		formulas = [formulas];
		//send ajax request of the formulas
		xhr.send(formulas);	
	}

	retrieveInput = (event) => {
        let formulas = document.getElementById('ReplInput').value;
		if (formulas.slice(-1) != "\n")
			formulas += "\n";
	
		let fs = formulas.split('\n');	
		
		let newForms = "";

		// strip formulas of unnecessary inputs caused by newlines
		let fs2 = fs.filter(val => { return (val != "") && (val != " ") });
		
		for (let f = 0; f < fs2.length; f++) {
			let a = fs2[f] + '\n'
			newForms += a;
			/* call lexical_analysis() to check grammar */
			let is_wff = 0;
			try {
				is_wff = lexical_analysis(a);
			} catch (error) {
				is_wff = error;
				this.banner.current.reset();
				return;
			}
		}
		
		/* send data to be analyzed on the server */
		this.retrieveTruthTable(newForms);
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
	
	render() {
	return(<div id="ReplPage">
		<Banner msg={this.state.msg} ref={this.banner}/>
		<div class="tooltip">
		What is a WFF?
		<span class="tooltiptext">A WFF is composed of the following characters: ~, ^, v, -{">"}, {"<"}-{">"}, (, ) <a id="l"href="https://en.wikipedia.org/wiki/Well-formed_formula">Definition of WFF</a></span>
		</div>
		<div id="pageContainer">
		<ReplContainer inp={this.retrieveInput}/>
		</div>
	</div>);
	}
}

export {
	ReplPage,
	ReplContainer,
	Banner,
}
