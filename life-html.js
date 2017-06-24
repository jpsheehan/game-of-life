
var running = false
var helping = false
var interval = null
var generation = 0
var CELL_SIZE = 8
var target_fps = 32
var SHAPE_LIST = ['rectangle', 'circle', 'random']
var shape = 'rectangle'
var life = null
var canvas = document.getElementById('life')
var ctx = canvas.getContext('2d')
var messageFadeInterval = null

canvas.addEventListener('click', function (event) {
  var x = event.pageX - canvas.offsetLeft,
      y = event.pageY - canvas.offsetTop
  
  life.setCell(parseInt(x / CELL_SIZE), parseInt(y / CELL_SIZE))
  life.flush()
})

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case ' ':
      toggleRunning()
      showMessage((running ? '': 'not ') + 'running')
      break
    case '?':
      showHelp()
      showMessage('help ' + (helping ? 'shown' : 'hidden'))
      break
    case '.':
      target_fps = target_fps * 2
      if (target_fps > 1024) {
        target_fps = 1024
        showMessage('max speed reached')
      }
      else {
        if (running) {
          clearInterval(interval)
          interval = setInterval(step, 1000 / target_fps)
        }
        showMessage('speed increased')
        updateFPSText()
      }
      break
    case ',':
      target_fps = target_fps / 2
      if (target_fps < 1) {
        target_fps = 1
        showMessage('min speed reached')
      }
      else {
        if (running) {
          clearInterval(interval)
          interval = setInterval(step, 1000 / target_fps)
        }
        showMessage('speed decreased')
        updateFPSText()
      }
      break
    case 'c':
      clearGrid()
      showMessage('grid cleared')
      break
    case 's':
      cycleShapes()
      showMessage('shape is ' + shape)
      break
    case 'r':
      reset()
      showMessage('game reset')
      break
    case '1':
      spawnGlider()
      showMessage('spawned glider')
      break
    case '2':
      spawnRPentomino()
      showMessage('spawned r pentomino')
      break
    case '3':
      spawnLightweightSpaceShip()
      showMessage('spawned lightweight spaceship')
      break
    case '4':
      spawnSwitchEngine()
      showMessage('spawned switch engine')
      break
    case '5':
      spawnBHeptomino()
      showMessage('spawned b heptomino')
      break
    case '6':
      spawnQueenBee()
      showMessage('spawned queen bee')
      break
    case '7':
      //spawnLobster()
      //showMessage('spawned lobster')
      break
  }
})

function clearGrid(){
  life.reset()

  for (var i = 0; i < life.height; i++) {
    for (var j = 0; j < life.width; j++) {
      updateCanvas(j, i)
    }
  }
}

function spawnGlider(){
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)

  life.setCell(mx, my-1, true)
  life.setCell(mx+1, my, true)
  life.setCell(mx+1, my+1, true)
  life.setCell(mx, my+1, true)
  life.setCell(mx-1, my+1, true)

  life.flush()
}

function spawnRPentomino(){
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)

  life.setCell(mx, my-1, true)
  life.setCell(mx, my, true)
  life.setCell(mx, my+1, true)
  life.setCell(mx+1, my-1, true)
  life.setCell(mx-1, my, true)

  life.flush()
}

function spawnLightweightSpaceShip(){
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)
  
  life.setCell(mx-1, my-1, true)
  life.setCell(mx-2, my, true)
  life.setCell(mx-2, my+1, true)
  life.setCell(mx-2, my+2, true)
  life.setCell(mx-1, my+2, true)
  life.setCell(mx, my+2, true)
  life.setCell(mx+1, my+2, true)
  life.setCell(mx+2, my+1, true)
  life.setCell(mx+2, my-1, true)

  life.flush()
}

function spawnLobster() {
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)

  // implement
  
  life.flush()
}

function spawnSwitchEngine() {
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)
  
  life.setCell(mx, my-1, true)
  life.setCell(mx-2, my-1, true)
  life.setCell(mx-2, my+1, true)
  life.setCell(mx-3, my, true)
  life.setCell(mx, my+2, true)
  life.setCell(mx+1, my+1, true)
  life.setCell(mx+1, my+2, true)
  life.setCell(mx+2, my+2, true)

  life.flush()
}

