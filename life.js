var Life = function (width=32, height=32) {
  this.width = width
  this.height = height

  this.createGrid = function (width, height, value) {
    var grid = []

    for (var i = 0; i < height; i++) {
      grid.push([])
      for (var j = 0; j < width; j++) {
        grid[grid.length - 1].push(value)
      }
    }

    return grid
  }

  this.reset = function () {
    this.grid = this.createGrid(this.width, this.height, false)
    this.updates = []
  }

  this.setCell = function(x, y, state) {
    if (state == null)
      this.grid[y][x] = !this.grid[y][x]
    else
      this.grid[y][x] = state

    if (this.updates.indexOf(x.toString() + ',' + y.toString()) == -1)
      this.updates.push(x.toString() + ',' + y.toString())
  }

  this.flush = function () {
    for (var i = 0; i < this.updates.length; i++) {
      this.onUpdate.apply(this, this.updates[i].split(',').map(function (x) { return parseInt(x); }))
    }
    
    this.updates = []
  }

  this.step = function(){
    var nextUpdates = []

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {

        n = 0
        
        // count the number of neighbors
        for (var iy = -1; iy < 2; iy++) {
          for (var ix = -1; ix < 2; ix++) {
            
            if (!(iy == 0 && ix == 0)) {
              
              // normalise the cell indices (wrapping)
              rx = x + ix
              ry = y + iy

              if (rx < 0)
                rx += this.width
              else
                if (rx >= this.width)
                  rx -= this.width
              
              if (ry < 0)
                ry += this.height
              else
                if (ry >= this.height)
                  ry -= this.height
              
              if (this.grid[ry][rx])
                n += 1
            }
          }
        }

        // apply the rules
        if (this.grid[y][x]) {
          if (n < 2 || n > 3)
            nextUpdates.push([x, y, false])
        }
        else {
          if (n == 3)
            nextUpdates.push([x, y, true])
        }
      }
    }

    for (var i = 0; i < nextUpdates.length; i++) {
      this.setCell.apply(this, nextUpdates[i])
    }

    this.flush()
  }

  this.onUpdate = function(x, y) {
    console.log(x.toString() + ',' + y.toString())
  }
  
  this.reset()
}