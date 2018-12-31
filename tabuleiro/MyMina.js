class MyMina extends CGFobject {
	constructor(scene) {
		super(scene);

		this.mina = new MyVehicle(scene); //CGFOBJModel(scene, 'models/mina.obj');
	}

	display() {
		this.mina.display();
	}
}