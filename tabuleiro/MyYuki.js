class MyYuki extends CGFobject {
	constructor(scene) {
		super(scene);

		this.yuki = new CGFOBJModel(scene, 'models/yuki.obj');
	}

	display() {
		this.scene.pushMatrix();
		this.scene.scale(0.075,0.075,0.075);
		this.yuki.display();
		this.scene.popMatrix();
	}
}