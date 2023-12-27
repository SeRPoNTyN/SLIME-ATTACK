// var canvas = document.getElementById("canvas");

// var canvasWidth = 1920;
// var canvasHeight = 1080;
// canvas.width = canvasWidth;
// canvas.height = canvasHeight;

// var canvasContext = canvas.getContext("2d");

// canvasContext.fillStyle = "gray"
// canvasContext.fillRect(0, 0, canvasWidth, canvasHeight)

// canvasContext.fillStyle ="black";
// canvasContext.strokeStyle = "white";
// canvasContext.lineWidth = 5;
// canvasContext.beginPath();
// canvasContext.arc(150, 150, 25, 0, 2 * Math.PI);
// canvasContext.closePath();
// canvasContext.fill()
// canvasContext.stroke()

// canvasContext.strokeStyle = "black"
// canvasContext.beginPath()
// canvasContext.moveTo(150, 180)
// canvasContext.lineTo(150, 225)
// canvasContext.stroke()


// canvasContext.strokeStyle = "black"
// canvasContext.beginPath()
// canvasContext.moveTo(150, 180)
// canvasContext.lineTo(190, 200)
// canvasContext.stroke()


// canvasContext.strokeStyle = "black"
// canvasContext.beginPath()
// canvasContext.moveTo(150, 180)
// canvasContext.lineTo(110, 200)
// canvasContext.stroke()

// canvasContext.strokeStyle = "black"
// canvasContext.beginPath()
// canvasContext.moveTo(150, 225)
// canvasContext.lineTo(110, 250)
// canvasContext.stroke()

// canvasContext.strokeStyle = "black"
// canvasContext.beginPath()
// canvasContext.moveTo(150, 225)
// canvasContext.lineTo(190, 250)
// canvasContext.stroke()


// canvasContext.fillStyle = "red";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 150, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()



// canvasContext.fillStyle = "green";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 125, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()



// canvasContext.fillStyle = "yellow";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 100, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()



// canvasContext.fillStyle = "purple";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 75, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()


// canvasContext.fillStyle = "white";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 50, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()

// canvasContext.fillStyle = "black";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 25, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()


// canvasContext.fillStyle = "red";
// canvasContext.beginPath()
// canvasContext.arc(300, 300, 10, 0, 2*Math.PI);
// canvasContext.closePath()
// canvasContext.fill()



// canvasContext.fillStyle = "skyblue"
// canvasContext.fillRect(0, 0, 600, 400)


// canvasContext.fillStyle = "green"
// canvasContext.lineWidth = 5
// canvasContext.beginPath()
// canvasContext.moveTo(0, 300)
// canvasContext.lineTo(600, 300)
// canvasContext.lineTo(600, 400)
// canvasContext.lineTo(0, 400)
// canvasContext.closePath()
// canvasContext.fill()



for (let i = 0; i < 600; i += 50) {
    drawCircleForGrass(i, 325, 50)
}
canvasContext.fillStyle = "green";
canvasContext.beginPath()
canvasContext.arc(600, 325, 50, 0.5 * Math.PI, 1.5 * Math.PI);
canvasContext.closePath()
canvasContext.fill()


// canvasContext.fillStyle = "yellow";
// canvasContext.beginPath()
// canvasContext.arc(500, 100, 50, 0, 2 * Math.PI);
// canvasContext.closePath()
// canvasContext.fill()















// function drawCircleForGrass(x, y, r) {
//     canvasContext.fillStyle = "green";
//     canvasContext.beginPath()
//     canvasContext.arc(x, y, r, 0, 2 * Math.PI);
//     canvasContext.closePath()
//     canvasContext.fill()
// }


var Game = {
    width: 800,
    height: 600,
    background: "Linen"
}

var canvas = document.getElementById("canvas");



var canvasWidth = Game.width
var canvasHeight = Game.height
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var canvasContext = canvas.getContext("2d");


