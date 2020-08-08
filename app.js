//This is another way of writing JS code. Since we have added our script in the head section of HTML
//If you add it within the body then you need not embed your code within the DOMContentLoaded Listener
document.addEventListener('DOMContentLoaded',() => {
  const grid = document.querySelector('.grid');
  const flag = document.querySelector('.flags');
  const reset = document.querySelector('.reset');
  const head = document.querySelector('.head');
  const mySound = new sound("game-over-sound-effect.mp3")
  const myWin = new sound("Positive-game-notification.mp3")
  const gameLoop = new sound("music-loop-for-retro-style-video-games.mp3")

  let width = 10;
  let bombsAmount = 20;
  let squares = [];
  let isGameOver = false;
  let flags = 0;
  //Create Board
  function createBoard(){
    const bombsArray    = Array(bombsAmount).fill('bomb')
    const emptyArray    = Array(width*width - bombsAmount).fill('valid')
    const gameArray     = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

    reset.addEventListener('click',function(e){
      resetBoard()
    })


    for(let i=0; i<width*width; i++){
      const square = document.createElement('div');
      square.setAttribute('id', i);
      square.classList.add(shuffledArray[i])
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener('click',function(e){
        click(square)
      })

      square.oncontextmenu = function(e){
        e.preventDefault();
        addFlag(square);
      }
    }

    //Add numbers
    for(let i=0;i<width*width;i++){
      const isLeftEdge  = (i%width) === 0;
      const isRightEdge = (i%width) === width-1;
      let total = 0;
      if(squares[i].classList.contains("valid")){
        if(i>0 && !isLeftEdge && squares[i-1].classList.contains("bomb")){
          total++;
        }
        if(i>9 && !isRightEdge && squares[i - width + 1].classList.contains("bomb")){
          total++;
        }
        if(i>10 && squares[i - width].classList.contains("bomb")){
          total++;
        }
        if(i>11 && !isLeftEdge && squares[i - width - 1].classList.contains("bomb")){
          total++;
        }
        if(i<98 && !isRightEdge && squares[i + 1].classList.contains("bomb")){
          total++;
        }
        if(i<90 && !isLeftEdge && squares[i + width - 1].classList.contains("bomb")){
          total++;
        }
        if(i<88 && !isRightEdge && squares[i + width + 1].classList.contains("bomb")){
          total++;
        }
        if(i<89 && squares[i + width].classList.contains("bomb")){
          total++;
        }
        squares[i].setAttribute('data',total);

      }
    }
  }

  function addFlag(square){
    if(isGameOver){
      return;
    }
    if(!square.classList.contains("checked") && flags < bombsAmount){
      if(!square.classList.contains("flag")){
        square.classList.add('flag');
        square.innerHTML = '&#128681';
        flags++;
        flag.innerText = "FLAGS:" + flags;
        checkForWin()
      }
      else{
        square.classList.remove('flag')
        square.innerHTML = "";
        flags--;
        flag.innerText = "FLAGS:" + flags;
      }
    }
    else if(!square.classList.contains("checked") && flags == bombsAmount){
      if(square.classList.contains("flag")){
        square.classList.remove('flag')
        square.innerHTML = "";
        flags--;
        flag.innerText = "FLAGS:" + flags;
    }
  }
}

  function click(square){
    let currentId = square.id
    if(isGameOver){
       return;
    }
    gameLoop.play()
    if(square.classList.contains("checked") || square.classList.contains("flag")){
      return;
    }
    if(square.classList.contains("bomb")){
      gameOver()
    }
    else{
      let total = square.getAttribute('data')
      if(total!=0){
        square.classList.add('checked');
        square.innerHTML = total;
        square.style.borderColor = '#7e8082 #a8a4a3 #a8a4a3 #7e8082';
        return;
      }
      checkSquare(square,currentId)
      square.classList.add('checked')
      square.style.borderColor = '#7e8082 #a8a4a3 #a8a4a3 #7e8082'
    }
  }

  function checkSquare(square,currentId){
    const isLeftEdge  = (currentId%width) === 0;
    const isRightEdge = (currentId%width) === width-1;

    setTimeout(() => {
      if(currentId>0 && !isLeftEdge){
        const newId     = squares[parseInt(currentId) - 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId>9 && !isRightEdge){
        const newId     = squares[parseInt(currentId) + 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId>10){
        const newId     = squares[parseInt(currentId) - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId>11 && !isLeftEdge){
        const newId     = squares[parseInt(currentId) - width - 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId<98 && !isRightEdge){
        const newId     = squares[parseInt(currentId) + 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId<90 && !isLeftEdge){
        const newId     = squares[parseInt(currentId) + width - 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId<88 && !isRightEdge){
        const newId     = squares[parseInt(currentId) + width + 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
      if(currentId<89){
        const newId     = squares[parseInt(currentId) + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare,newId)
      }
    },10)

  }

  function gameOver(){
    isGameOver = true;
    squares.forEach((square) => {
      if(square.classList.contains("bomb")){
        square.innerHTML = "&#128163;"
      }
    })
    head.innerHTML = "YOU LOST!";
    gameLoop.stop();
    mySound.play();
  }

  //check for win
  function checkForWin(){
    let matches = 0;

    for(let i=0;i<squares.length;i++){
      if(squares[i].classList.contains("flag") && squares[i].classList.contains('bomb')){
        matches++;
      }
      if(matches === bombsAmount){
        head.innerText = "YOU WON!";
        gameLoop.stop();
        myWin.play();
        isGameOver = true;
      }
    }
  }

  function resetBoard(){
    location.reload()
  }

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}


  // Initializing the game
  createBoard()
})
