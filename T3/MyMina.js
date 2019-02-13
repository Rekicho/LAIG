class MyMina extends CGFobject {
	constructor(scene) {
		super(scene);

		this.mina1 = new CGFOBJModel(scene, 'models/mina_eyes.obj');
		this.mina2 = new CGFOBJModel(scene, 'models/mina_hair_eyebrows.obj');
		this.mina3 = new CGFOBJModel(scene, 'models/mina_nothing.obj');
		this.mina4 = new CGFOBJModel(scene, 'models/mina_shirt.obj');
		this.mina5 = new CGFOBJModel(scene, 'models/mina_skirt_shoes.obj');

		this.face = new CGFappearance(this.scene);
		this.face.setAmbient(1, 1, 1, 1);

		this.defmaterial = new CGFappearance(this.scene);
		this.defmaterial.setAmbient(1, 1, 1, 1);

		this.black = new CGFappearance(this.scene);
		this.black.setAmbient(0, 0, 0, 1);

		this.brown = new CGFappearance(this.scene);
		this.brown.setAmbient(0.4, 0.2, 0, 1);

		this.skin = new CGFappearance(this.scene);
		this.skin.setAmbient(1, 0.9, 0.6, 1);

		this.shirt = new CGFappearance(this.scene);
		this.shirt.setAmbient(0.5, 0, 0, 1);
	}

	display() {
		this.scene.pushMatrix();
		this.scene.scale(0.125,0.125,0.125);
		
		this.black.apply();
		this.mina1.display();

		this.brown.apply();
		this.mina2.display();
		
		this.skin.apply();
		this.mina3.display();
		
		this.shirt.apply();
		this.mina4.display();
		
		this.black.apply();
		this.mina5.display();
		this.defmaterial.apply();
		this.scene.popMatrix();
	}
}