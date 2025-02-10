//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdimg;
let bird={
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}
//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0
let topPipeImg;
let bottomPipeImg;
//game physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let gameover = false;
let score = 0;
let flapSound = new Audio("./wing.mp3");  // Bird jumps
let hitSound = new Audio("./hit.mp3");    // Collision with pipe or ground
let swooshSound = new Audio("./point.mp3"); // Passing through pipes
let dieSound = new Audio("./die.mp3");  


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
//draw bird
//context.fillStyle = "green";
//context.fillRect(bird.x,bird.y,bird.width,bird.height);
//load image
birdimg = new Image();
birdimg.src = "./flappybird.png";
birdimg.onload = function(){
context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
}
topPipeImg = new Image();
topPipeImg.src = "./toppipe.png";
bottomPipeImg = new Image();
bottomPipeImg.src= "./bottompipe.png";

requestAnimationFrame(update);
setInterval(placePipes,1500);//every 1.5 seconds
document.addEventListener("keydown",moveBird);

}

//to update the canvas to draw again and again
function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    velocityY += gravity;
   // bird.y += velocityY;
   bird.y = Math.max(bird.y + velocityY,0); //apply gravity to current bird.y
   //limit the bird to top of canvas
    //the above command is so that frames do not stack over eachother
    //bird : to draw bird over and over again
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y > board.height){
        gameover = true;
        dieSound.play();
        
    }
    //to update pipes
    for(let i = 0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; //because there are two pipes  so 0.5*3=1,1 for each set of pipe
            pipe.passed = true;
            swooshSound.play();
        }
        if(detectCollision(bird,pipe)){
            gameover = true;
            hitSound.play();
            
        }
    }
    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();//removes first element from the array
    }
    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);
    if(gameover){
        context.fillText("GameOver",5,90);
    }
}
//function to generate pipes for us
function placePipes(){
    if(gameover){
        return;
    }
    //0-1) * pipeHeight/2.
    // 0-> -128 (pipeHeight/4)
    // 1->  -128 -256(pipeHeight/4 - pipeHeight/2)= -3/4 pipeHeight //range for shifting of pipes 
    let randomPipeY = pipeY-pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width  : pipeWidth,
        height: pipeHeight,
        passed : false //to see if bird passed this pipe 
    }
    pipeArray.push(topPipe);
    let bottomPipe={
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}
function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code =="KeyX"){
        //jump
        
        velocityY = -6;
        //reset the game
        if(gameover){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameover = false;
        }
        else{
            velocityY = -6;
            flapSound.play();
        }
    }
}
function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}