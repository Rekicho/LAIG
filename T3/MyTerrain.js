/**
 * MyTerrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTerrain extends CGFobject {
	constructor(scene, texture, heightmap, parts, heightscale) {
		super(scene);
		this.texture = texture;
		this.heightmap = heightmap;

		this.plane = new MyPlane(scene, parts, parts);

		this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
		this.shader.setUniformsValues({texture: 0});
		this.shader.setUniformsValues({heightmap: 1});
		this.shader.setUniformsValues({heightscale: heightscale});
	};

	display() {
		this.scene.setActiveShader(this.shader);
		this.texture.bind(0);
		this.heightmap.bind(1);
		this.plane.display();
		this.texture.unbind(0);
		this.heightmap.unbind(1);
		this.scene.setActiveShader(this.scene.defaultShader);
	};

	changeTex(length_s, length_t) { };
};