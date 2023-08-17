'use client'

import { WebsocketContext, socket } from "@/app/context_sockets/gameWebSocket";
import { useContext, useEffect, useState } from "react";
import Player from "../utils/Player.class";
import {Ball, Special} from "../utils/Ball.class";
import { Socket } from "socket.io-client";


export default function Canvas(props: {socket:Socket, themeN: number, ball: boolean, specials: boolean, hell: boolean, opData: any }) {
	const [ana, GodWilling] = useState(0);
	const n = props.themeN;
    let bgColor = "#353D49";
	let color = "#50CFED";
    const ball = new Ball();
	const player = new Player(0, 0, "#2978F2");
	const com = new Player(0, 0, "#fff");
	let special = new Special();
	let getSmaller = 0;

	if (n === 2)//theme 1988 switch colors
	{
		bgColor = "#000";
		com.color = "#FFF";
		player.color = "#FFF";
	}
    function StartGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)
	{
		// draw circle, will be used to draw the ball
		function drawArc(x, y, r, color){
			ctx.fillStyle = color;
			ctx.beginPath();
			if (n === 2)
				drawRect(x, y, ball.radius*1.5, ball.radius*1.5, color);
			else
				ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
		function drawText(text,x,y){
			ctx.fillStyle = "#FFF";
			ctx.font = "75px fantasy";
			ctx.fillText(text, x, y);
		}
		function drawRect(x, y, w, h, color){
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
		}

		function effectCollision() {
			const a = Math.abs(special.y - ball.y);
			const b = Math.abs(special.x - ball.x);
			const c = Math.pow(a, 2) + Math.pow(b, 2);

			return (Math.sqrt(c) <= special.radius + ball.radius);
		}

		function collision() {
			player.top = player.y;
			player.bottom = player.y + player.height;
			player.left = player.x;
			player.right = player.x + player.width;
			
			ball.top = ball.y - ball.radius;
			ball.bottom = ball.y + ball.radius;
			ball.left = ball.x - ball.radius;
			ball.right = ball.x + ball.radius;
			
			return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
		}
		//clear canvas
		drawRect(0, 0, canvas.offsetWidth, canvas.offsetHeight, bgColor);
		// draw the user score to the left
		drawText(player.score, canvas.width / 4, canvas.height / 5);

		// draw the COM score to the right
		drawText(com.score,3 * canvas.width / 4,canvas.height / 5);
		//draw player Paddle

		drawRect(player.x, player.y, player.width, player.height, player.color);
		//draw the oposite Paddle
		drawRect(com.x, com.y , com.width, com.height, com.color);

		//draw the ball
		if (props.ball === true)
        {
            color = "#" +  (Math.ceil(ball.x) < 0 ? Math.ceil(ball.x) * -1 : Math.ceil(ball.x))
                + "" + (Math.ceil(ball.y) < 0 ? Math.ceil(ball.y) * -1 : Math.ceil(ball.x));
            if (color.length !== 7)
                color + "" + Math.floor(Math.random() * 10);
			ball.color = color;
        }
		else
            ball.color = "white";
        props.ball === true && drawArc(ball.x, ball.y, ball.radius + 2, "white");
        drawArc(ball.x, ball.y, ball.radius, ball.color);
		if (props.specials && special.active)
			drawArc(special.x, special.y, special.radius, '#9c3333');
		let collAngle = 0;
		const coll = collision();
		if (coll)
		{
			let collidePoint = (ball.y - (player.y + player.height/2));
			// normalize the value of collidePoint, we need to get numbers between -1 and 1.
			// -player.height/2 < collide Point < player.height/2
			collidePoint = collidePoint / (player.height/2);
			
			// when the ball hits the top of a paddle we want the ball, to take a -45degees angle
			// when the ball hits the center of the paddle we want the ball to take a 0degrees angle
			// when the ball hits the bottom of the paddle we want the ball to take a 45degrees
			// Math.PI/4 = 45degrees
			collAngle = (Math.PI/4) * collidePoint;
		}

		// if (props.hell === true && player.height > canvas.height / 25)
		// {
		// 	player.height -= 0.01;
		// 	com.height -= 0.01;
		// }

		if (props.specials && special.active && effectCollision()) {
			special.active = false;
			console.log('effect consumed!!');
			socket.emit('consume-special');
		}

		props.socket.emit("player", {
			x: player.x,
			y: player.y,
			collision: coll,
			collAngle
		});
	}

    useEffect(() => {
		const canvas = document.getElementById('pongy') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		player.setDims(canvas.height / 4, canvas.width * 10 / 800);
		com.setDims(canvas.height / 4, canvas.width * 10 / 800);
		com.x = canvas.width - com.width;
		ball.setRadius(canvas.width * 10 / 800);
		special.radius = canvas.width * 20 / 800;
		// listening to the mouse
		canvas.addEventListener("mousemove", getMousePos);
		
		// listening to the window resize event
		window.addEventListener("resize", () => {
			GodWilling(canvas.width);
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			player.setDims(canvas.height / 4, canvas.width * 10 / 800);
			com.setDims(canvas.height / 4, canvas.width * 10 / 800);
			ball.setRadius(canvas.width * 10 / 800);
			special.radius = canvas.width * 20 / 800;
			props.socket.emit("resize", {w:canvas.width, h:canvas.height});
		});
		//change player Paddle According to Mouse Position
		function getMousePos(evt: { clientY: number, clientX: number }){
			let rect = canvas.getBoundingClientRect();
			if (canvas.width === 600 && canvas.height === 337 && player.y !== -1) {
				const posY = canvas.height - (evt.clientX - rect.left + 2); 
				if (posY < canvas.height - player.height)
					player.y = posY
			}
			else if (evt.clientY < rect.bottom - player.height && player.y !== -1)
				player.y = evt.clientY - rect.top + 2; 
			else
				return ;
		}
		props.socket.on('send_canva_W_H', () => {
			props.opData(oldata => {
				const update = {...oldata};
				update.loading = false;
				return (update);
			})
			console.log({w:canvas.width, h:canvas.height});
			props.socket.emit("startGame", {w:canvas.width, h:canvas.height, hell: props.hell, specials: props.specials});
		});

        props.socket.on('game_Data', data => {
            ball.x = data.x;
			ball.y = data.y;
			player.height = data.ph;
			com.height = data.ch;
            StartGame(canvas, ctx);
        });
		props.socket.on('special_effect', data => {
			player.x = 0;
			com.x = canvas.width - com.width;
			if (special.type === 'big_foot')
				player.y = canvas.height / 2 - player.height / 2;
			setTimeout(() => {
				special.x = data.x;
				special.y = data.y;
				special.type = data.type;
				special.active = true;
			}, 2000)
		});
		props.socket.on('activate-special', data => {
			special.type = data.type;
			special.active = false;
			if (data.type === 'big_foot') {
				if (data.role === 'opponent') {
					com.x = canvas.width / 2 - com.width / 2;
					com.y = -1;
				}
				else if (data.role === 'me') {
					player.x = canvas.width / 2 - player.width / 2;
					player.y = -1;
				}
			}
		});
		props.socket.on("playerMov", data => {
			com.y = data.y;
		});
		props.socket.on("score", data => {
			if (props.socket.id === data.soc)
			{
				player.score = data.p1;
				com.score = data.p2;
			}
			else
			{
				com.score = data.p1;
				player.score = data.p2;
			}
			player.setPos(0, canvas.height / 2 - player.height / 2);
			com.setPos(canvas.width - com.width, canvas.height / 2 - player.height / 2);
			special.type = '';
		});
    }, [])



    return (
		//w-[800px] h-[450px]
        // <canvas id="pongy" className="bg-darken-300 mx-auto rounded-md
		//  max-sm:rotate-90 max-sm:w-[600px] max-sm:h-[337px]
		//  md:w-[800px] md:h-[450px]
		//  xl:w-[1000px] xl:h-[562px]
		//  "/>
        <canvas id="pongy" className="bg-darken-300 rounded-md
			w-[90%] aspect-[16/9]
			max-sm:rotate-90 max-sm:w-[600px] max-sm:h-[337px]
			xl:w-[1000px] xl:h-[562px]
		 "/>
    );
}

/**
 * md	xl		sm
 * 800	1000	600
 * 450	562		337
 * 1.77
 */