class MyTree extends CGFobject {
	constructor(scene) {
		super(scene);

		this.tree = new MyCylinder(this.scene, 0.375, 0, 1, 20, 20);
		this.trunk = new MyCylinder(this.scene, 0.1, 0.1, 0.5, 20, 20);
		this.treeTexture = scene.graph.textures["treeTexture"] || new CGFtexture(this.scene, "images/tree.jpg");
		this.trunkTexture = scene.graph.textures["trunkTexture"] || new CGFtexture(this.scene, "images/trunk.jpg");
	};

	display() {
		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.trunkTexture.bind();
		this.trunk.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.treeTexture.bind();
		this.tree.display();
		this.scene.popMatrix();
	}

	changeGraphTextures() {
		this.treeTexture = this.scene.graph.textures["treeTexture"] || new CGFtexture(this.scene, "images/tree.jpg");
		this.trunkTexture = this.scene.graph.textures["trunkTexture"] || new CGFtexture(this.scene, "images/trunk.jpg");
	}
}