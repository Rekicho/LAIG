/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);
		this.height = height;
		this.botRad = base;
		this.topRad = top;
		this.stacks = stacks;
		this.slices = slices;

		this.deltaHeight = this.height / this.stacks;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var ang = (2 * Math.PI) / this.slices;

		var Sincrement = 1 / this.slices;
		var Tincrement = 1 / this.stacks;

		var raio = this.botRad;
		var nextR = (this.topRad - this.botRad) / this.stacks;
		var z = 0;
		var nextZ = this.height / this.stacks;

		for (let i = 0; i <= this.slices; i++) {
			this.vertices.push(0, 0, 0);
			this.normals.push(0, 0, -1);
			this.texCoords.push(1 - Sincrement * i, 0);
		}

		for (var j = 0; j <= this.stacks; j++) {
			for (var i = 0; i <= this.slices; i++) {
				this.vertices.push(Math.cos(i * ang) * raio, Math.sin(i * ang) * raio, z);
				this.normals.push(Math.cos(i * ang), Math.sin(i * ang), 0);
				this.texCoords.push(1 - Sincrement * i, 0 + Tincrement * j);
			}

			z += nextZ;
			raio += nextR;
		}

		for (let i = 0; i <= this.slices; i++) {
			this.vertices.push(0, 0, this.height);
			this.normals.push(0, 0, 1);
			this.texCoords.push(1 - Sincrement * i, 1);
		}

		var ind = 0;
		for (var i = 0; i <= this.stacks + 1; i++) {
			for (var j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + 1, ind + this.slices + 1);
					this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
				}
				ind++;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	changeTex(length_s, length_t){};
};