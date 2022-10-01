class Grid {
  constructor(w, h) {
    this.grid = [];
    while (h--) {
      this.grid.push(new Array(w).fill(0));
    }
  }
  

  getPosition(x, y) {
    return this.grid[y][x]; // return either val 1-7 or 0 depending on if that particular space is taken up by a block, and the value of that block for color.
  }

  setPosition(x, y, val) {
    this.grid[y][x] = val; // set any particular position to val, which is either 0 or 1-7 depending on what type of block

  }

  sweep(callback, boolean) { // finally execute the callback function. callback is the callback function, and boolean is the boolean return value of the colliding function
    let counter = 0;
    for (let y = this.grid.length-1; y >= 0; y--) { // traverse grid height from bottom to top.
      const arr = this.grid[y]; // arr is y elements long
      
      let full = true;
      arr.forEach((val, x) => {
        if (val === 0) { // check every x coordinate for this y row and if any x is zero, then we don't have a complete tetromino layer.
          full = false;
        }
      });  // flow of execution will pass through this gate without flipping full if the player has a complete tetro layer on that
      // value of y.

      if (full) { // if full for this value of y.
        const row = this.grid.splice(y, 1)[0].fill(0); // turn that particular grid into zeros.
        this.grid.unshift(row); // shift everything above downwards.
        counter++; // increment thecounter.
      }
    }
    callback(counter, boolean); // execute the update function to finalize score
  }
}