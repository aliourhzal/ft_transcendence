import { WebsocketContext } from "@/app/context_sockets/gameWebSocket";
import { useContext, useEffect, useRef } from "react"

class Player {
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

class Ball {
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

function Canvas() {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const socket = useContext(WebsocketContext);

	let loop;
	
	// draw circle, will be used to draw the ball

	function InitGame(user: Player, com: Player, ball: Ball, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		const FPS = 50;

		function getMousePos(evt: { clientY: number; }){
			let rect = canvas.getBoundingClientRect();
			if (evt.clientY < rect.bottom - user.height)
				user.y = evt.clientY - rect.top + 2; 
			else
				return ;
		}

		canvas.addEventListener('mousemove', getMousePos);

		function drawRect(x, y, w, h, color){
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
		}

		function drawNet(){
			for(let i = 0; i <= canvas.height; i+=15){
				drawRect((canvas.width - 2)/2, i, 2, 10, 'white');
			}
		}
		
		// draw text
		function drawText(text,x,y){
			ctx.fillStyle = "#FFF";
			ctx.font = "60px roboto";
			ctx.fillText(text, x, y);
		}

		function drawArc(x, y, r, color){
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}

		function resetBall(){
			// console.log(ball.speed);
			ball.speed = 7;
			ball.x = canvas.width/2;
			ball.y = canvas.height/2;
			// ball.velocityX = -ball.velocityX;
			ball.velocityY = 5;
			ball.velocityX = 5;
		}

		// collision detection
		function collision(b,p){
			p.top = p.y;
			p.bottom = p.y + p.height;
			p.left = p.x;
			p.right = p.x + p.width;
			
			b.top = b.y - b.radius;
			b.bottom = b.y + b.radius;
			b.left = b.x - b.radius;
			b.right = b.x + b.radius;
			
			return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
		}

		function update(){
	
			// change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
			if (ball.x - ball.radius < -20){
				com.score++;
				resetBall();
				return ;
			}
			else if (ball.x + ball.radius > canvas.width + 20){
				user.score++;
				resetBall();
				return ;
			}
			
			// the ball has a velocity
			ball.x += ball.velocityX;
			ball.y += ball.velocityY;
			
			// computer plays for itself, and we must be able to beat it
			// simple AI
			com.y += ((ball.y - (com.y + com.height/2)))*0.1;
			
			// when the ball collides with bottom and top walls we inverse the y velocity.
			if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
				if (ball.y - ball.radius < 0)
					ball.y = 11
				else
					ball.y = canvas.height - 11;
				ball.velocityY = -ball.velocityY;
			 
			}
			
			// we check if the paddle hit the user or the com paddle
			let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
			
			// if the ball hits a paddle
			if(collision(ball,player)){
				// play sound
				// we check where the ball hits the paddle
				let collidePoint = (ball.y - (player.y + player.height/2));
				// normalize the value of collidePoint, we need to get numbers between -1 and 1.
				// -player.height/2 < collide Point < player.height/2
				collidePoint = collidePoint / (player.height/2);
				
				// when the ball hits the top of a paddle we want the ball, to take a -45degees angle
				// when the ball hits the center of the paddle we want the ball to take a 0degrees angle
				// when the ball hits the bottom of the paddle we want the ball to take a 45degrees
				// Math.PI/4 = 45degrees
				let angleRad = (Math.PI/4) * collidePoint;
				
				// change the X and Y velocity direction
				let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
				ball.velocityX = direction * ball.speed * Math.cos(angleRad);
				ball.velocityY = ball.speed * Math.sin(angleRad);
				
				// speed up the ball everytime a paddle hits it.
				ball.speed += 0.7;
			}
		}

		function render()
		{
			// clear the canvas
			drawRect(0, 0, canvas.width, canvas.height, "#353D49",);
			
			// draw the user score to the left
			drawText(user.score, canvas.width / 4, canvas.height / 5);
			
			// draw the COM score to the right
			drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
			
			// draw the net
			drawNet();
			
			// draw the user's paddle
			drawRect(user.x, user.y, user.width, user.height, user.color);
			
			// draw the COM's paddle
			drawRect(com.x, com.y, com.width, com.height, com.color);
			
			// draw the ball
			drawArc(ball.x, ball.y, ball.radius, ball.color);
		}

		function game() {
			if (com.score === 5 || user.score === 5)
				clearInterval(loop);
			// socket.emit("gameData", ball.x);
			// update();
			render();
		}

		loop = setInterval(game, 1000/FPS);
	}

	useEffect(() => {
		
		const canvas = canvasRef.current;
		if (!canvas)
		return;
		const ctx = canvas.getContext('2d');
		if (!ctx)
		return ;
		const user = new Player(0, (canvas.height - 100) / 2, '#2879F2');
		const com = new Player(canvas.width - 10, (canvas.height - 100) / 2, '#E8EAEB');
		const ball = new Ball(canvas.width / 2, canvas.height / 2);
		socket.emit('startGame', 'hello');
		socket.on('gameDataStream', (data) => {
			ball.x = data.x;
			ball.y = data.y
		});
		InitGame(user, com, ball, canvas, ctx);
	}, [])

	return (
		<canvas ref={canvasRef} height='450px' width='800px' className="rounded-md" />
	)
}

export default Canvas;