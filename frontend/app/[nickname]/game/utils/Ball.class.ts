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

	destructor() {
		delete this.x;
		delete this.y;
		delete this.top;
		delete this.bottom;
		delete this.right;
		delete this.left;
		delete this.radius;
		delete this.velocityX;
		delete this.velocityY;
		delete this.speed;
		delete this.color;
	}
}

export class Special {
	x: number;
	y: number;
	radius: number;
	type: string;
	ready: boolean;
	color: string;
	active: boolean;

	constructor(active: boolean) {
		this.active = active;
	}

	setType(type: string) {
		this.type = type;
	}

	setActive(ready: boolean) {
		this.ready = ready;
	}

	destructor(): void {
		delete this.x;
		delete this.y;
		delete this.radius;
		delete this.type;
		delete this.ready;
		delete this.color;
		delete this.active;
	}
}
