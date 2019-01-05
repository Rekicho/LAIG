class MyGame extends CGFobject {
	constructor(scene, yuki, mina, gameType, difficulty) {
		super(scene);

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

		this.boardsList = [];
		this.boardsList.push(JSON.parse(JSON.stringify(this.initialBoard)));

		this.valid = [];

		for (var i = 0; i < this.initialBoard.length; i++) {
			let temp = [];

			for (var j = 0; j < this.initialBoard[i].length; j++)
				temp.push(true);

			this.valid.push(temp);
		}

		this.board = new MyBoard(this.scene, this.initialBoard, this.valid, yuki, mina, difficulty);

		this.wins = [0, 0];
		this.treesEaten = [0, 0];
		this.players = ['y', 'm'];

		this.beforeMina = 'm'; //nothing on start
		this.nextPlayer = 0;
		this.wonAs = null;

		this.beforeMinaList = [];
		this.beforeMinaList.push(this.beforeMina);

		switch (parseInt(gameType)) {
			case 2:
				this.ai = [true, true];
				break;
			case 1:
				this.ai = [false, true];
				break;
			default:
				this.ai = [false, false];
				break;
		}

		this.moving = false;
		this.animating = false;
		this.finished = false;
		this.animationTime = 0;

		this.scoreboard = new MyScoreBoard(scene);

		this.timer = 0;

		this.difficulty = parseInt(difficulty);

		switch (this.difficulty) {
			case 2:
				this.timeout = 10;
				break;
			case 1:
				this.timeout = 30;
				break;
			default:
				this.timeout = 60;
				break;
		}
	};

	getPrologRequest(requestString) {
		var requestPort = 8081;
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

		var self = this;
		this.undo = false;

		if (requestString[0] == 'v') {
			request.onload = function (data) {
				if (!self.undo)
					self.parseValid(data.target.response);
			};
		} else {
			request.onload = function (data) {
				if (!self.undo) {
					self.parseMove(data.target.response);
					self.animating = true;
					self.animationTime = 0;
					self.validMoves();
					self.board.pickValid = [-1, -1];
					self.moving = false;
				}
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
			this.wins[(this.nextPlayer + 1) % 2]++;
			this.scoreboard.setGames(this.wins);

			if (this.wins[0] + this.wins[1] >= 2)
				this.endGame(false);

			else this.changeGame();

			return;
		}

		var valid_moves = [];

		for (var i = 2; i < string.length; i += 6) {
			valid_moves.push([string[i], string[i + 2]]);
		}


		for (var i = 0; i < valid_moves.length; i++)
			this.valid[valid_moves[i][0]][valid_moves[i][1]] = true;

		this.timer = 0;
	}

	parseMove(string) {
		var index = 2;

		var lastPositon = [-1, -1];

		this.find(this.players[this.nextPlayer], lastPositon);

		var animationTrees = [];

		for (var i = 0; i < this.board.lines; i++)
			animationTrees.push(new Array(this.board.columns).fill(0));

		for (var i = 0; i < this.board.lines; i++) {
			for (var j = 0; j < this.board.columns; j++) {
				if (string[index] == this.players[this.nextPlayer]) {
					this.board.setAnimation(string[index], [i, j], lastPositon);

					if (string[index] == 'm')
						this.beforeMina = this.initialBoard[i][j];
				}

				if (this.initialBoard[i][j] == 't' && string[index] != 't')
					animationTrees[i][j] = -1.5;

				if (this.initialBoard[i][j] != 't' && string[index] == 't')
					animationTrees[i][j] = 1.5;

				this.initialBoard[i][j] = string[index];
				index += 2;
			}

			index += 2;
		}

		this.board.setAnimationTrees(animationTrees);

		if (this.players[this.nextPlayer] == 'y') {
			this.treesEaten[this.nextPlayer]++;
			this.scoreboard.setTrees(this.nextPlayer, this.treesEaten[this.nextPlayer]);
		}

		this.nextPlayer++;
		this.nextPlayer %= 2;
		this.scoreboard.setPlaying(this.nextPlayer);

		for (var i = 0; i < this.initialBoard.length; i++)
			for (var j = 0; j < this.initialBoard[i].length; j++)
				this.valid[i][j] = false;

		this.boardsList.push(JSON.parse(JSON.stringify(this.initialBoard)));
		this.beforeMinaList.push(this.beforeMina);
	}

	boardToString() {
		var boardString = "[";

		for (var i = 0; i < this.initialBoard.length; i++) {
			boardString += "[";

			for (var j = 0; j < this.initialBoard[i].length; j++) {
				boardString += this.initialBoard[i][j];

				if (j != this.initialBoard[i].length - 1)
					boardString += ",";
			}

			boardString += "]";

			if (i != this.initialBoard.length - 1)
				boardString += ",";
		}

		return boardString + "]";
	}

	validMoves() {
		// Get Parameter Values
		var requestString = "validMoves(" + this.boardToString();

		requestString += "," + this.players[this.nextPlayer] + ")";

		// Make Request
		this.getPrologRequest(requestString);
	}

	move() {
		if (this.finished || this.moving || this.animating)
			return;

		if (this.ai[this.nextPlayer])
			return this.randomMove();

		if (this.board.pickValid[0] == -1 || this.board.pickValid[1] == -1)
			return;

		this.moving = true;

		// Get Parameter Values
		var requestString = "move(" + this.boardToString();

		let move = "[" + this.board.pickValid[0] + "," + this.board.pickValid[1] + "]";

		requestString += "," + this.players[this.nextPlayer] + "," + move + "," + this.beforeMina + ")";

		// Make Request
		this.getPrologRequest(requestString);
	}

	randomMove() {
		if (this.finished || this.moving || this.animating)
			return;

		this.moving = true;

		// Get Parameter Values
		var requestString = "randomMove(" + this.boardToString();

		requestString += "," + this.players[this.nextPlayer] + "," + this.beforeMina + ")";

		// Make Request
		this.getPrologRequest(requestString);
	}

	display() {
		this.scoreboard.display();
		this.board.display(this.ai[this.nextPlayer], this.players[this.nextPlayer]);
	}

	pick(id) {
		if (!this.finished)
			this.board.pick(id);
	}

	update(deltaTime) {
		if (!this.finished && (!this.moving || this.ai[this.nextPlayer])) {
			this.timer += deltaTime;

			if (this.timer >= this.timeout)
				this.endGame(true);

			else this.scoreboard.setTimer(this.timeout - this.timer);
		}

		if (!this.animating)
			return;

		var oldTime = this.animationTime;
		this.animationTime += deltaTime;

		if(this.animationTime < 1)
			this.scene.interface.activeCamera.orbit(CGFcameraAxis.Z, Math.PI * deltaTime);

		else this.scene.interface.activeCamera.orbit(CGFcameraAxis.Z, Math.PI * (1 - oldTime));		

		if (this.animationTime >= 1) {
			this.animating = false;
			this.animationTime = 0;
			this.board.update(1);
		} else this.board.update(this.animationTime);
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

	checkWinner() {
		this.wonAs = this.players[(this.nextPlayer + 1) % 2];

		var wonAsString;

		if (this.wonAs == "y")
			wonAsString = "Yuki";

		else wonAsString = "Mina";

		alert("Player " + (((this.nextPlayer + 1) % 2) + 1) + " won playing as " + wonAsString + "!");
	}

	changeGame() {
		this.checkWinner();

		this.players = ['m', 'y'];
		this.scoreboard.changePlayers();

		this.beforeMina = 'm'; //nothing on start
		this.nextPlayer = 1;
		this.scoreboard.setPlaying(this.nextPlayer);

		for (var i = 0; i < this.initialBoard.length; i++) {
			for (var j = 0; j < this.initialBoard[i].length; j++) {
				this.initialBoard[i][j] = "t";
			}
		}

		this.animating = false;
		this.animationTime = 0;

		this.timer = 0;

		this.boardsList = [];
		this.beforeMinaList = [];

		this.board.changeGame();
		this.scene.interface.activeCamera.setPosition([0,7,-3]);
		this.validMoves();
	}

	solveTie() {
		if (this.treesEaten[0] == this.treesEaten[1]) {
			this.scoreboard.setWinner('t');
			alert("The match was a tie!");
		} else if (this.wonAs == 'y') {
			if (this.treesEaten[0] > this.treesEaten[1]) {
				this.scoreboard.setWinner(1);
				alert("Player 2 won the match!");
			} else {
				this.scoreboard.setWinner(0);
				alert("Player 1 won the match!");
			}
		} else {
			if (this.treesEaten[0] > this.treesEaten[1]) {
				this.scoreboard.setWinner(0);
				alert("Player 1 won the match!");
			} else {
				this.scoreboard.setWinner(1);
				alert("Player 2 won the match!");
			}
		}
	}

	endGame(timeout) {
		this.finished = true;

		if (timeout) {
			for (var i = 0; i < this.initialBoard.length; i++)
				for (var j = 0; j < this.initialBoard[i].length; j++)
					this.valid[i][j] = false;

			alert("Player " + (((this.nextPlayer + 1) % 2) + 1) + " won the match because Player " + (this.nextPlayer + 1) + " didn't play in time!");
			this.scoreboard.setTimer(0);
			this.scoreboard.setWinner((this.nextPlayer + 1) % 2);
			return;
		}

		this.checkWinner();

		if (this.wins[0] > this.wins[1]) {
			this.scoreboard.setWinner(0);
			alert("Player 1 won the match!");
		} else if (this.wins[0] < this.wins[1]) {
			this.scoreboard.setWinner(1);
			alert("Player 2 won the match!");
		} else this.solveTie();
	}

	changeGraphTextures() {
		this.board.changeGraphTextures();
	}

	undoMove() {
		if (this.finished || this.boardsList.length < 2)
			return;

		this.undo = true;

		this.nextPlayer--;
		if (this.nextPlayer < 0)
			this.nextPlayer = 1;

		if (this.players[this.nextPlayer] == 'y') {
			this.treesEaten[this.nextPlayer]--;
			this.scoreboard.setTrees(this.nextPlayer, this.treesEaten[this.nextPlayer]);
		}

		this.scoreboard.setPlaying(this.nextPlayer);

		for (var i = 0; i < this.initialBoard.length; i++)
			for (var j = 0; j < this.initialBoard[i].length; j++)
				this.valid[i][j] = false;

		this.initialBoard = JSON.parse(JSON.stringify(this.boardsList[this.boardsList.length - 2]));
		this.board.board = this.initialBoard;
		this.boardsList.pop();

		this.beforeMina = this.beforeMinaList[this.beforeMinaList.length - 2];
		this.beforeMinaList.pop();

		this.board.undo();

		this.animating = false;
		this.animationTime = 0;

		if(this.nextPlayer == 0)
			this.scene.interface.activeCamera.setPosition([0,7,3]);

		else this.scene.interface.activeCamera.setPosition([0,7,-3]);

		this.timer = 0;

		this.validMoves();
	}
}