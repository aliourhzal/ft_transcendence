'use client'

import { WebsocketContext } from "@/app/context_sockets/gameWebSocket";
import { useContext, useEffect } from "react";
import Player from "../utils/Player.class";
import Ball from "../utils/Ball.class";


export default function Canvas() {
    const socket = useContext(WebsocketContext);
    const ball = new Ball();
	const player = new Player(0, 0, "#FFF")
	const com = new Player(0, 0, "#5fed55")

    function StartGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)
	{
		// draw circle, will be used to draw the ball
		function drawArc(x, y, r, color){
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}

		function drawRect(x, y, w, h, color){
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
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
		drawRect(0, 0, canvas.offsetWidth, canvas.offsetHeight, "#353D49");
		
		//draw player Paddle
		drawRect(player.x, player.y, player.width, player.height, player.color);
		//draw the oposite Paddle
		drawRect(canvas.offsetWidth - com.width, com.y , com.width, com.height, com.color);

		//draw the ball
		drawArc(ball.x, ball.y, ball.radius, ball.color);
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
		socket.emit("player", {
			x : player.x,
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
		// listening to the mouse
		canvas.addEventListener("mousemove", getMousePos);

		//change player Paddle According to Mouse Position
		function getMousePos(evt: { clientY: number; }){
			let rect = canvas.getBoundingClientRect();
			if (evt.clientY < rect.bottom - player.height)
			{
				
				player.y = evt.clientY - rect.top + 2; 
			}
			else
				return ;
		}
		socket.emit("style", {w:canvas.width, h:canvas.height});
		// socket.on("sendMe_canva_p2", ()=>{
		// 	socket.emit("style", {w:canvas.width, h:canvas.height});
		// })
		// socket.on("sendMe_canva", ()=>{
		// 	socket.emit("canva_cord", {w:canvas.width, h:canvas.height});
		// })

        socket.on('game_Data', data => {
            ball.x = data.x;
			ball.y = data.y;
            StartGame(canvas, ctx);
        });
		socket.on("playerMov", data => {
			com.x = data.x;
			com.y = data.y;
		});
    }, [])

    return (
		//w-[800px] h-[450px]
        <canvas id="pongy" className="bg-darken-300 mx-auto rounded-md
		 max-sm:rotate-90 max-sm:w-[600px] max-sm:h-[337]
		 md:w-[800px] md:h-[450px]
		 xl:w-[1000px] xl:h-[562px]
		 "/>
    );
}

/**
 * md	xl		sm
 * 800	1000	600
 * 450	562		337
 */