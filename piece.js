class Piece { // these are the hard coded tetrominoes.
  constructor(label) {  // javascript Piece constructor executes with the variable label 
    // essentially a switch case, selecting from an array or string of the letters (player.js line 3)
    if (label === 'O') {
      this.representation = [[1, 1],
                             [1, 1],];
    } else if (label === 'I') {
      this.representation = [[0, 2, 0, 0],
                             [0, 2, 0, 0],
                             [0, 2, 0, 0],
                             [0, 2, 0, 0]];
    } else if (label === 'S') {
      this.representation = [[0, 0, 0],
                             [0, 3, 3],
                             [3, 3, 0]];
    } else if (label === 'Z') {
      this.representation = [[0, 0, 0],
                             [4, 4, 0],
                             [0, 4, 4]];
    } else if (label === 'L') {
      this.representation = [[0, 5, 0],
                             [0, 5, 0],
                             [0, 5, 5]];
    } else if (label === 'J') {
      this.representation = [[0, 6, 0],
                             [0, 6, 0],
                             [6, 6, 0]];
    } else if (label === 'T') {
      this.representation = [[0, 0, 0],
                             [7, 7, 7],
                             [0, 7, 0]];
    }
  }
}

//REFERENCES TO THIS CONSTRUCTOR IN THE PROJECT

// REFERENCE 1
// player.js line 20.. initial invokation of the first tetromino
// ^^ Player{} constructor

// REFERENCE 2
// player.js line 60.. consecutive invokations of the next tetros based on collision detection.
// ^^ movedown() function

// REFERENCE 3
// player.js line 75
// putInGrid() function

// REFERENCE 4
// player.js line 98
//^^ inside of rotateGrid() function, which is nested inside of rotate() function. 

// REFERENCE 5
// player.js line 116
// ^^ inside of collide() function, whereby the tetrominoe piece is referenced in order to detect collision. collide rets tru or false based on
// tagging of the piece values, in relation to the grid, in relation to previous tetrominoe pieces which have been assigned to the grid. (its 0s and 1s to track state)

// REFERENCE 6
// player.js 143
// ^^ inside of draw(), where the piece class is referenced in order to get its shape, and draw it onto the board by selecting an origination point
// and buildiung the tetrominoe in relation to the origination point.


// ANALYSIS OF PLAYER CLASS
//  constructor(canvas) - piece class
/*
  updateTimer(deltaTime, callback)
  resetTimer()
  move(x,y)
  moveDown(callback) - piece class
  putInGrid() - piece class
  rotateGrid(grid, dir = -1) - piece class
  rotate(dir = -1)
  collide() - piece class
  resetToTop()
  get posInGridPositions()
  set posInGridPositions(val)
  draw() - piece class


*/


// FURTHER ANALYSIS OF REFERENCES
// *** note that references 1 through 6 are all object members of the Player constructor and are thus invoked through Player.X
// REFERENCE 6, the Player Constructor
// - it contains the constructor
// - reference to player in main.js line 10, 



// https://www.bdo.com/digital/insights/application-development/5-tips-organize-javascript-without-framework
// look into these kinds of JS comments that give more insight into data types, parameters, function purpose, etc.//** */