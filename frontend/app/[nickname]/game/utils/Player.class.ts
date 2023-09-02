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

}