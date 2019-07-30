let connectives = (p) => {

	let activeConnectives = [];
	const symbols = ['~', '^', 'v', '->'];
	let count = 0;

	p.myCustomRedrawAccordingToNewPropsHandler = function(p) {
		p.resizeCanvas(windowWidth, windowHeight);
	}

	p.setup = function() {
		p.createCanvas(windowWidth, windowHeight);
		p.fill(255);
		p.textFont('Helvetica');
	}

	p.draw = function() {
		// draw background
		p.background('green');
		p.fill(255);
		// every 15 loops, make a new connective
		if (count % 15 === 0) {
			count = 0;
			activeConnectives.push(new connective());
		}
		for (let connect of activeConnectives) {
			connect.update();
			connect.display();
		}
		count += 1;
	}

	function random_conn() {
		let r = Math.floor(random(0,4));
		return symbols[r];
	}

	function connective() {
		/* constructs a connective */
		this.x = random(0, windowWidth);
		this.y = random(windowHeight*0.85, windowHeight*0.90);
	
		//FIXME: modify probability distribution of symbols
		this.size = random(20, 35);
		this.sym = random_conn();

		this.update = () => {
			this.y -= (pow(this.size, 0.5) / 2);
			if (this.y < -10) {
				let index = activeConnectives.indexOf(this);
				activeConnectives.splice(index, 1);
			}
		};

		this.display = () => {
			p.textSize(this.size);
			p.text(this.sym, this.x, this.y);
		};
	}
}

export default connectives;
