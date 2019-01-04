class MyBoard extends CGFobject {
	constructor(scene, board, valid, yuki, mina, difficulty) {
		super(scene);

		this.board = board;

		this.lines = this.board.length;
		this.columns = this.board[0].length;

		this.tree = new MyTree(this.scene);
		this.tile = new MyPlane(this.scene, 1, 1);

		this.yuki = yuki;
		this.mina = mina;

		this.valid = valid;

		this.tileTexture = scene.graph.textures["tileTexture"] || new CGFtexture(this.scene, "images/snow.jpg");
		this.yukiPossibleTexture = new CGFtexture(this.scene, "images/yukiPossible.jpg");
		this.minaPossibleTexture = new CGFtexture(this.scene, "images/minaPossible.jpg");
		this.selectedTexture = new CGFtexture(this.scene, "images/selected.jpg");

		this.picked = 0;
		this.pickValid = [-1, -1];

		this.animationPlayer = ' ';
		this.animationX = 0;
		this.animationZ = 0;
		this.animationAngle = 0;
		this.animationTime = 0;
		this.treePositions = [];
		this.animationTrees = [];

		for (var i = 0; i < this.lines; i++) {
			this.treePositions.push(new Array(this.columns).fill(0));
			this.animationTrees.push(new Array(this.columns).fill(0));
		}

		if(difficulty == 2)
			this.hard = true;

		else this.hard = false;
	};

	display(ai, player) {
		this.scene.pushMatrix();
		this.scene.translate(-this.columns / 2 + 0.5, 0, -this.lines / 2 + 0.5);
		for (var i = 0; i < this.lines; i++) {
			for (var j = 0; j < this.columns; j++) {
				this.scene.registerForPick((i * this.columns) + j + 1, this.tile);
				this.scene.pushMatrix();

				if (this.animationTime != 1 && this.animationPlayer == this.board[i][j]) {
					this.scene.translate(this.animationX * (1 - this.animationTime), Math.sin(this.animationTime * Math.PI), this.animationZ * (1 - this.animationTime));
					this.scene.rotate(this.animationAngle, 0, 1, 0);
				}

				switch (this.board[i][j]) {
					case 'y':
						this.yuki.display();
						break;
					case 'm':
						this.mina.display();
				}

				this.scene.popMatrix();

				if(!this.hard){
					this.scene.pushMatrix();
					this.scene.translate(0, this.treePositions[i][j] + (this.animationTime * this.animationTrees[i][j]), 0);
					this.tree.display();
					this.scene.popMatrix();
				}

				if (this.valid[i][j] && !ai) {
					if (this.picked == (i * this.columns) + j + 1) {
						this.selectedTexture.bind();
						this.pickValid = [i, j];
					} else {
						if(player == 'y')
							this.yukiPossibleTexture.bind();

						else this.minaPossibleTexture.bind();
					}
				} else this.tileTexture.bind();

				this.tile.display();
				this.scene.translate(1, 0, 0);
			}
			this.scene.translate(-this.columns, 0, 1);
		}
		this.scene.popMatrix();
	}

	pick(id) {
		this.pickValid = [-1, -1];
		this.picked = id;
	}

	update(animationTime) {
		this.animationTime = animationTime;
	}

	setAnimation(player, newPosition, lastPosition) {
		this.animationPlayer = player;

		if (lastPosition[0] == -1 || lastPosition[1] == -1) {
			this.animationZ = 0;
			this.animationX = 0;
			this.animationAngle = 0;
		} else {
			this.animationZ = lastPosition[0] - newPosition[0];
			this.animationX = lastPosition[1] - newPosition[1];

			if (this.animationX == 0)
				this.animationAngle = 0;

			else this.animationAngle = Math.atan((newPosition[1] - lastPosition[1]) / (newPosition[0] - lastPosition[0]));

			if (this.animationZ > 0)
				this.animationAngle += Math.PI;
		}
	}

	setAnimationTrees(animationTrees) {
		for (var i = 0; i < this.lines; i++)
			for (var j = 0; j < this.columns; j++)
				this.treePositions[i][j] += this.animationTrees[i][j];

		this.animationTrees = animationTrees;
	}

	changeGame() {
		this.picked = 0;
		this.pickValid = [-1, -1];

		this.animationPlayer = ' ';
		this.animationX = 0;
		this.animationZ = 0;
		this.animationAngle = 0;
		this.animationTime = 0;
		this.treePositions = [];
		this.animationTrees = [];

		for (var i = 0; i < this.lines; i++) {
			this.treePositions.push(new Array(this.columns).fill(0));
			this.animationTrees.push(new Array(this.columns).fill(0));
		}
	}

	changeGraphTextures() {
		this.tileTexture = this.scene.graph.textures["tileTexture"] || new CGFtexture(this.scene, "images/snow.jpg");
		this.tree.changeGraphTextures();
	}

	undo() {
		this.picked = 0;
		this.pickValid = [-1, -1];

		this.animationPlayer = ' ';
		this.animationX = 0;
		this.animationZ = 0;
		this.animationAngle = 0;
		this.animationTime = 0;
		this.animationTrees = [];

		for (var i = 0; i < this.lines; i++) {
			this.animationTrees.push(new Array(this.columns).fill(0));
		}

		for (var i = 0; i < this.lines; i++)
			for (var j = 0; j < this.columns; j++){
				if(this.board[i][j] == 't')
					this.treePositions[i][j] = 0;

				else this.treePositions[i][j] = -1.5;
			}
	}
}