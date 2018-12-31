class MyYuki extends CGFobject {
	constructor(scene) {
		super(scene);

		this.yuki = new MyVehicle(scene); //CGFOBJModel(scene, 'models/yuki.obj');
	}

	display() {
		this.yuki.display();
	}
}