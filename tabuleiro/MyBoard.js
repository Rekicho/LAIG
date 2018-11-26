class MyBoard extends CGFobject {
	constructor(scene, lines, columns) {
		super(scene);

		this.square = new MyPlane(this.scene, 1, 1);
		this.tree = new MyTree(this.scene);
		this.texture = new CGFtexture(this.scene, "images/snow.jpg");
		this.lines = lines;
		this.columns = columns;
	};

	display() {
		this.scene.pushMatrix();
		this.scene.translate(-this.columns / 2 + 0.5, 0, -this.lines / 2 + 0.5);
		for (var i = 0; i < this.lines; i++) {
			for (var j = 0; j < this.columns; j++) {
				this.scene.pushMatrix();
				this.tree.display();
				this.scene.popMatrix();
				this.texture.bind();
				this.square.display();
				this.scene.translate(1, 0, 0);
			}
			this.scene.translate(-this.columns, 0, 1);
		}
		this.scene.popMatrix();
	}
}