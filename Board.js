/*
	A board is made up of 24 pieces

	12 light pieces and 12 dark pieces	
	
	There are 2 types of pieces. 1. Men(Uncrowned pieces) 2. Kings(Crowned Pieces)

	A man can move only forward towards the left diagonal or right diagonal
	A king can move both forward and backward in successive cells
 */
function Board(darkPlayer) {
	this.SIZE = 8
	this.darkPlayer = new Player("dark", this.SIZE)
	this.lightPlayer = new Player("light", this.SIZE)
	this.state = [[], [], [], [], [], [], [], []]
	this.clickedX = null
	this.clickedY = null
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
		colorSwitch = y%2
		for (let x = 0; x < this.SIZE; x++) {
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
	
	if (this.clickedX !== null) {
		rect(this.clickedX*Math.floor(xDiv), this.clickedY*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
	}
	
	
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

	//Check to see whether I have reclicked an already clicked position
	if (this.clickedX == i-1 && this.clickedY == j-1) {
		return
	}

	console.log("State: ", this.state[j-1][i-1])

	path = []
	
	// This makes sure there is no box at position 0,0 when the game starts
	if (this.clickedX === null) {
		this.clickedX = this.clickedY = 0
	}
	
	// Check if the current player has made a move
	let clickedState = this.state[this.clickedY][this.clickedX]
	if (clickedState !== null){

		if (clickedState.piece.isKing) {
			console.log("Finding move for the king")
			console.log("The king move: ", clickedState.piece.kingMoves)
			if (clickedState.piece.findKingMove(clickedState.piece.kingMoves, i-1, j-1, path)) {
				
				console.log(path)
				// This means a move has been found and that
				// the current player has made a move
				console.log("Current player has made a move")
	
				this.removeCapturedPieces(path)
	
				//Actually make the move
				this.movePiece(i-1, j-1)
			}
		} else {
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
	console.log("Moves: ", this.state[this.clickedY][this.clickedX].piece.moves)
	console.log("King Moves: ", this.state[this.clickedY][this.clickedX].piece.kingMoves)
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
		alert(this.isDarkPlayer ? "Sorry red's turn" : "Sorry white's turn")
	}
}

Board.prototype.removeCapturedPieces = function (path) {
	for (let p = 1; p < path.length; p++) {
		console.log("A move on the path: ", path[p])
		if (this.isDarkPlayer) {
			if (path[p].capturedPiece !== null) {
				this.state[path[p].capturedPiece.y][path[p].capturedPiece.x] = null
				this.lightPlayer.pieces = this.lightPlayer.pieces.filter(
					piece => !((piece.x == path[p].capturedPiece.x) && (piece.y == path[p].capturedPiece.y)) 
				)
			}
		} else {
			if (path[p].capturedPiece !== null) {
				this.state[path[p].capturedPiece.y][path[p].capturedPiece.x] = null
				this.darkPlayer.pieces = this.darkPlayer.pieces.filter(
					piece => !((piece.x == path[p].capturedPiece.x) && (piece.y == path[p].capturedPiece.y)) 
				)
			}
		}
	}
}