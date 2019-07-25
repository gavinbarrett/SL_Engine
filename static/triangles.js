let triangles = [];

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	stroke(255);
	fill(0, 0, 0, 50);
}

function draw() {
	console.log('drawing');
	background('green');
	triangles.push(new t());
	for (let tri of triangles) {
		tri.update();
		tri.display();
	}
}

function t() {
	this.x = random(0, windowWidth);
	this.y = random(windowHeight*0.7, windowHeight*0.8);
	this.size = random(2,10);
	this.x1 = this.x + this.size;
	this.x2 = this.x + (this.size / 2);
	this.y2 = this.y - this.size;
	this.update = () => {
		this.y -= (pow(this.size, 0.5) / 2);
		this.y2 -= (pow(this.size, 0.5) / 2);
		if (this.y < -10) {
			let index = triangles.indexOf(this);
			triangles.splice(index, 1);
		}
	};
	this.display = () => {
		triangle(this.x, this.y, this.x1, this.y, this.x2, this.y2);
	};
}
