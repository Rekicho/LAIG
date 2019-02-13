/**
 * MyWater
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyWater extends CGFobject {
	constructor(scene, texture, wavemap, parts, heightscale, texscale) {
		super(scene);
		this.texture = texture;
		this.wavemap = wavemap;
		this.time = 0;
		this.offset = 0;
		this.parts = parts;

		this.plane = new MyPlane(scene, parts, parts);

		this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
		this.shader.setUniformsValues({
			texture: 0
		});
		this.shader.setUniformsValues({
			wavemap: 1
		});
		this.shader.setUniformsValues({
			heightscale: heightscale
		});
		this.shader.setUniformsValues({
			texscale: texscale
		});
		this.shader.setUniformsValues({
			offset: 0
		});
	};

	display() {
		this.scene.setActiveShader(this.shader);
		this.texture.bind(0);
		this.wavemap.bind(1);
		this.plane.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	};

	changeTex(length_s, length_t) {};

	update(time) {
		this.time += time;

		if (this.time > 0.1) {
			this.time = 0;
			this.offset += 1 / this.parts;
			this.shader.setUniformsValues({
				offset: this.offset
			});
		}

	};
};