function spawnBHeptomino() {
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)
  
  life.setCell(mx, my, true)
  life.setCell(mx, my+1, true)
  life.setCell(mx-1,my, true)
  life.setCell(mx-1, my-1, true)
  life.setCell(mx+1, my, true)
  life.setCell(mx+1, my-1, true)
  life.setCell(mx+2, my-1, true)
  
  life.flush()
}

function spawnQueenBee() {
  var mx = parseInt(life.width / 2),
      my = parseInt(life.height / 2)
  
  life.setCell(mx-1, my, true)
  life.setCell(mx-1, my-1, true)
  life.setCell(mx-1, my+1, true)
  life.setCell(mx-2, my-2, true)
  life.setCell(mx-2, my-3, true)
  life.setCell(mx-2, my+2, true)
  life.setCell(mx-2, my+3, true)
  life.setCell(mx, my-2, true)
  life.setCell(mx, my+2, true)
  life.setCell(mx+1, my+1, true)
  life.setCell(mx+1, my-1, true)
  life.setCell(mx+2, my, true)

  life.flush()
}

function showHelp() {
  if (helping) {
    document.getElementById('help').style.opacity = 0
    helping = false
  }
  else {
    document.getElementById('help').style.opacity = 1
    helping = true
  }
}

function updateGenText() {
  document.getElementById('generation').innerText = generation.toString()
}

function updateFPSText() {
  document.getElementById('fps').innerText = target_fps.toString()
}

function init() {
  life = new Life(parseInt(window.innerWidth / CELL_SIZE) - 1, parseInt(window.innerHeight / CELL_SIZE) - 1)

  canvas.width = life.width * CELL_SIZE
  canvas.height = life.height * CELL_SIZE
  canvas.style.backgroundColor = 'black'

  document.body.style.marginLeft = parseInt((window.innerWidth - life.width * CELL_SIZE) / 2).toString() + 'px'

  document.body.style.marginTop = parseInt((window.innerHeight - life.height * CELL_SIZE) / 2 - 1).toString() + 'px'

  life.onUpdate = updateCanvas

  reset()
}

function cycleShapes() {
  var i = SHAPE_LIST.indexOf(shape) + 1

  if (i == SHAPE_LIST.length) {
    i = 0
  }

  shape = SHAPE_LIST[i]
}

function updateCanvas(x, y, forceShape=false) {
  var state = life.grid[y][x]

  var thisShape = forceShape || shape

  if (state) {
    ctx.fillStyle = 'rgb(238, 238, 238)'
    // consider switch
      if (thisShape == 'rectangle') {
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
    else if (thisShape == 'circle') {
      var cx = x * CELL_SIZE + CELL_SIZE / 2,
          cy = y * CELL_SIZE + CELL_SIZE / 2
      
      ctx.beginPath()
      ctx.arc(cx, cy, CELL_SIZE / 2, 0, 2 * Math.PI, false)
      ctx.fill()
    }
    else if (thisShape == 'random') {
      updateCanvas(x, y, SHAPE_LIST[Math.floor(Math.random() * SHAPE_LIST.length) - 1])
    }
  }
  else {
    ctx.fillStyle = 'rgb(17, 17, 17)'
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
  }
}

function toggleRunning() {
  if (running) {
    running = false
    clearInterval(interval)
  }
  else {
    running = true
    interval = setInterval(step, 1000 / target_fps)
  }
}

function step() {
    generation++
    life.step()
    updateGenText()
}

function reset() {
  generation = 0
  target_fps = 32

  updateFPSText()
  updateGenText()

  shape = 'rectangle'

  running = false
  helping = true
  showHelp()

  clearInterval(interval)

  clearGrid()

  spawnGlider()
}

function showMessage(message) {
  const elem = document.getElementById('message')

  elem.innerText = message
  elem.style.opacity = 1.0

  clearInterval(messageFadeInterval)
  messageFadeInterval = setInterval(function(){
    clearInterval(messageFadeInterval)
    elem.style.opacity = 0.0
  }, 1000)
}

init()