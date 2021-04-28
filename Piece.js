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
	this.possibleMoves = []
	
	if (this.type === "dark") {
		this.color = "#ff0000"
	} else {
		this.color = "#ffffff"
	}
}

Piece.prototype.display = function () {
	stroke(0)
	strokeWeight(2)
	fill(this.color)
	ellipse(this.x * this.size + this.size/2, this.y * this.size + this.size/2, this.size-10, this.size-10)
}

Piece.prototype.movePiece = function (x, y) {
	this.x = x
	this.y = y
}

Piece.prototype.computePossibleMoves = function (state) {
	this.possibleMoves = []
	this.moves = new Move(this.x, this.y)
	if (this.type === "dark") {
		if (this.y-1 >= 0) {
			// Left moves
			if (this.x-1 >= 0) {
				if (state[this.y-1][this.x-1] == null) {
					this.possibleMoves.push({x: this.x-1, y: this.y-1})
					this.moves.leftChild = new Move(this.x-1, this.y-1)
				} else {
					this.computePossibleCaptures(this.x, this.y, this.moves, state)
				}
			}
			// Rght moves
			if (this.x+1 < 8) {
				if (state[this.y-1][this.x+1] == null) {
					this.possibleMoves.push({x: this.x+1, y: this.y-1})
					this.moves.rightChild = new Move(this.x+1, this.y-1)
				} else {
					this.computePossibleCaptures(this.x, this.y, this.moves, state)
				}
			}
		}
	} else if (this.type === "light") {
		if (this.y+1 < 8) {
			// Left moves
			if (this.x-1 >= 0 && state[this.y+1][this.x-1] == null) {
				this.possibleMoves.push({x: this.x-1, y: this.y+1})
				this.moves.leftChild = new Move(this.x-1, this.y+1)
			} else {
				this.computePossibleCaptures(this.x, this.y, this.moves, state)
			}

			// Right
			if (this.x+1 < 8 && state[this.y+1][this.x+1] == null) {
				this.possibleMoves.push({x: this.x+1, y: this.y+1})
				this.moves.rightChild = new Move(this.x+1, this.y+1)
			} else {
				this.computePossibleCaptures(this.x, this.y, this.moves, state)
			}
		}
	}	
}

Piece.prototype.computePossibleCaptures = function (x, y, moves, state) {
	// Compute left captures recursively
	this.computeLeftCaptures(x, y, moves, state)

	// Compute right captures recursively
	this.computeRightCaptures(x, y, moves, state)
}

Piece.prototype.computeLeftCaptures = function (x, y, moves, state) {
	
	// If the player can move forward
	// if state.piece.canMoveForwardBy(1)
	if (state[y][x].sym == "d") {
		if (x < 0 || y < 0) {
			return
		}
		if (y-1 >= 0) {
			if (x-1 >= 0) {
				if (state[y-1][x-1] != null && state[y-1][x-1].sym != "d") {
					if (y-2 >= 0) {
						if (x-2 >= 0) {
							if (state[y-2][x-2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x-2, y: y-2})

								// Grow the left subtree
								let newMove = new Move(x-2, y-2)
								moves.leftChild = newMove

								// Simulate move
								state[y-2][x-2] = {sym: "d", piece: new Piece("dark", x-2, y-2)}

								this.computePossibleCaptures(x-2, y-2, newMove, state)

								state[y-2][x-2] = null
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
				if (state[y+1][x-1] != null && state[y+1][x-1].sym != "l") {
					if (y+2 < 8) {
						if (x-2 >= 0) {
							if (state[y+2][x-2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x-2, y: y+2})

								// Grow the left subtree
								let newMove = new Move(x-2, y+2)
								moves.leftChild = newMove

								// Simulate move
								state[y+2][x-2] = {sym: "l", piece: new Piece("light", x-2, y+2)}

								this.computePossibleCaptures(x-2, y+2, newMove, state)

								state[y+2][x-2] = null
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

Piece.prototype.computeRightCaptures = function (x, y, moves, state) {
	
	if (state[y][x].sym == "d") {
		if (x > 7 || y < 0) {
			return
		}
		if (y-1 >= 0) {
			if (x+1 < 8) {
				if (state[y-1][x+1] != null && state[y-1][x+1].sym != "d") {
					if (y-2 >= 0) {
						if (x+2 < 8) {
							if (state[y-2][x+2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x+2, y: y-2})

								// Grow the right subtree
								let newMove = new Move(x+2, y-2)
								moves.rightChild = newMove

								// Simulate move
								state[y-2][x+2] = {sym: "d", piece: new Piece("dark", x+2, y-2)}

								this.computePossibleCaptures(x+2, y-2, newMove, state)

								state[y-2][x+2] = null
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
				if (state[y+1][x+1] != null && state[y+1][x+1].sym != "l") {
					if (y+2 < 8) {
						if (x+2 < 8) {
							if (state[y+2][x+2] == null) {
								//This is a possible move
								this.possibleMoves.push({x: x+2, y: y+2})

								// Grow the right subtree
								let newMove = new Move(x+2, y+2)
								moves.rightChild = newMove

								// Simulate move
								state[y+2][x+2] = {sym: "l", piece: new Piece("light", x+2, y+2)}

								this.computePossibleCaptures(x+2, y+2, newMove, state)

								state[y+2][x+2] = null
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