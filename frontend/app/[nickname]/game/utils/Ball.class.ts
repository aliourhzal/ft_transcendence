export class Ball {
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

	setRadius(r: number) {
		this.radius = r;
	}

	setPos(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class Special extends Ball {
	type: string;
	active: boolean;
	color: string;

	setType(type: string) {
		this.type = type;
	}

	setActive(active: boolean) {
		this.active = active;
	}
}