'use client'

import { SetStateAction, useEffect } from "react";

/*
    send via socket emit :  
        players: Y Width Height Id 
        ball:   X & Y Size
        Score
*/

var p1Color:SetStateAction<string> = "#2879F2";


export function StartGame(props)
{
    const n = props.themeN;
    let bgColor = "#353D49";
    // declare interval ID
    let loop:NodeJS.Timer = null;
    let color = "#50CFED";

// select canvas element
    const canvas:HTMLCanvasElement = document.getElementById("pongy") as HTMLCanvasElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
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
        // ctx.strokeStyle = color;
        ctx.beginPath();
        if (n === 2)
            drawRect(x, y, ball.radius*1.5, ball.radius*1.5, color);//square ball
        else
            ctx.arc(x,y,r,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(x,y,r+5,0,Math.PI*2,true);
        // ctx.stroke();

    }

// listening to the mouse
    canvas.addEventListener("mousemove", getMousePos);

    function getMousePos(evt: { clientY: number, clientX: number }){
        let rect = canvas.getBoundingClientRect();
        if (canvas.width === 600 && canvas.height === 337) {
            const posY = canvas.height - (evt.clientX - rect.left + 2); 
            if (posY < canvas.height - user.height)
                user.y = posY
        }
        else if (evt.clientY < rect.bottom - user.height)
            user.y = evt.clientY - rect.top + 2; 
        else
            return ;
    }

// when COM or USER scores, we reset the ball
    function resetBall(){
        ball.speed = 7;
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        // ball.velocityX = -ball.velocityX;
        ball.velocityY = 5;
        ball.velocityX = 5;
        user.height = 100;
        com.height = 100;
    }

// draw the net
    function drawNet(){
        if (n === 3)
            net.color = "#000";
        for(let i = 0; i <= canvas.height; i+=15){
            drawRect(net.x, net.y + i, net.width, net.height, net.color);
        }
    }

// draw text
    function drawText(text,x,y){
        (n === 3 ? ctx.fillStyle = "#000" : ctx.fillStyle = "#FFF")
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
        // reset canvas width with the real one
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        net.x = canvas.width / 2 - 2;
        com.x = canvas.width - com.width;
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
        if (props.hell === true && user.height > canvas.height / 25)
		{
			user.height -= 0.04;
			com.height -= 0.04;
		}
        // the ball has a velocity
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        
        // computer plays for itself, and we must be able to beat it
        // simple AI
        com.y += ((ball.y - (com.y + com.height/2)))*0.13;
        
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
            drawRect(0, 0, canvas.width, canvas.height, bgColor);
            
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
            if (props.ball === true)
            {
                color = "#" +  (Math.ceil(ball.x) < 0 ? Math.ceil(ball.x) * -1 : Math.ceil(ball.x))
                    + "" + (Math.ceil(ball.y) < 0 ? Math.ceil(ball.y) * -1 : Math.ceil(ball.x));
                if (color.length !== 7)
                    color + "" + Math.floor(Math.random() * 10);
            }
            else if (n === 3)
                color = "#000";
            else if (n === 4)
                color = props.colors.bc;
            else
                color = "#FFF";
            props.ball === true && drawArc(ball.x, ball.y, ball.radius + 2, "white");
            drawArc(ball.x, ball.y, ball.radius, color);
        } 
        function game()
        {
            if (n === 4)
            {
                bgColor = props.colors.bg;
                com.color = props.colors.p2;
                user.color = props.colors.p1;
            }
            if (n === 3)
            {
                bgColor = "#FFF";
                user.color = com.color = "#000";
            }
            if (n === 2)
            {
                bgColor = "#000";
                user.color = "#FFF";
            }
            if (com.score === 1 || user.score === 1)
            {
                drawRect(0, 0, canvas.width, canvas.height, bgColor);
                (n === 3 ? ctx.fillStyle = "#000" : ctx.fillStyle = user.color)
                ctx.font = "65px fantasy";
                ctx.fillText((com.score > user.score ? "You Lost !!" : "You Win !!"),
                (canvas.width/2 - (canvas.width/4)),canvas.height/2);
                clearInterval(loop);
                return ;
            }
            update();
            render();
        }
        // number of frames per second
        let framePerSecond = 50;
        //call the game function 50 times every 1 Sec
        loop = setInterval(game,1000/framePerSecond);
        return ;
    }

export default function BotPractice(props:any)
{
    //tlat khmis jm3a

    useEffect(() => {
        StartGame(props);
    }, []);

    return (
        <section className="flex w-full h-full items-center bg-darken-200">
            <div className="flex flex-col items-center w-full gap-5">
            <canvas id="pongy" className="bg-darken-300 rounded-md
                w-[90%] aspect-[16/9]
                max-sm:rotate-90 max-sm:w-[600px] max-sm:h-[337px]
                xl:w-[1000px] xl:h-[562px]
            "/>
            </div>
        </section>
    );
}