const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const finishGame = document.querySelector('.end-game')

const bird = new Image();
bird.src = '/bird.png';
bird.width = 50;
bird.height = 50;
const flappySpeed = -9;
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;  
let birdAccel = 0.48;

const pipeWidth = 50;
const pipeGap = 125;
let firsPipeX = 200;
let firsPipeY = canvas.height - 200;
let secondPipeX = 400;
let secondPipeY = canvas.height - 100;
                                        const gradient = ctx.createLinearGradient(10, 0, 220, 0);
                                        gradient.addColorStop(0, "green");
                                        gradient.addColorStop(0.5, "cyan");
                                        gradient.addColorStop(1, "green");
let score = 0;
let scoredPipe = {
    firsPipe: false,
    secondPipe: false,
}
let bestScore = 0;

 
document.body.addEventListener('keydown', (e) =>{
    e.stopPropagation();

    if(e.code == 'Space'){
        birdVelocity = flappySpeed;
    }
})

document.querySelector('.restart').addEventListener('click', () => {
    finishGame.classList.remove('end-game_open');
    restart();
})

function restart(){
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    firsPipeY = canvas.height - 200;
    firsPipeX = 200;
    secondPipeX = 400;
    secondPipeY = canvas.height - 100;
    score = 0; 
    
    loop();
}

function increase({birdX, birdY, pipeX, pipeY, scored}) {
    if (
        birdX > pipeX + pipeWidth &&
        (birdY < pipeY + pipeGap || birdY + bird.height > pipeY + pipeGap) && !scoredPipe[scored]
    ){
        score ++;
        scoredPipe[scored] = true;
    }
    if (birdX < pipeX + pipeWidth){
        scoredPipe[scored] = false
    }
}
   
function drawPipes(){
    ctx.fillStyle =gradient;
// 1 pipe
    ctx.fillRect(firsPipeX, -100, pipeWidth, firsPipeY);
    ctx.fillRect(firsPipeX, firsPipeY + pipeGap, pipeWidth, canvas.height - firsPipeY);

// 2 pipe
    ctx.fillRect(secondPipeX, -100, pipeWidth, secondPipeY);
    ctx.fillRect(secondPipeX, secondPipeY + pipeGap, pipeWidth, canvas.height - secondPipeY);

    firsPipeX -= 1.5;
    secondPipeX -= 1.5;

    if(firsPipeX < -50){
        firsPipeX = 400;
        firsPipeY = Math.random() * (canvas.height - pipeGap) + pipeWidth;
    }
    if(secondPipeX < -50){
        secondPipeX = 400;
        secondPipeY = Math.random()*(canvas.height - pipeGap) + pipeWidth;
    }
         
}
function isColapsed(){

const birdBox = {
        x: birdX,
        y: birdY,
        width: bird.width,
        height: bird.height,
    }
const firstTopPipe = {
            x: firsPipeX,
            y: firsPipeY - pipeGap + bird.height,
            width: pipeWidth,
            height: firsPipeY,
        }
const firstBottomPipe = {
            x: firsPipeX,
            y: firsPipeY + pipeGap + bird.height,
            width: pipeWidth,
            height: canvas.height - firsPipeY - pipeGap,
        }


const secondTopPipe = {
            x: secondPipeX,
            y: secondPipeY - pipeGap + bird.height,
            width: pipeWidth,
            height: secondPipeY,
        }
const secondBottomPipe = {
            x: secondPipeX,
            y: secondPipeY + pipeGap + bird.height,
            width: pipeWidth,
            height: canvas.height - secondPipeY - pipeGap,
        }

                    if(
                        birdBox.x + bird.width > firstTopPipe.x &&
                        birdBox.x < firstTopPipe.x + firstTopPipe.width &&
                        birdBox.y + birdBox.height / 2 < firstTopPipe.y
                    ){
                        return true
                    }

                    if(
                        birdBox.x + bird.width > secondTopPipe.x &&
                        birdBox.x < secondTopPipe.x + secondTopPipe.width &&
                        birdBox.y + birdBox.height / 2 < secondTopPipe.y
                    ){
                        return true
                    }

                    if(
                        birdBox.x + bird.width > firstBottomPipe.x &&
                        birdBox.x < firstBottomPipe.x + firstBottomPipe.width &&
                        birdBox.y + birdBox.height * 2 > firstBottomPipe.y
                    ){
                        return true
                    }
                    if(
                        birdBox.x + bird.width > secondBottomPipe.x &&
                        birdBox.x < secondBottomPipe.x + secondBottomPipe.width &&
                        birdBox.y + birdBox.height * 2 > secondBottomPipe.y
                    ){
                        return true
                    }
                    if(birdY < 0 || birdY + bird.height > canvas.height) return true;
     return false
} 

function endGame() {
    finishGame.classList.add('end-game_open');
    document.querySelector('.scope').innerHTML = `Score: ${score}`;
    document.querySelector('.best-scope').innerHTML = `Best score: ${bestScore} `;
    
localStorage.setItem('record', score);
if(score > bestScore){
    bestScore = localStorage.getItem('record');
} 

     

}
  
function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bird, birdX, birdY);

    drawPipes();

    if(isColapsed()){
        endGame()
        return
    }

    birdVelocity += birdAccel;
    birdY += birdVelocity;

    increase({birdX, birdY, pipeX: firsPipeX, pipeY: firsPipeY, scored: 'firsPipe'})
    increase({birdX, birdY, pipeX: secondPipeX, pipeY: secondPipeY, scored: 'secondPipe'})
    requestAnimationFrame(loop);
}
loop()