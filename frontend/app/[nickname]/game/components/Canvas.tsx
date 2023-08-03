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
		//clear canvas
		drawRect(0, 0, canvas.width, canvas.height, "#353D49");
		
		
		//draw player Paddle
		drawRect(player.x, player.y, player.width, player.height, player.color);
		//draw the oposite Paddle
		drawRect(canvas.width - com.width, com.y , com.width, com.height, com.color);

		//draw the ball
		drawArc(ball.x, ball.y, ball.radius, ball.color);
		socket.emit("player", {x : player.x, y: player.y});
	}

    useEffect(() => {
		const canvas = document.getElementById('pongy') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
        socket.on('game_Data', data => {
            ball.x = data.x;
			ball.y = data.y;
            StartGame(canvas, ctx);
        });
		socket.on("playerMov", data => {
			com.x = data.x;
			com.y = data.y;
			console.log(com.x, com.y);
		});
    }, [])

    return (
        <canvas id="pongy" className="bg-darken-300 mx-auto rounded-md " width="800px" height="450px"/>
    );
}