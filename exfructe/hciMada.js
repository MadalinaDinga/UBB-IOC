//Loads up the game
function goBackMeniu(){
    location.href="./../meniu/proiect.html";    }

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0];

var x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

var width = 812,//x - 160,
    height = 502;//y - 160;

var currentPosition; 

var N = 1 << 0, 
    S = 1 << 1,
    W = 1 << 2,
    E = 1 << 3;
 
	var body = document.querySelectorAll('body');
	
	replay = d.getElementsByClassName('replayImg');
	replay.onclick = function() {refresh()};
	
	function refresh() {
        window.parent.location = window.parent.location.href;
    }

    var layout = [],
        fronteirTest = [];
// Determines the size of the blocks 
    var cellSize = 60,
        cellSpacing = 8,
        cellWidth = Math.floor((width - cellSpacing) / (cellSize + cellSpacing)),
        cellHeight = Math.floor((height - cellSpacing) / (cellSize + cellSpacing)),
        cells = new Array(cellWidth * cellHeight), // each cell’s edge bits
        frontier = [];

    var maxY = Math.floor((height - cellSpacing) / (cellSize + cellSpacing)) - 1,
        maxX = Math.floor((width - cellSpacing) / (cellSize + cellSpacing)) - 1;

	var img = document.createElement("img");
	var divForPruna = document.createElement("div");
	
	divForPruna.appendChild(img);
	
	img.setAttribute("src", "prune.png");
	//img.setAttribute("src", "strugure.jpg");
	img.setAttribute("position","relative");
	img.setAttribute('z-ndex', "999");
	img.setAttribute("width", '40px');
    img.setAttribute("height", '40px');
	img.setAttribute("margin-left", '100px');
	
	body[0].appendChild(img);
	
	//maze
    var canvas = document.createElement('canvas');
	
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    body[0].appendChild(canvas);

    var context = canvas.getContext("2d");

    context.translate(
        Math.round((width - cellWidth * cellSize - (cellWidth + 1) * cellSpacing) / 2),
        Math.round((height - cellHeight * cellSize - (cellHeight + 1) * cellSpacing) / 2)
    );

	//balls
    var canvas2 = document.createElement('canvas');

    canvas2.setAttribute("id", "canvas2");
    canvas2.setAttribute("width", width);
    canvas2.setAttribute("height", height);

	//body[0].appendChild(img);
	var mazeWithBalls = body[0].appendChild(canvas2);
	//mazeWithBalls.appendChild(img);

    var game = canvas2.getContext("2d");

    game.translate(
        Math.round((width - cellWidth * cellSize - (cellWidth + 1) * cellSpacing) / 2),
        Math.round((height - cellHeight * cellSize - (cellHeight + 1) * cellSpacing) / 2)
    );

	//color of the maze
	
	var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, width-115, 5, 50, 60);
		//context.setAttribute("overflow-x", 'visible');
      };
	  imageObj.src = 'prune.png';
	  imageObj.setAttribute("position", 'absolute');
	  //imageObj.setAttribute("height", '40px');
	  
	context.fillStyle = "#FFFF00";//00ffff";

    // Add a random cell and two initial edges.
    var start = (cellHeight - 1) * cellWidth;
    cells[start] = 0;
    fillCell(start);
    frontier.push({
        index: start,
        direction: N
    });
    frontier.push({
        index: start,
        direction: E
    });

    // Explore the frontier until the tree spans the graph.
    function run() {		
        var done, k = 0;
        while (++k < 50 && !(done = exploreFrontier()));
        return done;
    };

    function exploreFrontier() {

        if ((edge = popRandom(frontier)) == null) {
            layout.push({x: 0, y: maxY, d1: 0, d0: 0})
            for (var i = layout.length - 1; i >= 0; i--) {
              if(layout[i].x === 0 && layout[i].y === maxY) {
                drawPlayer(layout[i]);
              }
            };
            return true;
        }

        var edge,
            i0 = edge.index,
            d0 = edge.direction,
            i1 = i0 + (d0 === N ? -cellWidth : d0 === S ? cellWidth : d0 === W ? -1 : +1),
            x0 = i0 % cellWidth,
            y0 = i0 / cellWidth | 0,
            x1,
            y1,
            d1,
            open = cells[i1] == null, // opposite not yet part of the maze
            north,
            east,
            south,
            west;
	// makes the maze color
        context.fillStyle = open ? "#FFFF00": "transparent";
        if (d0 === N) fillSouth(i1), x1 = x0, y1 = y0 - 1, d1 = S, south = true;
        else if (d0 === S) fillSouth(i0), x1 = x0, y1 = y0 + 1, d1 = N, south = true;
        else if (d0 === W) fillEast(i1), x1 = x0 - 1, y1 = y0, d1 = E, east = true;
        else fillEast(i0), x1 = x0 + 1, y1 = y0, d1 = W, east = true;


        if (open) {
            fillCell(i1);
            cells[i0] |= d0, cells[i1] |= d1;
            context.fillStyle = "transparent";
            if (y1 > 0 && cells[i1 - cellWidth] == null) fillSouth(i1 - cellWidth), frontier.push({
                index: i1,
                direction: N
            }), south = true;
            if (y1 < cellHeight - 1 && cells[i1 + cellWidth] == null) fillSouth(i1), frontier.push({
                index: i1,
                direction: S
            }), south = true;
            if (x1 > 0 && cells[i1 - 1] == null) fillEast(i1 - 1), frontier.push({
                index: i1,
                direction: W
            }), east = true;
            if (x1 < cellWidth - 1 && cells[i1 + 1] == null) fillEast(i1), frontier.push({
                index: i1,
                direction: E
            }), east = true;
        }

        layout.push({
            open: open,
            x: x1,
            y: y1,
            d0: d0,
            d1: d1
        });
    }

    function fillCell(index) {
        var i = index % cellWidth,
            j = index / cellWidth | 0;
        context.fillRect(i * cellSize + (i + 1) * cellSpacing, j * cellSize + (j + 1) * cellSpacing, cellSize, cellSize);
    }

    function fillEast(index) {
        var i = index % cellWidth,
            j = index / cellWidth | 0;
        context.fillRect((i + 1) * (cellSize + cellSpacing), j * cellSize + (j + 1) * cellSpacing, cellSpacing, cellSize);
    }

    function fillSouth(index) {
        var i = index % cellWidth,
            j = index / cellWidth | 0;
        context.fillRect(i * cellSize + (i + 1) * cellSpacing, (j + 1) * (cellSize + cellSpacing), cellSize, cellSpacing);
    }

    function popRandom(array) {
        if (!array.length) return;
        var n = array.length,
            i = Math.random() * n | 0,
            t;
        t = array[i], array[i] = array[n - 1], array[n - 1] = t;
        return array.pop();
    }
