/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
		this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3
		];

		var V1 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
		var V2 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];

		this.normals = [
			V1[1] * V2[2] - V1[2] * V2[1], V1[2] * V2[0] - V1[0] * V2[2], V1[0] * V2[1] - V1[1] * V2[0],
			V1[1] * V2[2] - V1[2] * V2[1], V1[2] * V2[0] - V1[0] * V2[2], V1[0] * V2[1] - V1[1] * V2[0],
			V1[1] * V2[2] - V1[2] * V2[1], V1[2] * V2[0] - V1[0] * V2[2], V1[0] * V2[1] - V1[1] * V2[0],

		];

		this.indices = [0, 1, 2];

		this.a = Math.sqrt(Math.pow((this.x3 - this.x1), 2) + Math.pow((this.y3 - this.y1), 2) + Math.pow((this.z3 - this.z1), 2));
		this.b = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2) + Math.pow((this.z2 - this.z1), 2));
		this.c = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2) + Math.pow((this.z3 - this.z2), 2));

		this.cos_a = (this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c);
		this.sin_a = Math.sqrt(this.a * this.a - (this.a * this.cos_a) * (this.a * this.cos_a)) / this.a;

		this.texCoords = [
			this.c - this.a * this.cos_a, 1 - this.a * this.sin_a,
			0, 1,
			this.c, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	changeTex(length_s, length_t){};
};
