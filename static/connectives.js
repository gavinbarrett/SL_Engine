let activeConnectives = [];
const symbols = ['~', '^', 'v', '->'];
let count = 0;

function windowResized() {
	/* make sure canvas stays congruent with the body tag */
	resizeCanvas(document.body.offsetWidth, document.body.offsetHeight);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	fill(255);
	textFont('Helvetica');
}

function draw() {
	// draw background
	background('green');
	fill(255);
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
	this.x = random(0, document.body.offsetWidth);
	//this.y = random(document.body.offsetWidth*0.95, document.body.offsetHeight);
	this.y = document.body.offsetHeight*0.90;
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
		textSize(this.size);
		text(this.sym, this.x, this.y);
	};
}
