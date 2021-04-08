/*
	A board is made up of 24 pieces

	12 light pieces and 12 dark pieces	
	
	There are 2 types of pieces. 1. Men(Uncrowned pieces) 2. Kings(Crowned Pieces)

	A man can move only forward towards the left diagonal or right diagonal
	A king can move both forward and backward in successive cells
 */
function Board(darkPlayer) {
	this.darkPlayer = new Player("dark")
	this.lightPlayer = new Player("light")
	this.state = [[], [], [], [], [], [], [], []]
	this.clickedX = null
	this.clickedY = null
	this.possibleMoves = []
	this.moveToggle = false
	this.isDarkPlayer = darkPlayer
	this.moves = null

	// Initialize board state
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			this.state[y][x] = null
		}
	}
	// Dark pieces are represented as d on the board state
	// Light pieces are represented as l on the board state
	for (let i = 0; i < 12; i++) {
		this.state[this.darkPlayer.pieces[i]["y"]][this.darkPlayer.pieces[i]["x"]] = {sym: "d", piece: this.darkPlayer.pieces[i]}
		this.state[this.lightPlayer.pieces[i]["y"]][this.lightPlayer.pieces[i]["x"]] = {sym: "l", piece: this.lightPlayer.pieces[i]}
	}
}

Board.prototype.display = function () {
	// Divide the width and height into 8 equal parts
	let xDiv = Math.floor(width/8)
	let yDiv = Math.floor(height/8)

	// White and green
	let white = "#ffffff"
	let green = "#00ff00"

	stroke(green)
	
	// White is zero, green is 1
	let colorSwitch = 0

	// The board is 8x8
	for (let y = 0; y < 8; y++) {
		if (y % 2 === 0) {
			colorSwitch = 0
		} else {
			colorSwitch = 1
		}
		for (let x = 0; x < 8; x++) {
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
	let xDiv = width/8
	let yDiv = height/8
	
	// if (this.moveToggle) {
	rect(this.clickedX*Math.floor(xDiv), this.clickedY*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
	for (let i = 0; i < this.possibleMoves.length; i++) {
		rect(this.possibleMoves[i].x*Math.floor(xDiv), this.possibleMoves[i].y*Math.floor(yDiv), Math.floor(xDiv), Math.floor(yDiv))
	}
	// }
}

Board.prototype.handleMouseClick = function () {
	let i, j
	let xDiv = width/8
	let yDiv = height/8

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
	if (this.moveToggle) {
		if (this.clickedX == i-1 && this.clickedY == j-1) {
			// this.moveToggle = false
			return
		}
	} else {
		this.moveToggle = true
	}

	path = []

	// Check if the current player has made a move
	if (this.findMove(this.moves, i-1, j-1, path)) {
		console.log(path)
		// This means a move has been found and that
		// the current player has made a move
		console.log("Current player has made a move")
		if (this.state[this.clickedY][this.clickedX] != null) {
			if (this.state[this.clickedY][this.clickedX].sym == "d" && this.isDarkPlayer) {
				this.state[j-1][i-1] = this.state[this.clickedY][this.clickedX]
				this.state[this.clickedY][this.clickedX] = null
				this.state[j-1][i-1].piece.movePiece(i-1, j-1)
				
			} else if (this.state[this.clickedY][this.clickedX].sym == "l" && !this.isDarkPlayer) {
				this.state[j-1][i-1] = this.state[this.clickedY][this.clickedX]
				this.state[this.clickedY][this.clickedX] = null
				this.state[j-1][i-1].piece.movePiece(i-1, j-1)
				
			} else {
				return
			}
		} else return

		// Now remove all the captured pieces
		for (let i = 1; i < path.length; i++) {
			if (this.isDarkPlayer) {
				// y will decrease
				if (Math.abs(path[i].y - path[i-1].y) == 2) {
					// A piece has been captured
					if (path[i].x < path[i-1].x) {
						// On the left
						this.state[path[i].y+1][path[i].x+1] = null
						this.lightPlayer.pieces = this.lightPlayer.pieces.filter(
							piece => !((piece.x == path[i].x+1) && (piece.y == path[i].y+1)) 
						)
					} else {
						// On the right
						this.state[path[i].y+1][path[i].x-1] = null
						this.lightPlayer.pieces = this.lightPlayer.pieces.filter(
							piece => !((piece.x == path[i].x-1) && (piece.y == path[i].y+1)) 
						)
					}
				}
			} else {
				// y will increase
				if (Math.abs(path[i].y - path[i-1].y) == 2) {
					// A piece has been captured
					if (path[i].x < path[i-1].x) {
						// On the left
						this.state[path[i].y-1][path[i].x+1] = null
						this.darkPlayer.pieces = this.darkPlayer.pieces.filter(
							piece => !((piece.x == path[i].x+1) && (piece.y == path[i].y-1)) 
						)
					} else {
						// On the right
						this.state[path[i].y-1][path[i].x-1] = null
						this.darkPlayer.pieces = this.darkPlayer.pieces.filter(
							piece => !((piece.x == path[i].x-1) && (piece.y == path[i].y-1)) 
						)
					}
				}
			}
		}
		this.isDarkPlayer = !this.isDarkPlayer
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
	this.moves = new Move(this.clickedX, this.clickedY)
	this.computePossibleMoves(this.clickedX, this.clickedY, this.moves)
	console.log(this.moves)
}

// Find move and build path to the move
Board.prototype.findMove = function (root, x, y, path) {
	if (root == null) {
		return false
	}
	path.push(new Move(root.x, root.y))

	// Process the node
	if (root.x == x && root.y == y) {
		return true
	}

	// Check the left subtree
	let foundLeft = this.findMove(root.leftChild, x, y, path)
	// Check the right subtree
	let foundRight = this.findMove(root.rightChild, x, y, path)

	if (foundLeft || foundRight) {
		return true
	}

	path.pop()
	return false
}


Board.prototype.computePossibleMoves = function (x, y, moves) {
	if (this.state[y][x].sym === "d") {
		if (y-1 >= 0) {
			// Left moves
			if (x-1 >= 0) {
				if (this.state[y-1][x-1] == null) {
					this.possibleMoves.push({x: x-1, y: y-1})
					moves.leftChild = new Move(x-1, y-1)
				} else {
					this.computePossibleCaptures(x, y, moves)
				}
			}
			// Rght moves
			if (x+1 < 8) {
				if (this.state[y-1][x+1] == null) {
					this.possibleMoves.push({x: x+1, y: y-1})
					moves.rightChild = new Move(x+1, y-1)
				} else {
					this.computePossibleCaptures(x, y, moves)
				}
			}
		}
	} else if (this.state[y][x].sym === "l") {
		if (y+1 < 8) {
			// Left moves
			if (x-1 >= 0 && this.state[y+1][x-1] == null) {
				this.possibleMoves.push({x: x-1, y: y+1})
				moves.leftChild = new Move(x-1, y+1)
			} else {
				this.computePossibleCaptures(x, y, moves)
			}

			// Right
			if (x+1 < 8 && this.state[y+1][x+1] == null) {
				this.possibleMoves.push({x: x+1, y: y+1})
				moves.rightChild = new Move(x+1, y+1)
			} else {
				this.computePossibleCaptures(x, y, moves)
			}
		}
	}	
}

Board.prototype.computePossibleCaptures = function (x, y, moves) {
	// Compute left captures recursively
	this.computeLeftCaptures(x, y, moves)

	// Compute right captures recursively
	this.computeRightCaptures(x, y, moves)
}

Board.prototype.computeLeftCaptures = function (x, y, moves) {
	
	// If the player can move forward
	// if this.state.piece.canMoveForwardBy(1)
	if (this.state[y][x].sym == "d") {
		if (x < 0 || y < 0) {
			return
		}
		if (y-1 >= 0) {
			if (x-1 >= 0) {
				if (this.state[y-1][x-1] != null && this.state[y-1][x-1].sym != "d") {
					if (y-2 >= 0) {
						if (x-2 >= 0) {
							if (this.state[y-2][x-2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x-2, y: y-2})

								// Grow the left subtree
								let newMove = new Move(x-2, y-2)
								moves.leftChild = newMove

								// Simulate move
								this.state[y-2][x-2] = {sym: "d", piece: new Piece("dark", x-2, y-2)}

								this.computePossibleCaptures(x-2, y-2, newMove)

								this.state[y-2][x-2] = null
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
				if (this.state[y+1][x-1] != null && this.state[y+1][x-1].sym != "l") {
					if (y+2 < 8) {
						if (x-2 >= 0) {
							if (this.state[y+2][x-2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x-2, y: y+2})

								// Grow the left subtree
								let newMove = new Move(x-2, y+2)
								moves.leftChild = newMove

								// Simulate move
								this.state[y+2][x-2] = {sym: "l", piece: new Piece("light", x-2, y+2)}

								this.computePossibleCaptures(x-2, y+2, newMove)

								this.state[y+2][x-2] = null
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

Board.prototype.computeRightCaptures = function (x, y, moves) {
	
	if (this.state[y][x].sym == "d") {
		if (x > 7 || y < 0) {
			return
		}
		if (y-1 >= 0) {
			if (x+1 < 8) {
				if (this.state[y-1][x+1] != null && this.state[y-1][x+1].sym != "d") {
					if (y-2 >= 0) {
						if (x+2 < 8) {
							if (this.state[y-2][x+2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x+2, y: y-2})

								// Grow the right subtree
								let newMove = new Move(x+2, y-2)
								moves.rightChild = newMove

								// Simulate move
								this.state[y-2][x+2] = {sym: "d", piece: new Piece("dark", x+2, y-2)}

								this.computePossibleCaptures(x+2, y-2, newMove)

								this.state[y-2][x+2] = null
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
				if (this.state[y+1][x+1] != null && this.state[y+1][x+1].sym != "l") {
					if (y+2 < 8) {
						if (x+2 < 8) {
							if (this.state[y+2][x+2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x+2, y: y+2})

								// Grow the right subtree
								let newMove = new Move(x+2, y+2)
								moves.rightChild = newMove

								// Simulate move
								this.state[y+2][x+2] = {sym: "l", piece: new Piece("light", x+2, y+2)}

								this.computePossibleCaptures(x+2, y+2, newMove)

								this.state[y+2][x+2] = null
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



function Move(x, y) {
	this.leftChild = null
	this.rightChild = null
	this.x = x
	this.y = y
}