//Changing the color and size of the balls
    function drawPlayer(position) {
        game.clearRect(0, 0, width, height);
        currentPosition = position;
        var playerX = position.x * cellSize + (position.x + 1) * cellSpacing;
        var playerY = position.y * cellSize + (position.y + 1) * cellSpacing
        var finishX = maxX * cellSize + (maxX + 1) * cellSpacing;
        var finishY = 0 * cellSize + (0 + 1) * cellSpacing
        game.beginPath();
        game.arc(finishX + (cellSize / 2), finishY + (cellSize / 2), cellSize / 2, 0, 2 * Math.PI, false);
        //game.fillStyle = "green";
		var imageObj = new Image();

		imageObj.onload = function() {
        game.drawImage(imageObj, 1200, 5, 60, 80);
		//context.setAttribute("z-index", 999);
		};
		imageObj.src = 'prune.png';
        //game.fill();
        game.beginPath();
        game.arc(playerX + (cellSize / 2), playerY + (cellSize / 2), cellSize / 2, 0, 2 * Math.PI, false);
        game.fillStyle = "black";
        game.fill();
    }

    window.addEventListener("keydown", function(e) {

      var value = e.which;

      if(value === 37) moveWest(), e.preventDefault();
      if(value === 38) moveNorth(), e.preventDefault();
      if(value === 39) moveEast(), e.preventDefault();
      if(value === 40) moveSouth(), e.preventDefault();
     
      return false;
        
    });

    function moveWest() {
      var newY = currentPosition.y;
      var newX = currentPosition.x - 1;
      var newPosition;

      if (newX < 0) return false;

      for (var i = layout.length - 1; i >= 0; i--) {
        if(layout[i].x === newX && layout[i].y === newY) {
          newPosition = layout[i];
        }
      };

      if(newPosition.x === maxX && newPosition.y === 0) {
        gameComplete();
      }


      if (( currentPosition.d1 === W) || (newPosition.d1 === E)) {
        drawPlayer(newPosition); 
      };
    }

    function moveEast() {
      var newY = currentPosition.y;
      var newX = currentPosition.x + 1;
      var newPosition;

      if (newX > maxX) return false;

      for (var i = layout.length - 1; i >= 0; i--) {
        if(layout[i].x === newX && layout[i].y === newY) {
          newPosition = layout[i];
        }
      };

      if(newPosition.x === maxX && newPosition.y === 0) {
        gameComplete();
      }

      if (( currentPosition.d1 === E) || (newPosition.d1 === W)) {
        drawPlayer(newPosition); 
      };

      
    }

    function moveNorth() {
      var newY = currentPosition.y - 1;
      var newX = currentPosition.x;
      var newPosition;


      if (newY < 0) return false;

      for (var i = layout.length - 1; i >= 0; i--) {
        if(layout[i].x === newX && layout[i].y === newY) {
          newPosition = layout[i];
        }
      };

      if(newPosition.x === maxX && newPosition.y === 0) {
        gameComplete();
      }

      if (( currentPosition.d1 === N) || (newPosition.d1 === S)) {
        drawPlayer(newPosition); 
      };

    }

    function moveSouth() {
      var newY = currentPosition.y + 1;
      var newX = currentPosition.x;
      var newPosition;

      if (newY > maxY) return false;

      for (var i = layout.length - 1; i >= 0; i--) {
        if(layout[i].x === newX && layout[i].y === newY) {
          newPosition = layout[i];
        }
      };

      if(newPosition.x === maxX && newPosition.y === 0) {
        gameComplete();
      }

      if (( currentPosition.d1 === S) || (newPosition.d1 === N)) {
        drawPlayer(newPosition); 
      };
      
    }
//Changes the alert when you win the game
    function gameComplete() {
		var video = d.getElementById('bravo');
		video.play();
      }


    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    function animate() {
      
        requestAnimationFrame(function() {
            if(!run()) {
                animate();
            }
        });
    }

    animate();

