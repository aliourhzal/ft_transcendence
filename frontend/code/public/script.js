const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const FPS = 60;
const radius = 2;
let x = 200;
let y = 300;
let xSpeed = 1;
let ySpeed = 2;

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = "#0c90f2";
    context.fill();
}

function update() {
    x = x + xSpeed;
    y = y + ySpeed;

    const isCollidingWithRightSide = (x + radius >= canvas.width);

    if (isCollidingWithRightSide) {
        x = canvas.width - radius;
        xSpeed = -xSpeed;
    }

    const isCollidingWithLeftSide = (x - radius <= 0);

    if (isCollidingWithLeftSide) {
        x = 0 + radius;
        xSpeed = -xSpeed;
    }

    const isCollidingWithBottomSide = (y + radius >= canvas.height);

    if (isCollidingWithBottomSide) {
        y = canvas.height - radius;
        ySpeed = -ySpeed;
    }

    const isCollidingWithTopSide = (y - radius <= 0);

    if (isCollidingWithTopSide) {
        y = 0 + radius;
        ySpeed = -ySpeed;
    }
}

function animate() {
    clear();
    draw();
    update();
}

window.setInterval(animate, 1000 / FPS);