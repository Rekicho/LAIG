class MyMina extends CGFobject {
	constructor(scene) {
		super(scene);

		this.mina = new CGFOBJModel(scene, 'models/mina.obj');
	}

	display() {
		this.scene.pushMatrix();
		this.scene.scale(0.125,0.125,0.125);
		this.mina.display();
		this.scene.popMatrix();
	}
}