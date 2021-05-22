// The dark piece will be at the bottom the board
// The light pieces will be at the top of the board

function Piece(type, x, y) {
	this.type = type
	this.color = null
	this.size = Math.floor(width/8)
	this.x = x
	this.y = y
	this.isKing = false
	this.moves = null
	this.kingMoves = null
	
	if (this.type === "dark") {
		this.color = "#ff0000"
	} else {
		this.color = "#ffffff"
	}
}

Piece.prototype.display = function () {
	this.promoteToKing()
	stroke(0)

	if (this.isKing) {
		strokeWeight(5)
	} else {
		strokeWeight(2)
	}
	
	fill(this.color)
	ellipse(this.x * this.size + this.size/2, this.y * this.size + this.size/2, this.size-10, this.size-10)
	strokeWeight(2)
}

Piece.prototype.movePiece = function (x, y) {
	this.x = x
	this.y = y
}

Piece.prototype.promoteToKing = function () {
	if (this.type == "dark" && this.y == 0 && !this.isKing) {
		this.isKing = true
	} else if (this.type == "light" && this.y == 7 && !this.isKing) {
		this.isKing = true
	}
}

// Find move x,y in the path
Piece.prototype.findMove = function (root, x, y, path) {
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

Piece.prototype.computePossibleMoves = function (state) {
	possibleMoves = []
	this.moves = new Move(this.x, this.y)

	if (this.isKing) {
		this.kingMoves = new KingMove(this.x, this.y)
		this.computeKingMoves(state, possibleMoves)
		return possibleMoves
	}

	if (this.type === "dark") {
		if (this.y-1 >= 0) {
			// Left moves
			if (this.x-1 >= 0) {
				if (state[this.y-1][this.x-1] == null) {
					possibleMoves.push({x: this.x-1, y: this.y-1})
					this.moves.leftChild = new Move(this.x-1, this.y-1)
				} else {
					this.computePossibleCaptures(this.x, this.y, this.moves, state, possibleMoves)
				}
			}
			// Rght moves
			if (this.x+1 < 8) {
				if (state[this.y-1][this.x+1] == null) {
					possibleMoves.push({x: this.x+1, y: this.y-1})
					this.moves.rightChild = new Move(this.x+1, this.y-1)
				} else {
					this.computePossibleCaptures(this.x, this.y, this.moves, state, possibleMoves)
				}
			}
		}
	} else if (this.type === "light") {
		if (this.y+1 < 8) {
			// Left moves
			if (this.x-1 >= 0 && state[this.y+1][this.x-1] == null) {
				possibleMoves.push({x: this.x-1, y: this.y+1})
				this.moves.leftChild = new Move(this.x-1, this.y+1)
			} else {
				this.computePossibleCaptures(this.x, this.y, this.moves, state, possibleMoves)
			}

			// Right
			if (this.x+1 < 8 && state[this.y+1][this.x+1] == null) {
				possibleMoves.push({x: this.x+1, y: this.y+1})
				this.moves.rightChild = new Move(this.x+1, this.y+1)
			} else {
				this.computePossibleCaptures(this.x, this.y, this.moves, state, possibleMoves)
			}
		}
	}
	return possibleMoves	
}

Piece.prototype.computePossibleCaptures = function (x, y, moves, state, possibleMoves) {
	// Compute left captures recursively
	this.computeLeftCaptures(x, y, moves, state, possibleMoves)

	// Compute right captures recursively
	this.computeRightCaptures(x, y, moves, state, possibleMoves)
}

Piece.prototype.computeLeftCaptures = function (x, y, moves, state, possibleMoves) {
	
	// If the player can move forward
	if (state[y][x].sym == "d") {
		if (y-1 >= 0) {
			if (x-1 >= 0) {
				if (state[y-1][x-1] !== null && state[y-1][x-1].sym !== "d") {
					if (y-2 >= 0) {
						if (x-2 >= 0) {
							if (state[y-2][x-2] == null) {
								//This is a possible move
								possibleMoves.push({x: x-2, y: y-2})

								// Grow the left subtree
								let newMove = new Move(x-2, y-2)
								moves.leftChild = newMove
								moves.capturedPiece = {x: x-1, y: y-1}

								// Simulate move
								state[y-2][x-2] = {sym: "d", piece: new Piece("dark", x-2, y-2)}

								this.computePossibleCaptures(x-2, y-2, newMove, state, possibleMoves)

								state[y-2][x-2] = null
							}
						}
					}
				}
			}
		}
	} else {
		if (y+1 < 8) {
			if (x-1 >= 0) {
				if (state[y+1][x-1] !== null && state[y+1][x-1].sym !== "l") {
					if (y+2 < 8) {
						if (x-2 >= 0) {
							if (state[y+2][x-2] == null) {
								//This is a possible move
								possibleMoves.push({x: x-2, y: y+2})

								// Grow the left subtree
								let newMove = new Move(x-2, y+2)
								moves.leftChild = newMove
								moves.capturedPiece = {x: x-1, y: y+1}

								// Simulate move
								state[y+2][x-2] = {sym: "l", piece: new Piece("light", x-2, y+2)}

								this.computePossibleCaptures(x-2, y+2, newMove, state, possibleMoves)

								state[y+2][x-2] = null
							}
						}
					}
				}
			}
		}
	}
	
}

Piece.prototype.computeRightCaptures = function (x, y, moves, state, possibleMoves) {
	
	if (state[y][x].sym == "d") {
		if (y-1 >= 0) {
			if (x+1 < 8) {
				if (state[y-1][x+1] !== null && state[y-1][x+1].sym !== "d") {
					if (y-2 >= 0) {
						if (x+2 < 8) {
							if (state[y-2][x+2] == null) {
								//This is a possible move
								possibleMoves.push({x: x+2, y: y-2})

								// Grow the right subtree
								let newMove = new Move(x+2, y-2)
								moves.rightChild = newMove
								moves.capturedPiece = {x: x+1, y: y+1}

								// Simulate move
								state[y-2][x+2] = {sym: "d", piece: new Piece("dark", x+2, y-2)}

								this.computePossibleCaptures(x+2, y-2, newMove, state, possibleMoves)

								state[y-2][x+2] = null
							}
						}
					}
				}
			}
		}
	} else {
		if (y+1 < 8) {
			if (x+1 < 8) {
				if (state[y+1][x+1] !== null && state[y+1][x+1].sym !== "l") {
					if (y+2 < 8) {
						if (x+2 < 8) {
							if (state[y+2][x+2] === null) {
								//This is a possible move
								possibleMoves.push({x: x+2, y: y+2})

								// Grow the right subtree
								let newMove = new Move(x+2, y+2)
								moves.rightChild = newMove
								moves.capturedPiece = {x: x+1, y: y+1}

								// Simulate move
								state[y+2][x+2] = {sym: "l", piece: new Piece("light", x+2, y+2)}

								this.computePossibleCaptures(x+2, y+2, newMove, state, possibleMoves)

								state[y+2][x+2] = null
							}
						}
					}
				}
			}
		}
	}
}

Piece.prototype.computeKingMoves = function(state, possibleMoves) {
	// A king can move forward or backward
	// This makes the the possible directions 4 instead of two
	// (being left or right)
	// The king's moves are going to be either topLeft, topRight, bottomLeft
	// or bottomRight
	// Top, regardless of being dark or light will be y-i and bottom will be y+i
	// Left and right are still x-i and x+i regardless

	let visited = []
	for (let i = 0; i < state.length; i++) {
		visited[i] = []
		for (let j = 0; j < state.length; j++) {
			visited[i][j] = false
		}
	}


	for (let i = 0; i < 4; i++) {
		switch(i) {
			case 0:
				// Top left
				console.log("Checking the top left")
				if (isValidMove(this.x-1, this.y-1)) {
					if (state[this.y-1][this.x-1] === null) {
						console.log("There is space at the top left")
						this.kingMoves.topLeft = new KingMove(this.x-1, this.y-1)
						possibleMoves.push({x: this.x-1, y: this.y-1})
					} else {
						console.log("There is a capture")
						if (state[this.y-1][this.x-1].sym !== this.type.charAt(0)) {
							if (isValidMove(this.x-2, this.y-2)) {
								this.computeKingCaptures(this.x, this.y, this.kingMoves, state, possibleMoves, visited)
							}
						}
					}
				}
				break
			case 1:
				// Top right
				console.log("Checking the top right")
				if (isValidMove(this.x+1, this.y-1)) {
					if (state[this.y-1][this.x+1] === null) {
						console.log("There is space at the top right")
						this.kingMoves.topRight = new KingMove(this.x+1, this.y-1)
						possibleMoves.push({x: this.x+1, y: this.y-1})
					} else {
						
						if (state[this.y-1][this.x+1].sym !== this.type.charAt(0)) {
							if (isValidMove(this.x+2, this.y-2)) {
								console.log("There is a capture at the top right")
								this.computeKingCaptures(this.x, this.y, this.kingMoves, state, possibleMoves, visited)
							}
						}
					}
				}
				break
			case 2:
				// Bottom left
				console.log("Checking the bottom left")
				if (isValidMove(this.x-1, this.y+1)) {
					if (state[this.y+1][this.x-1] === null) {
						console.log("There is space at the bottom left")
						this.kingMoves.bottomLeft = new KingMove(this.x-1, this.y+1)
						possibleMoves.push({x: this.x-1, y: this.y+1})
					} else {
						if (state[this.y+1][this.x-1].sym !== this.type.charAt(0)) {
							if (isValidMove(this.x-2, this.y+2)) {
								console.log("There is a capture at the bottom left")
								this.computeKingCaptures(this.x, this.y, this.kingMoves, state, possibleMoves, visited)
							}
						}
					}
				}
				break
			case 3:
				// Bottom right
				console.log("Checking the bottom right")
				if (isValidMove(this.x+1, this.y+1)) {
					if (state[this.y+1][this.x+1] === null) {
						console.log("There is space at the bottom right")
						this.kingMoves.bottomRight = new KingMove(this.x+1, this.y+1)
						possibleMoves.push({x: this.x+1, y: this.y+1})
					} else {
						if (state[this.y+1][this.x+1].sym !== this.type.charAt(0)) {
							if (isValidMove(this.x+2, this.y+2)) {
								console.log("There is a capture at the bottom right")
								this.computeKingCaptures(this.x, this.y, this.kingMoves, state, possibleMoves, visited)
							}
						}
					}
				}
				break
		}
	}
}

function isValidMove(x, y) {
	return (x >= 0 && x < 8) && (y >= 0 && y < 8)
}

Piece.prototype.findKingCapture = function(x, y, stepX, stepY, moves, state, possibleMoves, visited) {
	if (isValidMove(x+stepX, y+stepY)) {
		if (state[y+stepY][x+stepX] !== null) {
			if (state[y+stepY][x+stepX].sym !== this.type.charAt(0)) {
				if (isValidMove(x+(stepX*2), y+(stepY*2))) {
					if (state[y+(stepY*2)][x+(stepX*2)] === null) {
						let newMove = new KingMove(x+(stepX*2), y+(stepY*2))
						moves.topLeft = newMove
						possibleMoves.push({x: x+(stepX*2), y: y+(stepY*2)})

						// Simulate the move
						state[y+(stepY*2)][x+(stepX*2)] = {
							sym: this.type.charAt(0), 
							piece: new Piece(this.type, x+(stepX*2), y+(stepY*2))
						}
						this.computeKingCaptures(x+(stepX*2), y+(stepY*2), moves, state, possibleMoves, visited)
						state[y+(stepY*2)][x+(stepX*2)] = null
					}
				}
			}
		}
	}
}

Piece.prototype.computeKingCaptures = function(x, y, moves, state, possibleMoves, visited) {
	if (x < 0 || x >= 8 || y < 0 || y >= 8 || visited[y][x]) {
		return
	}
	
	visited[y][x] = true

	for (let i = 0; i < 4; i++) {
		switch(i) {
			case 0:
				// Top left
				this.findKingCapture(x,y,-1,+1,moves,state,possibleMoves, visited)
			case 1:
				// Top right
				this.findKingCapture(x,y,+1,+1,moves,state,possibleMoves, visited)
			case 2:
				// Bottom left
				this.findKingCapture(x,y,-1,-1,moves,state,possibleMoves, visited)
			case 3:
				// Bottom right
				this.findKingCapture(x,y,+1,-1,moves,state,possibleMoves, visited)
		}
	}
}

function KingMove(x, y) {
	this.x = x
	this.y = y
	this.topLeft = null
	this.topRight = null
	this.bottomLeft = null
	this.bottomRight = null
}