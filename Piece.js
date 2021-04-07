// The dark piece will be at the bottom the board
// The light pieces will be at the top of the board

function Piece(type, x, y) {
	this.type = type
	this.color = null
	this.size = Math.floor(width/8)
	this.x = x
	this.y = y
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

Piece.prototype.canMoveForwardBy = function (moves) {
	if (this.type == "dark") {
		return this.y - moves >= 0
	} else {
		return this.y + moves < 8
	}
}