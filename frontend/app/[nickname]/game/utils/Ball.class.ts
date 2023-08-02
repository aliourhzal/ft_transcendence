export default class Ball {
	x: number;
	y: number;

	top: number;
	bottom: number;
	left: number;
	right: number;

	radius = 10;
	velocityX = 5; //ball direction
	velocityY = 5;
	speed = 7;
	color = "WHITE";

	constructor(initX: number, initY: number) {
		this.x = initX;
		this.y = initY;
	}
}