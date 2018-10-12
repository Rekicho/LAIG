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
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var ang = (2 * Math.PI) / this.slices;

		
		var z_ang = -Math.PI/2;
		var inc = Math.PI/this.stacks;

		for (let j = 0; j <= this.stacks; j++) {
			let edge = this.slices * j;
			let nextedge = this.slices * (j + 1);

			for (let i = 0; i < this.slices; i++) {
				let alpha = i * ang;
				let raiz = Math.sqrt(1 - Math.pow(Math.sin(z_ang), 2));

				this.vertices.push(this.radius * raiz * Math.cos(alpha), this.radius * raiz * Math.sin(alpha), this.radius * Math.sin(z_ang));
				this.normals.push(raiz * Math.cos(alpha), raiz * Math.sin(alpha), Math.sin(z_ang));
				this.texCoords.push(0.5 + (Math.cos(i * ang) * Math.cos(z_ang)), 1 - (Math.sin(i * ang) * Math.sin(z_ang)));

				//FALTA texCoords
				console.log(this.radius * raiz * Math.cos(alpha), this.radius * raiz * Math.sin(alpha), this.radius * Math.sin(z_ang));
				console.log(0.5 + (Math.cos(i * ang) * Math.cos(z_ang)), 1 - (Math.sin(i * ang) * Math.cos(z_ang)));

				if (j != this.stacks) {
					this.indices.push(edge + i, edge + i + 1, nextedge + i);
					this.indices.push(nextedge + i, edge + i + 1, edge + i);

					if (i == this.slices - 1) {
						this.indices.push(edge, edge + i + 1, edge + i);
						this.indices.push(edge + i, edge + i + 1, edge);
					}

					else {
						this.indices.push(nextedge + i + 1, nextedge + i, edge + i + 1);
						this.indices.push(edge + i + 1, nextedge + i, nextedge + i + 1);
					}
				}
			}

			z_ang += inc;
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
