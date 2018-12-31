class MyGame extends CGFobject {
	constructor(scene) {
		super(scene);

		var tree = new MyTree(this.scene);
		var texture = new CGFtexture(this.scene, "images/snow.jpg");

		var yuki = new MyYuki(scene);
		var mina = new MyMina(scene);

		this.initialBoard = [
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
			['t', 't', 't', 't', 't', 't', 't', 't', 't', 't']
		];

		var boardObjs = [];

		for (var i = 0; i < 10; i++) {
			let temp = [];

			for (var j = 0; j < 10; j++)
				temp.push(new MyPlane(this.scene, 1, 1));

			boardObjs.push(temp);
		}

		this.valid = [];

		for (var i = 0; i < this.initialBoard.length; i++) {
			let temp = [];

			for (var j = 0; j < this.initialBoard[i].length; j++)
				temp.push(true);

			this.valid.push(temp);
		}

		this.board = new MyBoard(this.scene, this.initialBoard, boardObjs, tree, texture, yuki, mina, this.valid);

		//this.wins = [0, 0];
		this.treesEaten = [0, 0];
		this.players = ['y', 'm'];

		this.beforeMina = 'm'; //nothing on start
		this.nextPlayer = 0;
		this.wonAs = null;
		//this.difficulty = [1, 1];

		this.moving = false;
		this.animating = false;
		this.finished = false;
		this.animationTime = 0;
	};

	getPrologRequest(requestString) {
		var requestPort = 8081;
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

		var self = this;

		if (requestString[0] == 'v') {
			request.onload = function (data) {
				self.parseValid(data.target.response);
			};
		} else {
			request.onload = function (data) {
				self.parseMove(data.target.response);
				self.animating = true;
				self.animationTime = 0;
				self.validMoves();
				self.board.pickValid = [-1, -1];
				self.moving = false;
			};
		}

		request.onerror = function () {
			console.log("Error waiting for response");
		};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	parseValid(string) {
		if (string == "[]") {
			this.finished = true;
			return;
		}

		var valid_moves = [];

		for (var i = 2; i < string.length; i += 6) {
			valid_moves.push([string[i], string[i + 2]]);
		}


		for (var i = 0; i < valid_moves.length; i++)
			this.valid[valid_moves[i][0]][valid_moves[i][1]] = true;
	}

	parseMove(string) {
		var index = 2;

		var lastPositon = [-1, -1];

		this.find(this.players[this.nextPlayer], lastPositon);

		for (var i = 0; i < this.initialBoard.length; i++) {

			for (var j = 0; j < this.initialBoard[i].length; j++) {
				if (string[index] == this.players[this.nextPlayer]) {
					this.board.setAnimation(string[index], [i,j], lastPositon);

					if (string[index] == 'm')
						this.beforeMina = this.initialBoard[i][j];
				}

				this.initialBoard[i][j] = string[index];
				index += 2;
			}

			index += 2;
		}

		if (this.players[this.nextPlayer] == 'y')
			this.treesEaten[this.nextPlayer]++;

		this.nextPlayer++;
		this.nextPlayer %= 2;

		for (var i = 0; i < this.initialBoard.length; i++)
			for (var j = 0; j < this.initialBoard[i].length; j++)
				this.valid[i][j] = false;
	}

	randomMove() {
		if (this.finished || this.moving || this.animating)
			return;

		this.moving = true;

		// Get Parameter Values
		var requestString = "randomMove([";

		for (var i = 0; i < this.initialBoard.length; i++) {
			requestString += "[";

			for (var j = 0; j < this.initialBoard[i].length; j++) {
				requestString += this.initialBoard[i][j];

				if (j != this.initialBoard[i].length - 1)
					requestString += ",";
			}

			requestString += "]";

			if (i != this.initialBoard.length - 1)
				requestString += ",";
		}

		requestString += "]," + this.players[this.nextPlayer] + "," + this.beforeMina + ")";

		// Make Request
		this.getPrologRequest(requestString);
	}

	validMoves() {
		// Get Parameter Values
		var requestString = "validMoves([";

		for (var i = 0; i < this.initialBoard.length; i++) {
			requestString += "[";

			for (var j = 0; j < this.initialBoard[i].length; j++) {
				requestString += this.initialBoard[i][j];

				if (j != this.initialBoard[i].length - 1)
					requestString += ",";
			}

			requestString += "]";

			if (i != this.initialBoard.length - 1)
				requestString += ",";
		}

		requestString += "]," + this.players[this.nextPlayer] + ")";

		// Make Request
		this.getPrologRequest(requestString);
	}

	move() {
		if (this.finished || this.moving || this.animating)
			return;

		if (this.board.pickValid[0] == -1 || this.board.pickValid[1] == -1)
			return;

		this.moving = true;

		// Get Parameter Values
		var requestString = "move([";

		for (var i = 0; i < this.initialBoard.length; i++) {
			requestString += "[";

			for (var j = 0; j < this.initialBoard[i].length; j++) {
				requestString += this.initialBoard[i][j];

				if (j != this.initialBoard[i].length - 1)
					requestString += ",";
			}

			requestString += "]";

			if (i != this.initialBoard.length - 1)
				requestString += ",";
		}

		let move = "[" + this.board.pickValid[0] + "," + this.board.pickValid[1] + "]";

		requestString += "]," + this.players[this.nextPlayer] + "," + move + "," + this.beforeMina + ")";

		// Make Request
		this.getPrologRequest(requestString);
	}

	display() {
		this.board.display();
	}

	pick(id) {
		this.board.pick(id);
	}

	update(deltaTime) {
		if (!this.animating)
			return;

		this.animationTime += deltaTime;

		if (this.animationTime >= 1) {
			this.animating = false;
			this.animationTime = 0;
			this.board.update(1);
		}

		else this.board.update(this.animationTime);
	}

	find(player, position) {
		for (var i = 0; i < this.initialBoard.length; i++)
			for (var j = 0; j < this.initialBoard[i].length; j++)
				if (this.initialBoard[i][j] == player) {
					position[0] = i;
					position[1] = j;
					return;
				}
	}
}