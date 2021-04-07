/*
	The board is 8x8
	12 pieces each
	Clicking a square should give the valid moves

	I need to find a way to represent the board 
 */
let board
let x, y, xDiv, yDiv
let possibleMoves
let moveToggle


function setup() {
	createCanvas(500, 500)
	board = new Board()
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
	showPossibleMoves()
}

function showPossibleMoves() {
	rect(x*Math.floor(xDiv), y*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
	if (moveToggle) {
		for (let i = 0; i < possibleMoves.length; i++) {
			rect(possibleMoves[i].x*Math.floor(xDiv), possibleMoves[i].y*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
		}
	}	
}
/*
	Alert bad code
 */
function mousePressed() {

	let i, j
	// Check for x position
	for (i = 1; i <= 8; i++) {
		if (pmouseX <= i * xDiv) {
			break
		}
	}

	// Check for y position
	for (j = 1; j <= 8; j++) {
		if (pmouseY <= j * yDiv) {
			break
		}
	}

	// Toggle move
	if (moveToggle) {
		if (x == i-1 && y == j-1) {
			// moveToggle = false
			return
		}
	} else {
		moveToggle = true
	}

	// Check if player has made a move
	for (let idx = 0; idx < possibleMoves.length; idx++) {
		// If I move a checker to one of the possible moves
		if (possibleMoves[idx].x == (i-1) && possibleMoves[idx].y == (j-1)) {
			if (board.state[y][x].sym != null) {
				board.state[j-1][i-1] = board.state[y][x]
				board.state[y][x] = null
				board.state[j-1][i-1].piece.movePiece(i-1, j-1)
			}
			break
		}
	}

	// For zero indexing
	x = i - 1
	y = j - 1

	// Clear possible moves
	possibleMoves = []

	if (board.state[y][x] == null) {
		return
	}
	computePossibleMoves(x, y)
}

function computePossibleMoves(x, y) {
	if (board.state[y][x].sym === "d") {
		if (y-1 >= 0) {
			// Left moves
			if (x-1 >= 0) {
				if (board.state[y-1][x-1] == null) {
					possibleMoves.push({x: x-1, y: y-1})
				} else {
					computePossibleCaptures(x, y)
				}
			}
			// Rght moves
			if (x+1 < 8) {
				if (board.state[y-1][x+1] == null) {
					possibleMoves.push({x: x+1, y: y-1})
				} else {
					computePossibleCaptures(x, y)
				}
			}
		}
	} else if (board.state[y][x].sym === "l") {
		if (y+1 < 8) {
			// Left moves
			if (x-1 >= 0 && board.state[y+1][x-1] == null) {
				possibleMoves.push({x: x-1, y: y+1})
			} else {
				computePossibleCaptures(x, y)
			}

			// Right
			if (x+1 < 8 && board.state[y+1][x+1] == null) {
				possibleMoves.push({x: x+1, y: y+1})
			} else {
				computePossibleCaptures(x, y)
			}
		}
	}	
}

function computePossibleCaptures(x, y) {
	// Compute left captures recursively
	computeLeftCaptures(x, y)

	// Compute right captures recursively
	computeRightCaptures(x, y)
}

function computeLeftCaptures(x, y) {
	
	// If the player can move forward
	// if board.state.piece.canMoveForwardBy(1)
	if (board.state[y][x].sym == "d") {
		if (x < 0 || y < 0) {
			return
		}
		if (y-1 >= 0) {
			if (x-1 >= 0) {
				if (board.state[y-1][x-1] != null && board.state[y-1][x-1].sym != "d") {
					if (y-2 >= 0) {
						if (x-2 >= 0) {
							if (board.state[y-2][x-2] == null) {
								//This is a possible move
								possibleMoves.push({x: x-2, y: y-2})

								// Simulate move
								board.state[y-2][x-2] = {sym: "d", piece: new Piece("dark", x-2, y-2)}

								computePossibleCaptures(x-2, y-2)

								board.state[y-2][x-2] = null
							} else {
								return
							}
						}
					}
				} else {
					// There is no capture on the left
					return
				}
			}
		}
	} else {
		if (x < 0 || y > 7) {
			return
		}
		if (y+1 < 8) {
			if (x-1 >= 0) {
				if (board.state[y+1][x-1] != null && board.state[y+1][x-1].sym != "l") {
					if (y+2 < 8) {
						if (x-2 >= 0) {
							if (board.state[y+2][x-2] == null) {
								//This is a possible move
								possibleMoves.push({x: x-2, y: y+2})

								// Simulate move
								board.state[y+2][x-2] = {sym: "l", piece: new Piece("light", x-2, y+2)}

								computePossibleCaptures(x-2, y+2)

								board.state[y+2][x-2] = null
							} else {
								return
							}
						}
					}
				} else {
					// There is no capture on the left
					return
				}
			}
		}
	}
	
}

function computeRightCaptures(x, y) {
	
	if (board.state[y][x].sym == "d") {
		if (x > 7 || y < 0) {
			return
		}
		if (y-1 >= 0) {
			if (x+1 < 8) {
				if (board.state[y-1][x+1] != null && board.state[y-1][x+1].sym != "d") {
					if (y-2 >= 0) {
						if (x+2 < 8) {
							if (board.state[y-2][x+2] == null) {
								//This is a possible move
								possibleMoves.push({x: x+2, y: y-2})

								// Simulate move
								board.state[y-2][x+2] = {sym: "d", piece: new Piece("dark", x+2, y-2)}

								computePossibleCaptures(x+2, y-2)

								board.state[y-2][x+2] = null
							} else {
								return
							}
						}
					}
				} else {
					// There is no capture on the left
					return
				}
			}
		}
	} else {
		if (x > 7 || y > 7) {
			return
		}
		if (y+1 < 8) {
			if (x+1 < 8) {
				if (board.state[y+1][x+1] != null && board.state[y+1][x+1].sym != "l") {
					if (y+2 < 8) {
						if (x+2 < 8) {
							if (board.state[y+2][x+2] == null) {
								//This is a possible move
								possibleMoves.push({x: x+2, y: y+2})

								// Simulate move
								board.state[y+2][x+2] = {sym: "l", piece: new Piece("light", x+2, y+2)}

								computePossibleCaptures(x+2, y+2)

								board.state[y+2][x+2] = null
							} else {
								return
							}
						}
					}
				} else {
					// There is no capture on the left
					return
				}
			}
		}
	}
	
}