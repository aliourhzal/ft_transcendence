'use client'

import { useEffect, useRef, useState } from "react";
import Player from "../utils/Player.class";
import {Ball, Special} from "../utils/Ball.class";
import { Socket } from "socket.io-client";

export default function Canvas(props: {socket:Socket, themeN: number, ball: boolean, specials: boolean, hell: boolean, colors: any, opData: any }) {
	const [ana, GodWilling] = useState(0);
	const n = props.themeN;
    let bgColor = "#353D49";
	let color = "#50CFED";
    const ball = new Ball();
	let player = new Player(0, 0, "#2978F2");
	let com = new Player(0, 0, "#fff");
	let special = new Special(props.specials);
	const phoneSize = useRef(false);

	const net = {
		x : 0,
		y : 0,
		height : 10,
		width : 2,
		color : "WHITE"
	}

	if (n === 4)
	{
		bgColor = props.colors.bg;
		com.color = props.colors.p2;
		player.color = props.colors.p1;
	}
	if (n === 2)//theme 1988 switch colors
	{
		bgColor = "#000";
		com.color = "#FFF";
		player.color = "#FFF";
	}
	if (n === 3)
	{
		bgColor = "#FFF";
		player.color = com.color = "#000";
	}
    function StartGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)
	{
		//line in the middle of canvas
		net.x = (canvas.width - 2)/2;

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

		function drawSpecial() {
			const img = new Image();
			if (special.type === 'dwarf') {
				img.src = '/images/shortSpecial.svg';
				special.color = '#f22f0d';
			}
			else if (special.type === 'big_foot') {
				img.src = '/images/bigSpecial.svg';
				special.color = '#0df265';
			}
			ctx.beginPath();
			ctx.arc(special.x, special.y, special.radius, 0, 2 * Math.PI);
			if(player.color !== '#FFF' && player.color !== '#fff' && player.color !== 'white') {
				ctx.fillStyle = special.color;
				ctx.fill();
			}
			else {
				ctx.strokeStyle = '#fff';
				ctx.stroke();
			}
			ctx.drawImage(img, special.x - special.radius / 2, special.y - special.radius / 2, special.radius, special.radius);
		}

		function drawScore(text: number, x: number, y: number, player: boolean){
			(n === 3 ? ctx.fillStyle = "#000" : ctx.fillStyle = "#FFF")
			ctx.font = "75px fantasy";
			phoneSize.current && (x = canvas.height / 2);
			phoneSize.current && player && (y = - canvas.width / 2 + 90); player
			phoneSize.current && !player && (y = - canvas.width / 2 - 50); com
			if (phoneSize.current) {
				ctx.save();
				ctx.textAlign = 'center';
				ctx.rotate(Math.PI / 2);
				ctx.fillText(text + '', x, y);
				ctx.restore();
			}
			else
				ctx.fillText(text + '', x, y);
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
		// draw the net
		function drawNet(){
			if (n === 3)
				net.color = "#000";
			for(let i = 0; i <= canvas.height; i+=15){
				drawRect(net.x, net.y + i, net.width, net.height, net.color);
			}
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
		drawScore(player.score, canvas.width / 4, canvas.height / 5, true);
		drawNet();
		// draw the COM score to the right
		drawScore(com.score, 3 * canvas.width / 4, canvas.height / 5, false);
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
		else if (n === 4)
			ball.color = props.colors.bc;
		else if (n === 3)
			ball.color = "#000";
		else
			ball.color = "white";
        props.ball === true && drawArc(ball.x, ball.y, ball.radius + 2, "white");
        drawArc(ball.x, ball.y, ball.radius, ball.color);
		
		if (special.active && special.ready) {
			drawSpecial();
		}
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

		if (special.active && special.ready && effectCollision()) {
			special.ready = false;
			console.log('effect consumed!!');
			props.socket.emit('consume-special');
		}

		props.socket.emit("player", {
			x: player.x,
			y: player.y,
			collision: coll,
			collAngle,
			h: player.height,
			canvasH: canvas.height
		});
	}

    useEffect(() => {
		const canvas = document.getElementById('pongy') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		player.setDims(canvas.height / 4, canvas.width * 10 / 800);
		player.setPos(0, canvas.height / 2 - player.height / 2);
		com.setDims(canvas.height / 4, canvas.width * 10 / 800);
		com.setPos(canvas.width - com.width, player.y);
		ball.setRadius(canvas.width * 10 / 800);
		special.radius = canvas.width * 20 / 800;
		// StartGame(canvas, ctx);
		if (canvas.height === 337)
			phoneSize.current = true
		// listening to the mouse
		canvas.addEventListener("mousemove", getMousePos);
		
		props.socket.on("gameOver", data => {

			function drawText(text: string, x: number, y: number){
				(n === 3 ? ctx.fillStyle = "#000" : ctx.fillStyle = "#FFF");
				ctx.font = "75px fantasy";
				phoneSize.current && (x = canvas.height / 2);
				phoneSize.current && (y = -canvas.width / 2);
				ctx.textAlign = 'center';
				if (canvas.height === 337) {
					ctx.font = "45px fantasy";
					ctx.save();
					ctx.rotate(Math.PI / 2);
					ctx.fillText(text + '', x, y);
					ctx.restore();
				}
				else
					ctx.fillText(text + '', x, y);
			}
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			if (data === "draw")
				drawText("Draw !!", canvas.width / 2, canvas.height / 2);
			else if (data === props.socket.id)
				drawText("You Win !!", canvas.width / 2, canvas.height / 2);
			else
				drawText("You Lose !!", canvas.width / 2, canvas.height / 2);
		});
		// listening to the window resize event
		window.addEventListener("resize", () => {
			GodWilling(canvas.width);
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			player.setDims(canvas.height / 4, canvas.width * 10 / 800);
			com.setDims(canvas.height / 4, canvas.width * 10 / 800);
			com.x = canvas.width - com.width;
			ball.setRadius(canvas.width * 10 / 800);
			special.radius = canvas.width * 20 / 800;
			if (canvas.height === 337)
				phoneSize.current = true;
			else
				phoneSize.current = false;
		});
		//change player Paddle According to Mouse Position
		function getMousePos(evt: { clientY: number, clientX: number }){
			let rect = canvas.getBoundingClientRect();
			if (canvas.width === 600 && canvas.height === 337 && player.y !== -1) {
				const posY = evt.clientX - rect.left + 2; 
				if (posY < canvas.height - player.height)
					player.y = posY
			}
			else if (evt.clientY < rect.bottom - player.height && player.y !== -1)
				player.y = evt.clientY - rect.top + 2; 
			else
				return ;
		}
		props.socket.on('send_canva_W_H', () => {
			console.log('start game');
			props.opData(oldata => {
				const update = {...oldata};
				update.loading = false;
				return (update);
			})
			console.log({w:canvas.width, h:canvas.height});
			props.socket.emit("startGame", {w:canvas.width, h:canvas.height, hell: props.hell, specials: special.active});
		});

        props.socket.on('game_Data', data => {
			console.log(player.y);
            ball.x = canvas.height * data.x / 450;
			ball.y = canvas.width * data.y / 800;
			player.height = data.ph * canvas.height / 450;
			com.height = data.ch * canvas.height / 450;
			if (data.specials === 'effects')
				special.active = true;
            StartGame(canvas, ctx);
        });

		props.socket.on('special_effect', data => {
			player.x = 0;
			com.x = canvas.width - com.width;
			if (special.type === 'big_foot')
				player.y = canvas.height / 2 - player.height / 2;
			setTimeout(() => {
				special.x = canvas.height * data.x / 450;
				special.y = canvas.width * data.y / 800;
				special.type = data.type;
				special.ready = true;
			}, 2000)
		});

		props.socket.on('activate-special', data => {
			special.type = data.type;
			special.ready = false;
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
			com.y = data.y * canvas.height / 450;
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
			com.x = canvas.width - com.width;
			player.x = 0;
			player.y = 0;
		});
		return (() => {
			player.destructor();
			com.destructor();
			special.destructor();
			ball.destructor();
		});
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
				max-sm:rotate-[-90deg] max-sm:w-[600px] max-sm:h-[337px]
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