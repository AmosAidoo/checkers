/*
	A board is made up of 24 pieces

	12 light pieces and 12 dark pieces	
	
	There are 2 types of pieces. 1. Men(Uncrowned pieces) 2. Kings(Crowned Pieces)

	A man can move only forward towards the left diagonal or right diagonal
	A king can move both forward and backward in successive cells
 */
function Board(darkPlayer) {
	this.SIZE = 8
	this.darkPlayer = new Player("dark", this.SIZE = 8)
	this.lightPlayer = new Player("light", this.SIZE = 8)
	this.state = [[], [], [], [], [], [], [], []]
	this.clickedX = 0
	this.clickedY = 0
	this.possibleMoves = []
	this.moveToggle = false
	this.isDarkPlayer = darkPlayer
	this.moves = null
	this.PIECE_PER_PLAYER = 12

	// Initialize board state
	for (let y = 0; y < this.SIZE; y++) {
		for (let x = 0; x < this.SIZE; x++) {
			this.state[y][x] = null
		}
	}
	// Dark pieces are represented as d on the board state
	// Light pieces are represented as l on the board state
	for (let i = 0; i < this.PIECE_PER_PLAYER; i++) {
		this.state[this.darkPlayer.pieces[i]["y"]][this.darkPlayer.pieces[i]["x"]] = {sym: "d", piece: this.darkPlayer.pieces[i]}
		this.state[this.lightPlayer.pieces[i]["y"]][this.lightPlayer.pieces[i]["x"]] = {sym: "l", piece: this.lightPlayer.pieces[i]}
	}
}

Board.prototype.display = function () {
	// Divide the width and height into 8 equal parts
	let xDiv = Math.floor(width/this.SIZE)
	let yDiv = Math.floor(height/this.SIZE)

	// White and green
	let white = "#ffffff"
	let green = "#00ff00"

	stroke(green)
	
	// White is zero, green is 1
	let colorSwitch = 0

	// The board is 8x8
	for (let y = 0; y < this.SIZE; y++) {
		if (y % 2 === 0) {
			colorSwitch = 0
		} else {
			colorSwitch = 1
		}
		for (let x = 0; x < this.SIZE; x++) {
			// noStroke()
			if (colorSwitch === 0) {
				fill(white)
				colorSwitch = 1
			} else  {
				fill(green)
				colorSwitch = 0
			}
			rect(x*xDiv, y*yDiv, xDiv, yDiv)
		}
	}

	// Place the pieces on the board
	for (let i = 0; i < this.darkPlayer.pieces.length; i++) {
		this.darkPlayer.pieces[i].display()
	}

	for (let i = 0; i < this.lightPlayer.pieces.length; i++) {
		this.lightPlayer.pieces[i].display()
	}
}

Board.prototype.showPossibleMoves = function () {
	let xDiv = width/this.SIZE
	let yDiv = height/this.SIZE
	
	rect(this.clickedX*Math.floor(xDiv), this.clickedY*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
	for (let i = 0; i < this.possibleMoves.length; i++) {
		rect(this.possibleMoves[i].x*Math.floor(xDiv), this.possibleMoves[i].y*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
	}
}

Board.prototype.handleMouseClick = function () {
	let i, j
	let xDiv = width/this.SIZE
	let yDiv = height/this.SIZE

	// Check for x position
	for (i = 1; i <= this.SIZE; i++) {
		if (pmouseX <= i * xDiv) {
			break
		}
	}

	// Check for y position
	for (j = 1; j <= this.SIZE; j++) {
		if (pmouseY <= j * yDiv) {
			break
		}
	}

	// Toggle move
	// if (this.moveToggle) {
	if (this.clickedX == i-1 && this.clickedY == j-1) {
		// this.moveToggle = false
		return
	}
	// } else {
	// 	this.moveToggle = true
	// }
	console.log("State: ", this.state[j-1][i-1])

	path = []

	let clickedState = this.state[this.clickedY][this.clickedX]

	// Check if the current player has made a move
	if (clickedState !== null){
		if (clickedState.piece.findMove(clickedState.piece.moves, i-1, j-1, path)) {
			
			console.log(path)
			// This means a move has been found and that
			// the current player has made a move
			console.log("Current player has made a move")

			this.removeCapturedPieces(path)

			//Actually make the move
			this.movePiece(i-1, j-1)
		}
	}

	// Update the current clicked position
	// Subtract one for the sake of zero indexing
	this.clickedX = i - 1
	this.clickedY = j - 1

	// Clear possible moves
	this.possibleMoves = []

	if (this.state[this.clickedY][this.clickedX] == null) {
		return
	}

	// Start building a tree of with the current move as the root
	this.possibleMoves = this.state[this.clickedY][this.clickedX].piece.computePossibleMoves(this.state)

	console.log("Moves from piece", this.state[this.clickedY][this.clickedX].piece.moves)
}

Board.prototype.movePiece = function (x, y) {
	if (this.state[this.clickedY][this.clickedX].sym == "d" && this.isDarkPlayer) {
		this.state[y][x] = this.state[this.clickedY][this.clickedX]
		this.state[this.clickedY][this.clickedX] = null
		this.state[y][x].piece.movePiece(x, y)
		this.isDarkPlayer = !this.isDarkPlayer
	} else if (this.state[this.clickedY][this.clickedX].sym == "l" && !this.isDarkPlayer) {
		this.state[y][x] = this.state[this.clickedY][this.clickedX]
		this.state[this.clickedY][this.clickedX] = null
		this.state[y][x].piece.movePiece(x, y)
		this.isDarkPlayer = !this.isDarkPlayer
	} else {
		return
	}
}

Board.prototype.removeCapturedPieces = function (path) {
	for (let p = 1; p < path.length; p++) {
		if (this.isDarkPlayer) {
			// y will decrease
			if (Math.abs(path[p].y - path[p-1].y) == 2) {
				// A piece has been captured
				if (path[p].x < path[p-1].x) {
					// On the left
					this.state[path[p].y+1][path[p].x+1] = null
					this.lightPlayer.pieces = this.lightPlayer.pieces.filter(
						piece => !((piece.x == path[p].x+1) && (piece.y == path[p].y+1)) 
					)
				} else {
					// On the right
					this.state[path[p].y+1][path[p].x-1] = null
					this.lightPlayer.pieces = this.lightPlayer.pieces.filter(
						piece => !((piece.x == path[p].x-1) && (piece.y == path[p].y+1)) 
					)
				}
			}
		} else {
			// y will increase
			if (Math.abs(path[p].y - path[p-1].y) == 2) {
				// A piece has been captured
				if (path[p].x < path[p-1].x) {
					// On the left
					this.state[path[p].y-1][path[p].x+1] = null
					this.darkPlayer.pieces = this.darkPlayer.pieces.filter(
						piece => !((piece.x == path[p].x+1) && (piece.y == path[p].y-1)) 
					)
				} else {
					// On the right
					this.state[path[p].y-1][path[p].x-1] = null
					this.darkPlayer.pieces = this.darkPlayer.pieces.filter(
						piece => !((piece.x == path[p].x-1) && (piece.y == path[p].y-1)) 
					)
				}
			}
		}
	}
}

function Move(x, y) {
	this.leftChild = null
	this.rightChild = null
	this.x = x
	this.y = y
}