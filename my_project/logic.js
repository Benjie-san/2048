let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;


function setGame(){

   board = [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
   ];

   for(let r = 0; r < rows; r++){
      for(let c = 0; c < columns; c++){

         let tile = document.createElement("div");
         tile.id = r.toString() + "-" + c.toString();
         let num = board[r][c];

         updateTile(tile, num);

         document.getElementById("board").append(tile);
      }
   }

   setTwo();
   setTwo();

}

function updateTile(tile, num){

   tile.innerText = ""; 
   
   tile.classList.value = ""; 

   tile.classList.add("tile");

   if(num > 0) {
      tile.innerText = num.toString();
      if (num <= 4096){
         tile.classList.add("x" + num.toString());
      } else {
         tile.classList.add("x8192");
      }
   }
}

window.onload = function(){
   setGame();
};


document.addEventListener("keydown", handleSlide);

function handleSlide(e){
   // console.log(e.code);
   if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyW","KeyA","KeyS","KeyD"].includes(e.code)){
      e.preventDefault();
      
      if (e.code == "ArrowLeft" || e.code == "KeyA" ) {
         slideLeft();
         setTwo();
      } else if (e.code == "ArrowRight" || e.code == "KeyD") {
         setTwo();
         slideRight();
      } else if (e.code == "ArrowUp" || e.code == "KeyW") {
         setTwo();
         slideUp();
      } else if (e.code == "ArrowDown" || e.code == "KeyS") {
         slideDown();
         setTwo();

      }
   }

   document.getElementById("score").innerText = score;

   checkWin();

   if(hasLost()){
      setTimeout(() => {
         alert("Game Over! Game will Restart");
         alert("Click any arrow to restart");
         restartGame();
      }, 100)
   }

}

function filterZero(row){
   return row.filter( num => num != 0);
}

function slide(row){
   row = filterZero(row);

   for(let i = 0; i < row.length - 1; i++){
      if(row[i] == row[i+1]){
         row[i] *= 2;  // [4,2,2]
         row[i+1] = 0; // [4,0,2]
         score += row[i];      
      } 
   }

   row = filterZero(row); //[4, 2]

   while(row.length < columns){
      row.push(0); //[4,2,0,0]
   } 

   return row;
}
function slideLeft(){
   for(let r = 0; r < rows; r++){
      let row = board[r];
      let originalRow = row.slice();

      row = slide(row);
      board[r] = row;
      for(let c = 0; c < columns; c++){
         let tile = document.getElementById(r.toString() + '-' + c.toString());
         let num = board[r][c];
         updateTile(tile, num);
         
         if (originalRow[c] !== num && num !== 0) { 
            tile.style.animation = "slide-from-right 0.3s";
            setTimeout(() => {
               tile.style.animation = "";
            }, 300);
         }
      }
   }
}

function slideRight(){
   for(let r = 0; r < rows; r++){
      let row = board[r];
      let originalRow = row.slice();

      row.reverse();
      row = slide(row);
      row.reverse();
      board[r] = row;
      for(let c = 0; c < columns; c++){
         let tile = document.getElementById(r.toString() + '-' + c.toString());
         let num = board[r][c];
         updateTile(tile, num);

         if (originalRow[c] !== num && num !== 0) { 
            tile.style.animation = "slide-from-left 0.3s";
            setTimeout(() => {
               tile.style.animation = "";
            }, 300);
         }
      }
   }
}

function slideUp(){
   for(let c = 0; c < columns; c++){
      //named row but considered as column
      let row = [ 
         board[0][c], 
         board[1][c], 
         board[2][c], 
         board[3][c] 
      ];
      let originalRow = row.slice();

      row = slide(row);

      let changedIndices = [];
      for (let r = 0; r < rows; r++) { 
         if (originalRow[r] !== row[r]) {
            changedIndices.push(r);
         }
      }

      for(let r = 0; r < rows; r++){
         board[r][c] = row[r];
         let tile = document.getElementById(r.toString() + '-' + c.toString());
         let num = board[r][c];
         updateTile(tile, num);

         if (changedIndices.includes(r) && num !== 0) {
            tile.style.animation = "slide-from-down 0.3s";
            setTimeout(() => {
               tile.style.animation = "";
            }, 300);
         }  
      }
   }
}

function slideDown(){
   for(let c = 0; c < columns; c++){
      //named row but considered as column
      let row = [ 
         board[0][c], 
         board[1][c], 
         board[2][c], 
         board[3][c] 
      ];
      let originalRow = row.slice();

      row.reverse()
      row = slide(row);
      row.reverse();

      let changedIndices = [];
      for (let r = 0; r < rows; r++) { 
         if (originalRow[r] !== row[r]) {
            changedIndices.push(r);
         }
      }

      for(let r = 0; r < rows; r++){
         board[r][c] = row[r];
         let tile = document.getElementById(r.toString() + '-' + c.toString());
         let num = board[r][c];
         updateTile(tile, num);

         if (changedIndices.includes(r) && num !== 0) {
            tile.style.animation = "slide-from-up 0.3s";
            setTimeout(() => {
               tile.style.animation = "";
            }, 300);
         }  
      }
   }
}

function hasEmptyTile(){
   
   for(let r = 0; r < rows; r++){
      
      for(let c = 0; c < columns; c++){

         if(board[r][c] == 0){
            return true;
         }

      }

   }

   return false;

}

function setTwo(){
   if(!hasEmptyTile()){
      return;
   }

   let found = false;
   
   while(!found){
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * columns);
      // multiplied by rows and columns to be within bounds
      if(board[r][c] == 0){
         
         board[r][c] = 2;
         let tile = document.getElementById(r.toString() + "-" + c.toString());
         tile.innerText = "2";
         tile.classList.add("x2")

         found = true;
      }
   }
}

function checkWin(){
   for(let r =0; r < rows; r++){//checks for all tiles within the bored
      for(let c = 0; c < columns; c++){
         if(board[r][c] == 2048 && is2048Exist == false){
            alert('You Win! You got the 2048'); 
            is2048Exist = true; 
         } else if(board[r][c] == 4096 && is4096Exist == false) {
            alert("You are unstoppable at 4096! You are fantastically unstoppable!");
            is4096Exist = true;
         } else if(board[r][c] == 8192 && is8192Exist == false) {
            alert("Victory!: You have reached 8192! You are incredibly awesome!");
            is8192Exist = true;
         }
      }
}
}

function hasLost() {
   for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
         if (board[r][c] === 0) {
            return false;
         }

         const currentTile = board[r][c];

         if (
            r > 0 && board[r - 1][c] === currentTile ||
            r < rows - 1 && board[r + 1][c] === currentTile ||
            c > 0 && board[r][c - 1] === currentTile ||
            c < columns - 1 && board[r][c + 1] === currentTile
         ) {
            return false;
         }
      }
   }

   return true;
}

function restartGame(){
   for(let r = 0; r<rows; r++){
      for(let c = 0; c<columns; c++){
         board[r][c] = 0; // sets all tiles to zero
      }
   }
   score = 0;
   setTwo();

}