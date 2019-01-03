class MyScoreBoard extends CGFobject {
	constructor(scene) {
		super(scene);

		this.board = new MyPlane(scene, 1, 1);
		this.tree = new CGFtexture(scene,"images/tree.png");
		this.gamePad = new CGFtexture(scene,"images/gamepad.jpg");
		this.yukiSign = new CGFtexture(scene,"images/yukiSign.jpg");
		this.minaSign = new CGFtexture(scene,"images/minaSign.jpg");
		this.p = new CGFtexture(scene,"images/P.jpg");

		this.digits = [];
		for(var i = 0; i < 10; i++)
			this.digits.push(new CGFtexture(scene,"images/digit" + i + ".png"));

		this.twoPoints = new CGFtexture(scene,"images/twoPoints.png");

		this.trees = [[0,0],[0,0]];
		this.games = [0,0];
		this.players = [this.yukiSign, this.minaSign];
		this.playing = 0;
		this.timer = [0,0,0,0];
	}

	display() {
		this.scene.pushMatrix();

			//Trees
			this.digits[this.trees[0][0]].bind();
			this.scene.translate(-8.25,2,-5);
			this.scene.rotate(Math.PI/4,1,0,0);
			this.scene.rotate(Math.PI,0,1,0);
			this.board.display();

			this.digits[this.trees[0][1]].bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			this.tree.bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			this.digits[this.trees[1][0]].bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			this.digits[this.trees[1][1]].bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			//Playing
			this.players[this.playing].bind();
			this.scene.translate(-3.25,0,0);
			this.board.display();

			this.p.bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			this.digits[this.playing+1].bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			//Timer
			this.scene.pushMatrix();

				this.digits[this.timer[0]].bind();
				this.scene.translate(2.75,0,1);
				this.board.display();

				this.digits[this.timer[1]].bind();
				this.scene.translate(-1,0,0);
				this.board.display();

				this.twoPoints.bind();
				this.scene.translate(-0.75,0,0);
				this.scene.pushMatrix();
				this.scene.scale(0.5,1,1);
				this.board.display();
				this.scene.popMatrix();

				this.digits[this.timer[2]].bind();
				this.scene.translate(-0.75,0,0);
				this.board.display();

				this.digits[this.timer[3]].bind();
				this.scene.translate(-1,0,0);
				this.board.display();

			this.scene.popMatrix();


			//Games & Players
			this.digits[this.games[0]].bind();
			this.scene.translate(-2.5,0,0);
			this.board.display();

			this.players[0].bind();
			this.scene.translate(0,0,1);
			this.board.display();

			this.gamePad.bind();
			this.scene.translate(-1,0,-1);
			this.board.display();

			this.digits[this.games[1]].bind();
			this.scene.translate(-1,0,0);
			this.board.display();

			this.players[1].bind();
			this.scene.translate(0,0,1);
			this.board.display();

		this.scene.popMatrix();
	}

	setTrees(player,trees){
		this.trees[player][0] = Math.floor(trees/10);
		this.trees[player][1] = trees % 10;
	}

	setGames(wins) {
		this.games[0] = wins[0];
		this.games[1] = wins[1];
	}

	changePlayers() {
		var temp = this.players[0]
		this.players[0] = this.players[1];
		this.players[1] = temp;
	}

	setPlaying(playing) {
		this.playing = playing;
	}

	setTimer(timer) {
		this.timer[0] = Math.floor(timer / 600);
		this.timer[1] = Math.floor((timer % 600) / 60);
		this.timer[2] = Math.floor(((timer % 600) % 60) / 10);
		this.timer[3] = Math.floor(((timer % 600) % 60) % 10);
	}
}