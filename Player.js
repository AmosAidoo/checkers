function Player(type, boardSize) {
	this.pieces = []
	this.initialPositions = []

	let xDiv = Math.floor(width/boardSize)
	let yDiv = Math.floor(height/boardSize)

	if (type === "dark") {
		let startX = 0
		for (let y = 7; y >= 5; y--) {
			for (let x = startX; x < 8; x+=2) {
				this.initialPositions.push({x: x, y: y})
			}
			startX = (startX == 0) ? 1 : 0
		}
			
	} else {
		let startX = 1
		for (let y = 0; y <= 2; y++) {
			for (let x = startX; x < 8; x+=2) {
				this.initialPositions.push({x: x, y: y})
			}
			startX = (startX == 0) ? 1 : 0
		}

	}

	// Initialize pieces for the player
	for (let i = 0; i < 12; i++) {
		this.pieces[i] = new Piece(type, this.initialPositions[i]["x"], this.initialPositions[i]["y"])
	}
}

