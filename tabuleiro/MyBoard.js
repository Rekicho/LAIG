class MyBoard extends CGFobject {
	constructor(scene, board, square, tree, texture, yuki, mina) {
		super(scene);

		this.board = board;

		this.lines = this.board.length;
		this.columns = this.board[0].length;

		this.square = square;
		this.tree = tree;
		this.texture = texture;
		this.yuki = yuki;
		this.mina = mina;

		this.blue = new CGFtexture(this.scene, "images/water.jpg")
	};

	display() {
		this.scene.pushMatrix();
		this.scene.translate(-this.columns / 2 + 0.5, 0, -this.lines / 2 + 0.5);
		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.columns; j++) {
				this.scene.pushMatrix();

				switch (this.board[i][j]) {
					case 'v':
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
				switch (this.board[i][j]) {
					case 'v': this.blue.bind();
						break;
					default: this.texture.bind();
				}

				this.square.display();
				this.scene.translate(1, 0, 0);
			}
			this.scene.translate(-this.columns, 0, 1);
		}
		this.scene.popMatrix();
	}
}