var Ball = {
    color: "Coral",
    x: 70,
    y: 20,
    radius: 10,
    xDirection: 5,
    yDirection: 5,
}
var Game = {
    width: 800,
    height: 600,
    background: "Linen"
}

var Platform = {
    x: 0,
    y: 450,
    width: 100,
    height: 20,
    color: "MidnightBlue",
    xDirection: 15,
    yDirection: 15,
    score: 0,
}


function increaseScore(Platform){
    Platform.score+=1
    console.log("Score: " + String(Platform.score))
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
function drawBackground() {
    canvasContext.clearRect(0, 0, 1920, 1080)

}

function drawBall() {
    canvasContext.fillStyle = Ball.color
    canvasContext.beginPath()
    canvasContext.arc(Ball.x, Ball.y, Ball.radius, 0, 2 * Math.PI)
    canvasContext.closePath()
    canvasContext.fill()
}

function platformStayLeftBorder() {
    Platform.x = 0
}
function platformStayRightBorder() {
    Platform.x = Game.width - Platform.width
}

function initEventsListeners() {
    window.addEventListener("mousemove", onCanvasMouseMove)
    window.addEventListener("keydown", onCanvasKeyDown)
}


function onCanvasMouseMove(event) {
    if (event.clientX + Platform.width >= Game.width) {
        platformStayRightBorder()
    }
    else if (event.clientX <= 0) {
        platformStayLeftBorder()
    }
    else { Platform.x = event.clientX; }
}

function onCanvasKeyDown(event) {
    if (event.key === "ArrowLeft") {
        Platform.x -= Platform.xDirection
    }
    if (event.key === "ArrowRight") {
        Platform.x += Platform.xDirection
    }
    if (Platform.x + Platform.width >= Game.width) {
        platformStayRightBorder()
    }
    if (Platform.x < 0) {
        platformStayLeftBorder()
    }
}

// function updateBall() {
//     if (getRandomInt(2)==0){
//         Ball.x -= getRandomInt(10);
//     }
//     else {Ball.x += getRandomInt(10);}
//     if (getRandomInt(2)==0){
//         Ball.y -= getRandomInt(10);
//     }
//     else {Ball.y += getRandomInt(10);}

// } 

//  || ((Ball.y > Platform.y && Ball.y < Platform.y + Platform.height) && (Ball.x + Ball.radius >= Platform.x || Ball.x - Ball.radius <= Platform.x + Platform.width))




function updateBall() {
    Ball.x += Ball.xDirection
    Ball.y += Ball.yDirection
    if ((Ball.y + Ball.radius >= Game.height) || (Ball.y - Ball.radius <= 0)) {
        Ball.yDirection = -Ball.yDirection
    }
    if ((Ball.x + Ball.radius >= Game.width) || (Ball.x - Ball.radius <= 0)) {
        Ball.xDirection = -Ball.xDirection
    }
    var platformTopLineCollision = Ball.y + Ball.radius > Platform.y;
    var platformLeftLineCollision = Ball.x + Ball.radius > Platform.x
    var platformRightLineCollision = Ball.x - Ball.radius < Platform.x + Platform.width
    var platformBottomLineCollision = Ball.y - Ball.radius< Platform.y + Platform.height
    

    if (platformTopLineCollision && platformLeftLineCollision && platformRightLineCollision && platformBottomLineCollision) {


        Ball.yDirection = -Ball.yDirection
        Ball.xDirection = -Ball.xDirection
        increaseScore(Platform)
    }




    // if (Ball.x < Platform.x+Platform.width && Ball.y > Platform.y && Ball.y<Platform.y+Platform.height && Ball.x > Platform.x){
    //     Ball
    // }


}

function drawPatform() {
    canvasContext.fillStyle = Platform.color
    canvasContext.fillRect(Platform.x, Platform.y, Platform.width, Platform.height)


}

function play() {
    drawBackground();
    drawPatform();
    drawBall();
    updateBall();
    requestAnimationFrame(play);
}
function gameLose() {
    return confirm("Game Over (Начать заново?)")
}


initEventsListeners()
play()