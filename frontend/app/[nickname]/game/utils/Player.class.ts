export default class Player {
	x: number;
	y: number;

	top: number;
	bottom: number;
	left: number;
	right: number;

	width = 10;
	height = 100;

	score = 0;
	color: string;

	constructor(initX: number, initY: number, initColor: string) {
		this.x = initX;
		this.y = initY;
		this.color = initColor;
	}
}