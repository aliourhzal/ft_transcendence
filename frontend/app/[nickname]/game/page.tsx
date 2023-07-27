'use client'

import { WebsocketContext } from "@/app/context_sockets/gameWebSocket";
import Script from "next/script";
import { useContext, useEffect } from "react";
import { userDataContext } from "../layout";
import { Socket } from "socket.io-client";
import { useEffectmod } from "@/hooks/useAxiosFetch";

/*
    send via socket emit :  
        players: Y Width Height Id 
        ball:   X & Y Size
        Score
*/

export function StartGame()
{
    // declare interval ID
    let loop:NodeJS.Timer = null;

// select canvas element
const canvas:HTMLCanvasElement = document.getElementById("pongy") as HTMLCanvasElement;

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx:CanvasRenderingContext2D = canvas.getContext('2d');

// load sounds
let sound_ret: any;
let hit:HTMLAudioElement = new Audio();
let wall:HTMLAudioElement = new Audio();
let userScore:HTMLAudioElement = new Audio();
let comScore:HTMLAudioElement = new Audio();

hit.src = "../sounds/hit.mp3";
wall.src = "../sounds/wall.mp3";
comScore.src = "../sounds/comScore.mp3";
userScore.src = "../sounds/userScore.mp3";

// Ball object
ballPos.x = canvas.width/2;
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,//ball size
    velocityX : 5, //ball direction
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// User Paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#2879F2"
}

// COM Paddle
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#E8EAEB"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt: { clientY: number; }){
    let rect = canvas.getBoundingClientRect();
    if (evt.clientY < rect.bottom - user.height)
        user.y = evt.clientY - rect.top + 2; 
    else
        return ;
}

// when COM or USER scores, we reset the ball
function resetBall(){
    // console.log(ball.speed);
    ball.speed = 7;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    // ball.velocityX = -ball.velocityX;
    ball.velocityY = 5;
    ball.velocityX = 5;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
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

// update function, the function that does all calculations
function update(){
    
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if (ball.x - ball.radius < -20){
        com.score++;
        sound_ret = comScore.play();
        if (sound_ret !== undefined) {
            sound_ret.then(() => {}).catch(error => {});
        }
        resetBall();
        return ;
    }
    else if (ball.x + ball.radius > canvas.width + 20){
        user.score++;
        sound_ret = userScore.play();
        if (sound_ret !== undefined) {
            sound_ret.then(() => {}).catch(error => {});
        }
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
     
        sound_ret = wall.play();
        if (sound_ret !== undefined) {
            sound_ret.then(() => {}).catch(error => {});
        }
    }
    
    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // play sound
        sound_ret = hit.play();
        if (sound_ret !== undefined) {
            sound_ret.then(() => {}).catch(error => {});
        }
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

// render function, the function that does al the drawing
function render()
{
        // clear the canvas
        drawRect(0, 0, canvas.width, canvas.height, "#353D49");
        
        // draw the user score to the left
        drawText(user.score,canvas.width/4,canvas.height/5);
        
        // draw the COM score to the right
        drawText(com.score,3*canvas.width/4,canvas.height/5);
        
        // draw the net
        drawNet();
        
        // draw the user's paddle
        drawRect(user.x, user.y, user.width, user.height, user.color);
        
        // draw the COM's paddle
        drawRect(com.x, com.y, com.width, com.height, com.color);
        
        // draw the ball
        drawArc(ball.x, ball.y, ball.radius, ball.color);
    } 
    function game()
    {
        if (com.score === 5 || user.score === 5)
            clearInterval(loop);
        update();
        render();
    }
    // number of frames per second
    let framePerSecond = 50;
    // useEffect(()=>{
    //     console.log("hh");
    // }, [])
    // useEffectmod(ball.x, socket);
    //call the game function 50 times every 1 Sec
    loop = setInterval(game,1000/framePerSecond);
    return ;
}

export default function Game()
{
    const socket = useContext(WebsocketContext);
    const userData = useContext(userDataContext);
    console.log('test', userData);

    // this hook used to start the game and connect to the socket
    useEffect(() => {
        StartGame();

        socket.on('connect', () => {
            console.log("connected");
            // socket.emit('newMessageAsalek', 'i\'m connected');
        });
        socket.on('onMessage', (data) => {
            console.log(data);
        });
        return () => {
            socket.off('connect');
            socket.off('onMessage');
            console.log("disconnect");
        }
        }
    , []);

    let width:string = '800px';
    return (
        <section className="flex w-full h-full items-center bg-darken-200">
            <div className="flex flex-col items-center w-full gap-5">
                <div className="w-full flex justify-center gap-96">
                    <div className="flex items-center gap-x-5">
                        <img className="w-16 h-16" src="../images/man.png" alt="man_hhhh" />
                        <h2 className=" text-whiteSmoke">Ayoub</h2>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <h2 className="text-whiteSmoke">Ayoub</h2>
                        <img className="w-16 h-16" src="../images/man.png" alt="man_hhhh" />
                    </div>
                </div>
                <canvas id="pongy" className="bg-darken-300 mx-auto rounded-md " width={width} height="450px"></canvas>
            </div>
            {/* <Navbar/ > */}
            {/* <Script src="../../game-script.js" defer></Script> */}
        </section>
    );
}
