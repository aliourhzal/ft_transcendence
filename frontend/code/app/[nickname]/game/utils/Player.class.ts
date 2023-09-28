export default class Player {
	x: number;
	y: number;
	pos: string;

	top: number;
	bottom: number;
	left: number;
	right: number;

	width = 10;
	height: number;

	score = 0;
	color: string;

	constructor(initX: number, initY: number, initColor: string) {
		this.x = initX;
		this.y = initY;
		this.color = initColor;
	}

	setDims(h: number, w: number) {
		this.height = h;
		this.width = w
	}

	setPos(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	destructor() {
		delete this.x;
		delete this.y;
		delete this.pos;
		delete this.top;
		delete this.bottom;
		delete this.left;
		delete this.right;
		delete this.height;
		delete this.width;
		delete this.score;
		delete this.color;
	}

}