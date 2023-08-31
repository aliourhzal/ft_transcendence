
import { Server, Socket } from 'socket.io'

type canvasDim = {
	height: number,
	width: number,
}

export type coords = {
	x: number,
	y: number
}

export type userNode = {
	socket: Socket,
	user: Player
}

export type paddleInfo = {
	x: number,
	y: number,
	collision: boolean,
	collAngle: number
}

export type roomT = {
	loop: NodeJS.Timer,
	player1: Player,
	player2: Player,
	roomId: string,
	ballDynamics: Ball,
	hell: boolean,
	specialsMode: boolean,
	specials: Specials,
	canvas: canvasDim;
}

export type msgFromPlayer = {
	x: number,
	y: number,
	collision: boolean,
	collAngle: number,
	h: number,
	canvasH: number
}

export class Player {
	readonly socket: Socket;
	ball: coords;
	score: number;
	nickName: string;
	avatar: string;
	height: number;
	gameGoing: boolean;
	special: boolean;
	hell: boolean;

	constructor(socket: Socket, score = 0, gameGoing = false, special = false, hell = false) {
		this.socket = socket;
		this.ball = {x: 400, y: 450 / 2};
	}

	moveBall(velocityX: number, velocityY: number) {
		this.ball.x += velocityX;
		this.ball.y += velocityY;
	}

	resetBall(x: number, y: number) {
		this.ball = {x, y };
	}

	correctHorizantalColl(y: number) {
		this.ball.y = y;
	}

	initBallPos(x: number, y: number, radius: number) {
		this.ball = {x, y};
	}

	setData(nickName: string, avatar: string) {
		this.nickName = nickName;
		this.avatar = avatar;
	}

	resetHeight() {
		this.height = 450 / 4;
	}

}

export class Ball {
	radius = 10;
	velocityX = 5; //ball direction
	velocityY = 5;
	speed = 3;
	color = "WHITE";

	resetForNewGame() {
		this.speed = 3;
		this.velocityX = 5;
		this.velocityY = 5;
	}

}

export class Specials {
	dwarf: boolean;
	big_foot: boolean;
	position: coords;
	sent: boolean
	activated: boolean;

	constructor() {
		this.big_foot = false;
		this.dwarf = false;
		this.activated = false;
		this.position = {
			x: 0,
			y: 0
		}
	}

	randomIntFromInterval(min: number, max: number) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	activateSpecial(canvasH: number, canvasW: number) {
		const specials = ['dwarf', 'big_foot'];
		let randomX = this.randomIntFromInterval(2 / 10 * canvasW, 8 / 10 * canvasW);
		let randomY = this.randomIntFromInterval(2 / 10 * canvasH, 8 / 10 * canvasH);
		const randomSpecial = this.randomIntFromInterval(0, 1);
		console.log('test: ', specials[randomSpecial]);
		specials.forEach((s) => {
			this[s] = false;
		})
		this[specials[randomSpecial]] = true;
		this.position = {
			x: randomX,
			y: randomY
		}
		this.activated = true;
		this.sent = false;
	}

	desactivateSpecial() {
		this.activated = false;
	}

	isSpecialActivated() {
		return (this.activated);
	}

	getSpecial() {
		const specials = ['dwarf', 'big_foot'];
		const selected = specials.find(s => this[s]);
		return (selected);
	}
}