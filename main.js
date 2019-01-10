let size;
let grid;
let cellScale;
let moves = 0;
let isSolved = true;
let SOLVED = grid;
let cursor = {
	madeMove: false,
	x: 0,
	y: 0,
	squareX: 0,
	squareY: 0,
	offsetX: 238,
	offsetY: 5,
	dragging: false,
	startOfDrag: false,
	xdiff: 0,
	ydiff: 0,
	dragdirection: "",
}

let dragstart = {
	x: 0,
	y: 0,
}

let canvas = document.getElementById("myCanvas");
	canvas.width = 800;
	canvas.height = 800;
let ctx = canvas.getContext("2d");

size = 4;

class Cell {
	constructor(value, color) {
		this.value = value;

		let red, green, blue;
		if (color.r < 16) {
			red = "0" + Math.round(color.r).toString(16);
		} else {
			red = Math.round(color.r).toString(16);
		}
		
		if (color.g < 16) {
			green = "0" + Math.round(color.g).toString(16);
		} else {
			green = Math.round(color.g).toString(16);
		}

		if (color.b < 16) {
			blue = "0" + Math.round(color.b).toString(16);
		} else {
			blue = Math.round(color.b).toString(16);
		}
		this.color = "#" + red + green + blue;
	}
}

function scramble() {
	init();
	for (let i = 0; i < (size * size) * 2; i++) {
		let random = Math.floor(Math.random() * 4);
		let randomdir = "";
		switch (random) {
			case 0:
				randomdir = "up";
			break;
			case 1:
				randomdir = "down";
			break;
			case 2:
				randomdir = "left";
			break;
			case 3:
				randomdir = "right";
			break;
		}

		let randomx = Math.floor(Math.random() * size);
		let randomy = Math.floor(Math.random() * size);

		let randommoveamount = 1 + Math.floor(Math.random() * (size - 1));

		if (randomdir == "right") {
			for (let i = 0; i < randommoveamount; i++) {
				let temp = grid[size - 1][randomy];
				for (let j = size - 1; j > 0; j--) {
					grid[j][randomy] = grid[j - 1][randomy];
				}
				grid[0][randomy] = temp;
			}
		}

		if (randomdir == "left") {
			for (let i = 0; i < randommoveamount; i++) {
				let temp = grid[0][randomy];
				for (let j = 0; j < size - 1; j++) {
					grid[j][randomy] = grid[j + 1][randomy];
				}
				grid[size - 1][randomy] = temp;
			}
		}

		if (randomdir == "up") {
			for (let i = 0; i < randommoveamount; i++) {
				let temp = grid[randomx][0];
				for (let j = 0; j < size - 1; j++) {
					grid[randomx][j] = grid[randomx][j + 1];
				}
				grid[randomx][size - 1] = temp;
			}
		}

		if (randomdir == "down") {
			for (let i = 0; i < randommoveamount; i++) {
				let temp = grid[randomx][size - 1];
				for (let j = size - 1; j > 0; j--) {
					grid[randomx][j] = grid[randomx][j - 1];
				}
				grid[randomx][0] = temp;
			}
		}
	}
	isSolved = false;
	draw();
}

function smaller() {
	if (size > 2) {
		size--;
	}

	init();
}

function bigger() {
	if (size < 255) {
		size++;
	}

	init();
}

function gridIsSolved() {
	if (moves < 1) {
		return;
	}
	let index = 1;
	let isCorrect = true;
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (grid[j][i].value != index) {
				isCorrect = false;
			}
			index++;
		}
	}

	if (isCorrect) {
		return true;
	} else {
		return false;
	}
}

function draw() {
	if (gridIsSolved()) {
		document.getElementById("bg").style.backgroundColor = "#22cc22";
	} else {
		document.getElementById("bg").style.backgroundColor = "#dddddd";
	}

	for (i = 1; i <= size; i++) {
		for (j = 1; j <= size; j++) {
			let toDraw = grid[i - 1][j - 1];

			ctx.lineWidth = 1;

			ctx.fillStyle = toDraw.color;
			ctx.fillRect((i - 1) * cellScale, (j - 1) * cellScale, cellScale, cellScale);

			if (document.getElementById("showNumbers").checked == true) {
				ctx.fillStyle = "#ffffff";
				ctx.textAlign = "center";
				ctx.font = "" + cellScale / 2.2 + "px Arial";
				ctx.fillText(toDraw.value, (i - 1) * cellScale + cellScale/2, (j) * cellScale - cellScale/3);
			}
			ctx.strokeRect((i - 1) * cellScale, (j - 1) * cellScale, cellScale, cellScale);
	//		ctx.strokeText(toDraw.value, (i - 1) * cellScale + cellScale/2, (j) * cellScale - cellScale/3);
		}
	}
}

function updateCursor() {
	ctx.lineWidth = 5;
	ctx.strokeRect(cursor.squareX * cellScale, cursor.squareY * cellScale, cellScale, cellScale);
}

