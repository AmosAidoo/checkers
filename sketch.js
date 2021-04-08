/*
	The board is 8x8
	12 pieces each
	Clicking a square should give the valid moves

	I need to find a way to represent the board 
 */
let board

function setup() {
	createCanvas(500, 500)
	board = new Board(true)
	xDiv = width/8
	yDiv = height/8
	moveToggle = false
	possibleMoves = []
	console.log(board.state)
}

function draw() {
	background(255)
	board.display()
	noFill()
	board.showPossibleMoves()
}

function mousePressed() {
	board.handleMouseClick()
}

