class MyYuki extends CGFobject {
	constructor(scene) {
		super(scene);

		this.yuki1 = new CGFOBJModel(scene, 'models/yuki_eyes.obj');
		this.yuki2 = new CGFOBJModel(scene, 'models/yuki_pants.obj');
		this.yuki3 = new CGFOBJModel(scene, 'models/yuki_nothing1.obj');

		this.defmaterial = new CGFappearance(this.scene);
		this.defmaterial.setAmbient(1, 1, 1, 1);

		this.black = new CGFappearance(this.scene);
		this.black.setAmbient(0, 0, 0, 1);

		this.skin = new CGFappearance(this.scene);
		this.skin.setAmbient(0, 0.2, 0, 1);

		this.clothes = new CGFappearance(this.scene);
		this.clothes.setAmbient(0, 0, 0, 1);
	}

	display() {
		this.scene.pushMatrix();
		this.scene.scale(0.075,0.075,0.075);
		this.black.apply();
		this.yuki1.display();
		this.clothes.apply();
		this.yuki2.display();
		this.skin.apply();
		this.yuki3.display();
		this.defmaterial.apply();
		this.scene.popMatrix();
	}
}