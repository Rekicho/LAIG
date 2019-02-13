/**
 * MyUnitCube
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			-0.5, -0.5, -0.5,
			-0.5, -0.5, 0.5,
			-0.5, 0.5, -0.5,
			-0.5, 0.5, 0.5,
			0.5, -0.5, -0.5,
			0.5, -0.5, 0.5,
			0.5, 0.5, -0.5,
			0.5, 0.5, 0.5
		];

		this.indices = [
			//Face x = -0.5
			0, 1, 2,
			1, 3, 2,
			//Face x = 0.5
			5, 4, 6,
			5, 6, 7,
			//Face z = 0.5
			1, 5, 3,
			5, 7, 3,
			//Face y = 0.5
			7, 6, 2,
			3, 7, 2,
			//Face z = -0.5
			4, 0, 6,
			6, 0, 2,
			//Face y = -0.5
			4, 5, 1,
			4, 1, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};