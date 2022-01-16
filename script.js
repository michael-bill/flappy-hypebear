var cvs = document.getElementById("cnv");
var ctx = cvs.getContext("2d");
var info = document.getElementById("goodgame");
var bear = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();

bear.src = "img/bear.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

var fly = new Audio();
var score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

var gap = 120;

var isKeyDown = false;
var ticksCount = 0;
document.addEventListener("keydown", function (event) {
    isKeyDown = true;
    ticksCount = 0;
    if (event.key == "Enter" && st) {
        st = false;
        info.innerHTML = '';
        requestAnimationFrame(draw);
    }
});

var pipe = [];

pipe[0] = {
    x: cvs.width,
    y: 0,
};

var score = 0;
var xPos = 10;
var yPos = 150;
var grav = 0.5;
var fallTime = 0;
var a = 1;

var st = false;

function draw() {
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

        pipe[i].x--;

        if (pipe[i].x == 50) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
            });
        }

        if (
            (xPos + bear.width >= pipe[i].x &&
                xPos <= pipe[i].x + pipeUp.width &&
                (yPos <= pipe[i].y + pipeUp.height || yPos + bear.height >= pipe[i].y + pipeUp.height + gap)) ||
            yPos + bear.height >= cvs.height - fg.height
        ) {
            // Lose the game
            ctx.drawImage(fg, 0, cvs.height - fg.height);
            ctx.drawImage(bear, xPos, yPos);
            lose();
            return;
        }

        if (pipe[i].x == 5) {
            score++;
            score_audio.play();
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bear, xPos, yPos);

    fallTime += 0.02;

    if (!isKeyDown) yPos += grav * fallTime + (a * fallTime * fallTime) / 2;
    else {
        yPos -= 0.7 * ticksCount + (2 * ticksCount * ticksCount) / 2;
        fallTime = 0;
        fly.play();
    }
    if (ticksCount <= 2) {
        ticksCount += 0.14;
    } else {
        isKeyDown = false;
    }

    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Score: " + score, 10, cvs.height - 20);

    if (!st) requestAnimationFrame(draw);
}
pipeBottom.onload = draw;

function lose() {
    st = true;
    info.innerHTML = "Good game! Your score: " + score + ".<br>Press the enter to continue.";
    score = 0;
    xPos = 10;
    yPos = 150;
    fallTime = 0;
    isKeyDown = false;
    ticksCount = 0;
    pipe = [];
    pipe[0] = {
        x: cvs.width,
        y: 0,
    };
}