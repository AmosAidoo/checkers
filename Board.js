/*
	A board is made up of 24 pieces

	12 light pieces and 12 dark pieces	
	
	There are 2 types of pieces. 1. Men(Uncrowned pieces) 2. Kings(Crowned Pieces)

	A man can move only forward towards the left diagonal or right diagonal
	A king can move both forward and backward in successive cells
 */
function Board() {
	this.darkPlayer = new Player("dark")
	this.lightPlayer = new Player("light")
	this.state = [[], [], [], [], [], [], [], []]

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
	for (let i = 0; i < 12; i++) {
		this.darkPlayer.pieces[i].display()
		this.lightPlayer.pieces[i].display()
	}
}