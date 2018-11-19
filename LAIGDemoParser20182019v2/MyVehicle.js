/**
 * MyVehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyVehicle extends CGFobject {
	constructor(scene) {
		super(scene);

		var controlPoints1 = [
			[
				[0, -1.17, 2, 1],
				[0.5, 0, 2, 1],
				[0, 1.17, 2, 1]
			],
			[
				[1.5, -1.17, 2, 1],
				[1.5, 0, 2, 1],
				[1.5, 1.17, 2, 1]
			],
			[
				[2, 0, 0, 1],
				[2, 0, 0, 1],
				[2, 0, 0, 1]
			]
		];

		var controlPoints2 = [
			[
				[0, 1.17, 2, 1],
				[0.5, 0, 2, 1],
				[0, -1.17, 2, 1]
			],
			[
				[1.5, 1.17, 2, 1],
				[1.5, 0, 2, 1],
				[1.5, -1.17, 2, 1]
			],
			[
				[2, 0, 0, 1],
				[2, 0, 0, 1],
				[2, 0, 0, 1]
			]
		];

		this.cube = new MyUnitCube(this.scene);
		this.triangle = new MyTriangle(this.scene, 0, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0);
		this.quad = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
		this.cylinder = new MyCylinder(this.scene, 1, 1, 1, 20, 20);
		this.cylinder2 = new MyCylinder2(this.scene, 1, 1, 1, 20, 20);
		this.sphere = new MySphere(this.scene, 1, 20, 20);
		this.umbrellaexterior = new MyPatch(this.scene, 3, 3, 20, 20, controlPoints1);
		this.umbrellainterior = new MyPatch(this.scene, 3, 3, 20, 20, controlPoints2);


		this.face = new CGFappearance(this.scene);
		this.face.loadTexture("images/face.jpg");
		this.face.setAmbient(1, 1, 1, 1);

		this.balltex = new CGFappearance(this.scene);
		this.balltex.loadTexture("images/ball.jpg");
		this.balltex.setAmbient(0.5, 0.5, 0.5, 1);

		this.jersey = new CGFappearance(this.scene);
		this.jersey.setAmbient(0, 0.5, 0, 1);

		this.blacktexture = new CGFappearance(this.scene);
		this.blacktexture.setAmbient(0, 0, 0, 1);

		this.skin = new CGFappearance(this.scene);
		this.skin.setAmbient(0.3, 0.2, 0.15, 1);

		this.silver = new CGFappearance(this.scene);
		this.silver.setAmbient(0.9, 0.9, 0.9, 1);
	};

	display() {
		//Umbrella PARTE DE CIMA
		this.scene.pushMatrix();

		this.scene.translate(0, 1, 0);
		this.scene.rotate(Math.PI / 2, 0, 0, 1);

		this.blacktexture.apply();
		this.umbrellainterior.display();
		this.umbrellaexterior.display();
		this.scene.rotate(Math.PI / 3, 1, 0, 0);
		this.umbrellainterior.display();
		this.umbrellaexterior.display();
		this.scene.rotate(Math.PI / 3, 1, 0, 0);
		this.umbrellainterior.display();
		this.umbrellaexterior.display();
		this.scene.rotate(Math.PI / 3, 1, 0, 0);
		this.umbrellainterior.display();
		this.umbrellaexterior.display();
		this.scene.rotate(Math.PI / 3, 1, 0, 0);
		this.umbrellainterior.display();
		this.umbrellaexterior.display();
		this.scene.rotate(Math.PI / 3, 1, 0, 0);
		this.umbrellainterior.display();
		this.umbrellaexterior.display();
		this.scene.rotate(Math.PI / 3, 1, 0, 0);
		this.scene.popMatrix();


		//Umbrella SUPORTE
		this.scene.pushMatrix();
		this.scene.translate(0, 3, 0);
		this.scene.rotate(Math.PI / 2, 1, 0, 0);
		this.scene.scale(0.1, 0.1, 3);
		this.silver.apply();
		this.cylinder2.display();
		this.scene.popMatrix();

		//Braço Direito da pessoa
		this.scene.pushMatrix();
		this.scene.scale(0.2, 2.2, 0.2);
		this.scene.rotate(Math.PI / 2, 1, 0, 0);

		this.skin.apply();
		this.cylinder.display();
		this.scene.popMatrix();

		//Corpo da Pessoa
		this.scene.pushMatrix();
		this.scene.translate(0.93, -2.75, 0);
		this.scene.scale(1.5, 2, 0.5);
		this.jersey.apply();
		this.cube.display();
		this.scene.popMatrix();

		//Braço Esquerdo da pessoa
		this.scene.pushMatrix();
		this.scene.translate(-0.9, -1.5, 0)
		this.scene.rotate(Math.PI / 6, 0, 0, 1)

		this.scene.translate(1.85, -1.75, 0);
		this.scene.scale(0.2, 2.2, 0.2);
		this.scene.rotate(Math.PI / 2, 1, 0, 0);

		this.skin.apply();
		this.cylinder.display();
		this.scene.popMatrix();

		//Pescoço
		this.scene.pushMatrix();
		this.scene.translate(0.97, -1.45, 0);
		this.scene.rotate(Math.PI / 2, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.3);
		this.skin.apply();
		this.cylinder2.display();
		this.scene.popMatrix();

		//Cabeça
		this.scene.pushMatrix();
		this.scene.translate(0.97, -0.60, 0);
		this.scene.scale(0.4, 0.9, 0.45);
		this.scene.rotate(Math.PI / 2, 1, 0, 0);
		this.scene.rotate(-Math.PI / 2, 0, 0, 1);
		this.face.apply();
		this.cylinder.display();
		this.scene.popMatrix();

		//Perna esquerda
		this.scene.pushMatrix();
		this.scene.translate(0.60, -5, 0);
		this.scene.scale(0.6, 2.5, 0.4);
		this.silver.apply();
		this.cube.display();
		this.scene.popMatrix();


		//Perna direita
		this.scene.pushMatrix();
		this.scene.translate(1.3, -5, 0);
		this.scene.scale(0.6, 2.5, 0.4);
		this.silver.apply();
		this.cube.display();
		this.scene.popMatrix();

		//Pé esquerdo 
		this.scene.pushMatrix();
		this.scene.translate(1.3, -6.4, 0.15);
		this.scene.scale(0.6, 0.4, 0.75);
		this.blacktexture.apply();
		this.cube.display()
		this.scene.popMatrix();

		//Pé direito
		this.scene.pushMatrix();
		this.scene.translate(0.6, -6.4, 0.15);
		this.scene.scale(0.6, 0.4, 0.75);
		this.blacktexture.apply();
		this.cube.display()
		this.scene.popMatrix();

		//Bola
		this.scene.pushMatrix();
		this.scene.translate(2, -3.9, 0);
		this.scene.scale(0.4, 0.4, 0.4);
		this.balltex.apply();
		this.sphere.display()
		this.scene.popMatrix();

	};

	changeTex(length_s, length_t) { };
};