function init() {
	moves = 0;
	document.getElementById("movestext").innerHTML = "Züge: " + moves;
	document.getElementById("fieldtext").innerHTML = size + " x " + size;
	grid = [];
	cellScale = 800 / size;

	for (let i = 1; i <= size; i++) {
		grid.push([]);
	}

	for (i = 1; i <= size; i++) {
		let toColor = {
			r: 255,
			g: 0,
			b: 0,
		}
		for (j = 1; j <= size; j++) {
			toColor.g = Math.floor(255/(size) * (i - 1));

			grid[j - 1][i - 1] = new Cell(j + (i - 1) * size, toColor);
			
			toColor.b += Math.floor(255/(size - 1));
			toColor.r -= Math.floor(255/(size - 1));
		}
	}
	SOLVED = grid;
	if (gridIsSolved()) {
		document.getElementById("bg").style.backgroundColor = "#00ff00";
	} else {
		document.getElementById("bg").style.backgroundColor = "#ffffff";
	}
	draw();
}

document.onmousemove = function(e){
	cursor.x = e.pageX - (cursor.offsetX);
    cursor.y = e.pageY - (cursor.offsetY);

    if (cursor.startOfDrag) {
    	if (cursor.x != dragstart.x && cursor.y != dragstart.y) {
    		if (cursor.x < dragstart.x - cellScale / 2 && cursor.y >= dragstart.y - cellScale && cursor.y <= dragstart.y + cellScale) {
    			cursor.dragdirection = "left";
    			cursor.startOfDrag = false;
    		} else if (cursor.x > dragstart.x + cellScale / 2 && cursor.y >= dragstart.y - cellScale && cursor.y <= dragstart.y + cellScale) {
    			cursor.dragdirection = "right";
    			cursor.startOfDrag = false;
    		} else if (cursor.y < dragstart.y - cellScale / 2 && cursor.x >= dragstart.x - cellScale && cursor.x <= dragstart.x + cellScale) {
    			cursor.dragdirection = "up";
    			cursor.startOfDrag = false;
    		} else if (cursor.y > dragstart.y + cellScale / 2 && cursor.x >= dragstart.x - cellScale && cursor.x <= dragstart.x + cellScale) {
    			cursor.dragdirection = "down";
    			cursor.startOfDrag = false;
    		}
    	}
    }

    if (cursor.dragging) {
    	let initial = {
			x: Math.floor(dragstart.x / cellScale),
			y: Math.floor(dragstart.y / cellScale),
		}

	    cursor.xdiff = cursor.x - dragstart.x;
	    cursor.ydiff = cursor.y - dragstart.y;

		if (cursor.dragdirection == "right") {
		    if (cursor.x > ((cursor.squareX + 1) * cellScale)) {
		    	cursor.squareX ++;
		    	let temp = grid[size - 1][initial.y];
				for (let j = size - 1; j > 0; j--) {
					grid[j][initial.y] = grid[j - 1][initial.y];
				}
				grid[0][initial.y] = temp;
				cursor.madeMove = true;
		    }
		} else if (cursor.dragdirection == "left") {
		    if (cursor.x < ((cursor.squareX) * cellScale)) {
		    	cursor.squareX --;
		    	let temp = grid[0][initial.y];
				for (let j = 0; j < size - 1; j++) {
					grid[j][initial.y] = grid[j + 1][initial.y];
				}
				grid[size - 1][initial.y] = temp;
				cursor.madeMove = true;
		    }
		} else if (cursor.dragdirection == "up") {
		    if (cursor.y < ((cursor.squareY) * cellScale)) {
		    	cursor.squareY --;
		    	let temp = grid[initial.x][0];
				for (let j = 0; j < size - 1; j++) {
					grid[initial.x][j] = grid[initial.x][j + 1];
				}
				grid[initial.x][size - 1] = temp;
				cursor.madeMove = true;
		    }
		} else if (cursor.dragdirection == "down") {
		    if (cursor.y > ((cursor.squareY + 1) * cellScale)) {
		    	cursor.squareY ++;
		    	let temp = grid[initial.x][size - 1];
				for (let j = size - 1; j > 0; j--) {
					grid[initial.x][j] = grid[initial.x][j - 1];
				}
				grid[initial.x][0] = temp;
				cursor.madeMove = true;
		    }
		}
	    draw();
	    updateCursor();
	}
}

canvas.onmousedown = function(){
	dragstart.x = cursor.x;
	dragstart.y = cursor.y;

	cursor.squareX = Math.floor(dragstart.x / cellScale);
	cursor.squareY = Math.floor(dragstart.y / cellScale);

	cursor.dragdirection = "";
	cursor.dragging = true;
	cursor.startOfDrag = true;
	draw();
	updateCursor();
}

function addMove() {
	moves++;
	document.getElementById("movestext").innerHTML = "Züge: " + moves;
}

document.onmouseup = function(){
	if (cursor.madeMove) {
		addMove();
		cursor.madeMove = false;
	}
	draw();
	cursor.dragging = false;
}

window.onload = init();