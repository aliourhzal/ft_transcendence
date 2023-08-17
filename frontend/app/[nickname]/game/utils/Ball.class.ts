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
}

export class Special extends Ball {
	type: string;
	active: boolean;

	setType(type: string) {
		this.type = type;
	}

	setActive(active: boolean) {
		this.active = active;
	}
}
