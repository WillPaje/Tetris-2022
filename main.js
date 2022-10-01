// key classes
// Player
// Piece
// Grid
// Vec 2

// Player extends Piece
// Player extends Grid
// Player extends Vec2

/* 
 Main: execution summary

 {declare variables} --> {const, let variables, and constructor is executed}

 {declare time keeper & composer body} --> 

 {timekeeper composer execution}

 {declare user controls} 

 {declare top scope callback function} 
 */


window.onload = function() { 
  //awd
  
  
  // CONSTS AND LETS
  
  // the first thing main does is execute the initialization of constants and lets on load.
  const game = document.getElementById('game'); // we need to tie the html canvas element to js variable game
  let score = 0; // we need a counter to track score. it needs to be made through let so that every function or loop execution doesn't take the end state, and 
  // each instance that it occurs in the javascript programs, it is a unique instance. specifically why this does this, Im not exactly privy, I need a deeper understanding of jaavascript declarations and how that regards the actual data structure
  const scoreElt = document.getElementById('score'); // we need to tie the html span that displays structure of 
  // the score state to the player, to a usable javascript constant
  let level = 1; // same as score.
  const levelElt = document.getElementById('level');  // we nned to tie the structural output reflecting the level state to the user.
  const context = game.getContext('2d'); // running [html object]--{Js variable} => getContext('2d'); runs the heavy lifting that allows for grid management
  // in this way, context is turned into a class with functions such as clearRect() and etc.
  const player = new Player(game); // so upon loading of the window, the player is initialized along with all its members, including
  // piece class and all its members
  let lastTime = 0;
 

  // TIME KEEPER


  function update(time = 0) { // this is the true time keeper function, or time engine. a function with functions. II function.
    
    // it also appears to be a recursive function with no end case.
    context.clearRect(0, 0, game.width, game.height); // clear the board data (from a prior game) 
    // clearRect is a built in function of getContext()
    // game is the html element. game.width is the hardcoded value for width in the canvas element in 
    // index.html width is the html attribute name.
    
    const deltaTime = time - lastTime; 
    // every time keeper utilizes the concept of deltaTime. The nature of the time keeper uses time - lastTime,
    // which are essentially two consequent recursive executions of requestAnimationFrame to get a time value from the CPU,
    // and subtracts on from the other (the later time stamp minus the earlier time stamp.) which in our case has a 16 millisecond
    // the composer recurses over and over, keeping a running sum of zero plus deltatime plus deltatime, etc.
    // until such time that the sum reaches 1000. 
    // the beauty is that the function takes about 60 or so executions which is approximately 1 second.
    // initialize deltaTime, in which time is zero or time elapsed, 
    // and lastTime is zero or time elapsed from the parent execution.
    // console.log(deltaTime);
    player.draw();  // trigger the draw function, as it is a member of the player object.
    player.updateTimer(deltaTime, callback); // (var, func) {stuff}
    /*
    console.log(time);
    console.log("gap: time above [^] last time below [v]");
    console.log(lastTime);
    console.log("delta time below [v]");
    console.log(deltaTime); */
    lastTime = time; // in which time is either zero or time elapsed.
    requestAnimationFrame(update); // this is quite confusing, but essentially the requestAnimationFrame executes update() in a way where it passes 
    // a value into the variable time that is reflective of total elapsed time.
  } 

  update();

  // PLAYER CONTROLS

  window.onkeydown = event => { // controls
    if (event.code === 'ArrowLeft') {
      player.move(-1, 0);
    } else if (event.code === 'ArrowRight') {
      player.move(1, 0);
    } else if (event.code === 'ArrowDown') {
      player.moveDown(callback);
    } else if (event.code === 'ArrowUp') {
      player.rotate();
     // alert("pause");
    }
  }

  // creatively named callback function 
  // it updates the score
  function callback(counter, colliding) { // trigger at line 20 and line 34. it appears that the purpose of this function is to
    // update the score, and activate score related events.
    // it is passed as the second param to updateTimer, and it appears its' use is for updating the score.
    // i suspect that it may have been misprogrammed, because it appears to be used as if it has a return value?
    // but it only seems sensible if callback. is meant to activate at certain points..
    // yes, it appears that this callback function is not working as it appears to have been intended to work
    // bringing this function back to working order would add a feature to the game and improve the code.
    // note, the error has been fixed. this execution context has no access to canvas but can access the same data by using game.
    score += counter;
    //console.log(score);
    if (score > 4) {
      alert("level up!! The screen has been cleared!");
      score = 0;
      level++;
      player.grid = new Grid(game.width / 50, game.height / 50); // *** error, game does not know what canvas is
    }
    if (colliding) { // this is the game over case.
      score = 0;
    }
    scoreElt.innerHTML = score;
    levelElt.innerHTML = level;    
  }
}