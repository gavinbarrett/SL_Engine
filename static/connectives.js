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
	fill("#2a9d8f");
}

function draw() {
	// draw background
	background('#264653');
	// every 15 loops, make a new connective
	if (count % 20 === 0) {
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
	let r = Math.floor(random(0, 4));
	return symbols[r];
}

function connective() {
	/* constructs a connective */
	this.x = random(0, document.body.offsetWidth);
	this.y = document.body.offsetHeight * 0.90;

	this.size = random(20, 35);
	this.sym = random_conn();

	this.update = () => {
		this.y -= pow(this.size, 0.5) / 2;
		if (this.y < -100) {
			let index = activeConnectives.indexOf(this);
			let outBound = activeConnectives.splice(index, 1);
			//delete outBound;
		}
	};

	this.display = () => {
		textSize(this.size);
		text(this.sym, this.x, this.y);
	};
}
