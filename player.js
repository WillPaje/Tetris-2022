class Player { // the player constructor takes the parameter of canvas, 
  // wherein canvas is a javascript reference to the HTML canvas element.
  constructor(canvas) {
    this.PIECE_POOL = 'OISZLJT'; // this is that array. OISZLJT

    this.COLORS = [
      null,
      'yellow',
      'cyan',
      'red',
      'green',
      'orange',
      'hotpink',
      'purple'];

    this.SIZE = 50;

    this.canvas = canvas;

    this.context = canvas.getContext('2d');

    this.position = new Vec2(canvas.width / 2 - this.SIZE, 0); // (int, int)  // canvas.width = 500, canvas.width/2 = 500/2 = 250, this.SIZE = 50. 250 - 50 - 200.
    /**
     * @param Vec2 the first param is 200. this is to position the tetris piece at the top of the screen . 
     * // this datatype maintains the position state
     */ // so essentially the constructor call is Vec2(200, 0);
     // remember that position is vec2 basically.
    const index = Math.random() * this.PIECE_POOL.length; // | 0; 
    this.piece = new Piece(this.PIECE_POOL.charAt(index)); //initialize that this object, player, carries a component 
    // that is of the type piece.js, and takes from the constructor declaration in piece.js. // note that index was declared at line 20.
    this.timer = 0; // time state
    this.interval = 1000;
    this.grid = new Grid(canvas.width / this.SIZE, canvas.height / this.SIZE);
  }

  updateTimer(deltaTime, callback) { // this is a component of the greater clock function, or, time engine. essentially it has to fire off every set
    // amount of time, and each time it fires, it essentially needs to shift the tetromino (the piece object) down 1 block.
    this.timer += deltaTime; // so, timer is declared and assigned eachtime updateTimer is run, which is every time update is run.
    if (this.timer > this.interval) {
      this.moveDown(callback); // remember the piece.x reference 2 in player.js? 
    }
  }

  resetTimer() { // call every tick or on every movedown
    this.timer = 0;
  }

  move(x, y) { // the mechanical switch flipper that takes by reference and actually increments the graph position
    // on arrow left, x is -1. on arrow right, x is 1
    this.position.x += x * this.SIZE;   // in which position is the Vec2 datatype (we can think of classes as programmer defined composite data types)
    // right hand assignment is either... 1 * 50 or -1 * 50, thus, 50 or -50.
    // and thus position.x is either incremented by 50 (on right arrow press) or decremented by 50 (left arrow press)
    //console.log("DO MOVEMENT");
    if (this.collide()) { // this detects the horizontal collision and corrects it to simulate the blocking effect.
      console.log("move collision");
      this.position.x -= x * this.SIZE; // this is an inversion of logic that runs counter to the execution of line 45.
      // its for position correction in the event of a collision,
      // in order that a tetrominoe doesnt phase into a wall or into another tetris piece, 
      // the would be left movement is countered by a right movement mid function so that to the player, it appears that no movement has taken place
      // when in fact, you could say that "two" "movements" have taken place instantaneously.
      // a would be right movement is countered by a left movement mid function so that to the player, it appears that no movement has taken place.
      // so, the right hand assignment is either decremented by 50 (on right arrow press) or incremented by 50 (on left arrow press)
      //console.log("UNDO MOVEMENT");
    }

    this.position.y += y * this.SIZE;
    //if (this.collide()) {
      //this.position.y -= y * this.SIZE*5;
    //}
  }

  moveDown(callback) { // call back is essentially whatever is passed as the 2nd param to updateTimer() function,
    // this 2nd param is actually a callback function declared in main.js, which is just called to execute each time it is passed.
    let colliding = false;

    this.resetTimer(); // every time the movedown function is executed, set time to zero,
    // calling reset timer in this manner causes it to execute on the object in context, and
    // this sets that objects timer to 0.
    this.move(0, 1); // note we move the piece before we check for collide. the chase theory. also, think about the error where the piece falls under the ground.
    if (this.collide()) { // we check for a collide. whats the first collide? the first collide is when the piece actually passes 1 block below the floor
      console.log("mylog");
      this.move(0, -1); // and when we find the first collide, we reverse the movement sending it to the floor.
      this.putInGrid();
      this.resetToTop();

      const index = Math.random() * this.PIECE_POOL.length | 0;
      this.piece = new Piece(this.PIECE_POOL.charAt(index)); // upon the detection of collision, immediately create another tetris object
      // and thus, invoke the piece constructor again.
    
      if (this.collide()) { // not sure what this is. perhaps it's a second check for a collision, which is nevessary for whatever reason?
        colliding = true; // ^^ perhaps, once the next tetromino is created, it's collision must be watched for again?
        this.grid = new Grid(this.canvas.width / this.SIZE, this.canvas.height / this.SIZE);
        console.log("NEW GAME"); // hold on.. is this the game over case?
        // the case in which a new tetrominoe is spawned but is immediately touching the top stack when the player
        // has ran out of room and thus ending the game?
      }
    }
    this.grid.sweep(callback, colliding);
  }

  putInGrid() { // essentially target the x and y coordinates if the piece on the board and set those values to the value of the tetromino block.
    // its kind of like we want to stamp the tetromino piece into the board before resetting its position,
    // since there acan only be 1 active player piece and we wannt to make it appear as if the piece had really hit the ground and stayed there.
    this.piece.representation.forEach((arr, y) => {
      arr.forEach((val, x) => {
        if (val !== 0) {
          this.grid.setPosition(x + this.posInGridPositions.x, y + this.posInGridPositions.y, val);
        } // still dont exactly understand posInGridPositions.x
      });
    });
  }

  rotateGrid(grid, dir = -1) {

    console.log(dir);
    grid.forEach((arr, y) => { // rotation is done by swappping x and y.
      for (let x = 0; x < y; x++) {
        [grid[x][y], grid[y][x]] = [grid[y][x], grid[x][y]];
        // first iteration does literally nothing. where y is zero and x is 0
        // 2nd iteration where y is zero and x is 1.
      }
    });
    

    if (dir === -1) { // if dir is -1, which it appears to be every single time...EDIT, no, in the even of offset > first row length, dir is negged.
      // thus inverting the logic
      grid.forEach(arr => arr.reverse()); // flip each row within the tetromino. we need to flip each row because the result of the previous swap
      // is that the tetromino is now mirrored. reversing it will mirror the mirrored state, in essence it undoes the mirroring
      // and it completes the illusion of the tetromino piece rotating.
    } else if (dir === 1) { // if dir is 1, then it means that the tetromino is somewhere where it cannot rotate.
      // however, the x's and y's have been swapped already at this point, so we introduce this reversal to undo the effect
      // mid tick, so that to the player, it appears as if their tetromino is not rotating.
      // in reality, the state did actually change, but it was changed back before any difference could be caught and rendered by the update->draw
      // execution.
      grid.reverse(); // pretty sure this can be proven mathmatically, since it is observationally true, but reversing the swap actually undoes it somehow.
    }
  }

  rotate(dir = -1) {
    const position = this.position.x; // save initial position
    let offset = 1;
    console.log("rotate root layer offset: ", offset );
    this.rotateGrid(this.piece.representation, dir); // essentially reference the values of the tetrominoe for the rotation effect.
    
    // out here, offset is always 1.

    while (this.collide()) { // while collision is true in the context 
      console.log("while loop entry point offset: ", offset);
      //this.position.x += offset; // increment x position by 1, then -2, then 3, then -4, then 5, not sure why.. I commented it out and tetris still works.
      offset = -(offset + (offset > 0 ? 1 : -1)); // ternary operator //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
      // how this ternary operator works is it takes the expression offset > 0, and if it's true, return 1, and if it's not true, return -1.
      // so essentially -(offset plus or minus 1).
      // so basically this is.. an inverter for offset. EDIT: after closer inspection, this is not true.
      // this logic appears to rubber band offset back and forth until it is greater than representation length.
      if (offset > this.piece.representation[0].length) {  // for the case in which a player tries to rotate the piece while next to a wall, 
        // it offsets the piece by 1 to prevent non ideal behaviour in game
        
        console.log(" this.piece.representation[0].length is : ", this.piece.representation[0].length);
        
        this.rotateGrid(this.piece.representation, -dir); // this is the code that corrrects the prior rotate, by sending inverted logic.
        this.position.x = position; // return initial position.
        return;
      }
    }
  }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  collide() { // for collision detection.
    let collision = false; // boolean gate variable, assumedly false.
    var yip;
    this.piece.representation.forEach((arr, y) => {
      //console.log(arr); // forEach((element, index) => // for the context of the player piece in action, enter array 1 step
      //console.log("break");
      arr.forEach((val, x) => { // advance down another step into the structure of the 2d array
        
        if (val !== 0 && (this.grid.grid[y + this.posInGridPositions.y] && this.grid.getPosition(x + this.posInGridPositions.x, y + this.posInGridPositions.y)) !== 0) {
               
// PROOF ::: UNDEFINED && TRUE RETURNS UNDEFINED. UNDEFINED !== 0 RETURNS TRUE. remember
          // if (this.grid.grid[y + this.posInGridPositions.y] && this.grid.getPosition(x + this.posInGridPositions.x, y + this.posInGridPositions.y))
               // if val !== 0 && (arr[] && function(param1, param2)) === 0.
               //question... <-- is this always undefined? // and if grid.grid [iterative y + position in grid as value y] exists, or is not zero. grid.grid references a 2d value i think.
          collision = true;  // and if this getPosition(x,y) is not zero.
          console.log("collision~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          console.log("x pos :", this.posInGridPositions.x);
          console.log("y pos: ", this.posInGridPositions.y);
          console.log("x at col :", x);
          console.log("y at col :", y);
          console.log("x together :", x + this.posInGridPositions.x);
          console.log("y together :", y + this.posInGridPositions.y);
          console.log("grid.grid[y location] :", this.grid.grid[y + this.posInGridPositions.y]);
          console.log("val :", val);
          /*
          if(yip !== 0) {
            alert("yeet"); <<<<<---- proof of proof
          }*/
        } /*else {
          console.log("non collision");
        console.log("x pos :", this.posInGridPositions.x);
        console.log("y pos: ", this.posInGridPositions.y);
        console.log("x at col :", x);
        console.log("y at col :", y);
        console.log("x together :", x + this.posInGridPositions.x);
        console.log("y together :", y + this.posInGridPositions.y);
        console.log("grid.grid[y location] :", this.grid.grid[y + this.posInGridPositions.y]);
        console.log("val :", val);
        } // then we have a collision. */
  
      });
    });
    return collision; // THATS IT!!! I THINK I JUST FIGURED OUT HOW COLLISSION WORKS!!!!!
    // THE CHECK FOR COLLISION IS TIED TO THE CLOCK. BLOCK MOVEMENT IS TIED TO THE CLOCK. THE THREE CROSSHAIRS NEED TO LINE UP IN ORDER TO REGISTER A COLLISION EVENT.
    // THE OTHER TWO ARE USUALLY LINED UP, BUT THE THIRD IS GRID GRID Y, AND GRID GRID Y HAS AN INITIAL CASE!!!! THAT IS, AT FIRST IT RETURNS NOT ZERO WHEN IT CATCHES UP WITH THE TETRIS PIECE!!!
    // THE FIRST COLLISION IS INHERENT BECAUSE THE CONDITIONAL IS ONE STEP BEHIND THE TETRIS PIECE, AND IS PRACTICALLY CHASING IT DOWN THE BOARD.
    // BASICALLY WHEN THE FIRST TETRIS PIECE HITS THE BOTTOM, THE CONDITIONAL CATCHES UP WITH IT AND REGISTERS THE FIRST COLLISION BECAUSE
    // 16 IS ALWAYS UNDEFINED AND UNDEFINED SATISFIES THE CONDITIONAL!!!!!! WHY???? BECAUSE 16 IS OUT OF RANGE!!!!!
    // THE INITIAL CASE FOR THE FIRST COLLISION IS ESSENTIALLY THE COLLISION HAPPENS WHEN GRID GRID Y HITS 16!!!!!!
    // UNDEFINED SATISFIES THE CONDITIONal BECAUSE UNDEFINED IS NOT THE SAME VALUE OR TYPE AS ZEROOOOOO AAGAGAGAGGHAGH
  }

  resetToTop() {
    this.position = new Vec2(this.canvas.width / 2 - this.SIZE, 0);
  }

  // https://www.programiz.com/javascript/getter-setter

  // since get and set are both written, they both execute each tim posigp is called

  get posInGridPositions() { // accessor property getter.
    // run the vec2 constructor and within the return parameters, access the values for [this] - the context of the player element.
    // within this context, we want position, which we know to be the variable to reference the vec2 class of player.
    // we want position.x as that is the extensions that access the recorded position values of vec2. 
    //console.log("GETTER");
    return new Vec2(this.position.x / this.SIZE, this.position.y / this.SIZE);
    
    // ironically, this get actually sets with its' gets.
  }

  /*  the setter did not appear to even run at ay point during tetris, so I commented out this code,
   and tetris still functions as it should, so I am going to leave this commented out, since I don't know what it does
   and at the same time it appears to do nothing.
  set posInGridPositions(val) { // accessor property setter
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
    // keyword set.. [set] [function declaration] [(parameter)]
    // so, set posInGridPosition as a setter method of Player
    // it references the position, i.e. the vec2 component of player,
    // in the vec2 component of player, it references its' x and y values and assigns them to x and y values of another vec2, known as val.
    this.position.x = val.x * this.SIZE; // in which val is a vec2
    this.position.y = val.y * this.SIZE; 
    console.log("SETTER");
  } */

  draw() { // for rendering the tetrominoe data into the visual representation.

    this.context.save();  // why we do this, I don't know. // EDIT: this is to save the default state of context datatype


    // so the piece needs to appear as if it is falling down from the top of the screen, and it needs to move when the player moves it
    // and not do weird stuff like disappear, float in the air, get stuck, or go diagonally.
    this.piece.representation.forEach((arr, y) => {  // is (arr, y) an anonymous func? forEach(anonymous func)
      // entering the context of piece.representation, where we have 2d arrays with numbers that imply colors.
      arr.forEach((val, x) => { // entering the context of the individual tetro squares, accessed by vec2 under js variable position,
        // in which js variable position represents the corresponding member of player object instance.
        // we are iterating through the values of the 2D array seen in piece.js
        if (this.COLORS[val] !== null) {
          this.context.fillStyle = this.COLORS[val]; // set the color we will color the square of the tetromino with
          //console.log(this.COLORS[val]);
          const rectX = this.position.x + x*this.SIZE;
          const rectY = this.position.y + y*this.SIZE;
          this.context.fillRect(rectX, rectY, this.SIZE, this.SIZE);
        } 
      });
    }); // note: piece.representation is the specific player piece.
    
    // so for a split second after a piece hits the ground, the board is cleared. now, mid execution, we need to redraw the board, so
    // that to the player, it appears as if the pieces remain where they hit the ground. that is where this function comes in.
    this.grid.grid.forEach((arr, y) => { // this.grid.grid ??? for the grids inside the grid? i.e, the tetros?
      // well I suppose since piece.representation is the name of the structure,,
      // and since representation is a component of piece,
      // and in the class implementation of grid, grid is referenced as a component,
      // so in order to catch that context, you would actually have to type this.grid.grid just like how
      // you would have to type this.piece.representation.
      arr.forEach((val, x) => {
        
        //this.context.shadowColor = "#" + ((1<<24)*Math.random() | 0).toString(16);
        this.context.shadowBlur = 5;
        this.context.lineJoin = 'bevel';
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'white';
        this.context.strokeRect(x*this.SIZE, y*this.SIZE, this.SIZE, this.SIZE);
        if (this.COLORS[val] !== null) {
          this.context.fillStyle = this.COLORS[val]; // select the colo
          //console.log(this.COLORS[val]);

          const rectX = x*this.SIZE; // set the rightward bound of the color
          const rectY = y*this.SIZE; // set the downward bound of the color
          // no need to worry about coding the proper positioning from this window of the structure,
          // we are already at the correct position because we are 
          // traversing through y (row by row), and traversing through x (and through each row) for every y.
          this.context.fillRect(rectX, rectY, this.SIZE, this.SIZE);
          

        } 
      });
    }); // note: grid.grid is the rest of the tetris grid besides the player tetro,
    //  that is, the black space and space occupied by previous tetro pieces.

    this.context.restore(); // this is to restore to default context of datatype. For all I know, this is done in order to change the
    // context.fillStyle back to black, which is its default color.
    // more info at https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save#drawing_state
  }
}