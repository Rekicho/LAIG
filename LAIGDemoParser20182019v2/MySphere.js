/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySphere extends CGFobject {
	constructor(scene, radius, slices, stacks) {
		super(scene);

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var j = 0; j <= this.stacks; j++) {
			var angst = j * Math.PI / this.stacks;

			for (var i = 0; i <= this.slices; i++) {
				var angsl = (2 * Math.PI) * i / this.slices;

				this.vertices.push(this.radius * Math.cos(angsl) * Math.sin(angst),
					this.radius * Math.cos(angst),
					this.radius * Math.sin(angsl) * Math.sin(angst));

				this.normals.push(this.radius * Math.cos(angsl) * Math.sin(angst),
					this.radius * Math.cos(angst),
					this.radius * Math.sin(angsl) * Math.sin(angst));

				this.texCoords.push(1 - (i / this.slices), 1 - (j / this.stacks));
			}
		}

		for (var j = 0; j < this.stacks; j++) {
			for (var i = 0; i < this.slices; i++) {
				var ind = i + (this.slices + 1) * j;

				this.indices.push(ind, ind + this.slices + 2, ind + this.slices + 1);
				this.indices.push(ind, ind + 1, ind + this.slices + 2);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	changeTex() {};
};