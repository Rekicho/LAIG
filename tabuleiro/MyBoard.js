class MyBoard extends CGFobject {
	constructor(scene, board, boardObjs, tree, texture, yuki, mina, valid) {
		super(scene);

		this.board = board;
		this.boardObjs = boardObjs;

		this.lines = this.board.length;
		this.columns = this.board[0].length;

		this.tree = tree;
		this.texture = texture;
		this.yuki = yuki;
		this.mina = mina;
		this.valid = valid;

		this.blue = new CGFtexture(this.scene, "images/water.jpg");
		this.selectedTexture = new CGFtexture(this.scene, "images/adspotify.jpg");

		this.picked = 0;
		this.pickValid = [];
	};

	display() {
		this.scene.pushMatrix();
		this.scene.translate(-this.columns / 2 + 0.5, 0, -this.lines / 2 + 0.5);
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.columns; j++) {
				this.scene.registerForPick((i * this.columns) + j + 1, this.boardObjs[i][j]);
				this.scene.pushMatrix();

				switch (this.board[i][j]) {
					case 't': this.tree.display();
						break;
					case 'y': this.scene.translate(0, 1.75, 0);
						this.scene.scale(0.25, 0.25, 0.25);
						this.yuki.display();
						break;
					case 'm': this.scene.translate(0, 0.5, 0);
						this.scene.rotate(Math.PI / 2, 1, 0, 0);
						this.mina.display();
				}

				this.scene.popMatrix();

				if (this.valid[i][j]){
					if(this.picked == (i * this.columns) + j + 1) {
						this.selectedTexture.bind();
						this.pickValid = [i, j];
					}
					
					else this.blue.bind();
				}

				else this.texture.bind();

				this.boardObjs[i][j].display();
				this.scene.translate(1, 0, 0);
			}
			this.scene.translate(-this.columns, 0, 1);
		}
		this.scene.popMatrix();
	}

	pick(id) {
		this.pickValid = [-1,-1];
		this.picked = id;
	}
}