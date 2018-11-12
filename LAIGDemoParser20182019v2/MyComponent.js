/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject {
	constructor(scene, transformation, animations, materials, texture, length_s, length_t, componentRef, primitives) {
		super(scene);

		this.transformation = transformation;
		this.animations = animations;
		this.materials = materials;
		this.texture = texture;
		this.length_s = length_s;
		this.length_t = length_t;
		this.componentRef = componentRef;
		this.primitives = primitives;

		this.children = [];
	};

	display(material, texture, length_s, length_t) {
		var materialsIndex = this.scene.materialsIndex % this.materials.length;

		if (this.materials[materialsIndex] != "inherit")
			material = this.materials[materialsIndex];

		material.apply();

		var temporaryTexture = this.texture;
		var temporary_s = this.length_s;
		var temporary_t = this.length_t;

		if (this.texture == "inherit") {
			temporaryTexture = texture;

			if (temporary_s == null)
				temporary_s = length_s;
			if (temporary_t == null)
				temporary_t = length_t;
		}

		if (temporaryTexture == "none") {
			if (this.scene.activeTexture != null) {
				this.scene.activeTexture.unbind();
				this.scene.activeTexture = null;
			}
		}

		else if (temporaryTexture != this.scene.activeTexture) {
			temporaryTexture.bind();
			this.scene.activeTexture = temporaryTexture;
		}

		this.scene.pushMatrix();

		if (this.transformation != null)
			this.scene.multMatrix(this.transformation);

		for (var i = 0; i < this.animations.length; i++)
			this.animations[i].apply();

		for (var i = 0; i < this.primitives.length; i++) {
			this.primitives[i].changeTex(temporary_s, temporary_t);
			this.primitives[i].display();
		}

		for (var i = 0; i < this.children.length; i++)
			this.children[i].display(material, temporaryTexture, temporary_s, temporary_t);

		this.scene.popMatrix();
	};

	buildChildren() {
		if (this.children != 0)
			return null;

		var error;

		for (var i = 0; i < this.componentRef.length; i++) {
			if (!(this.componentRef[i] in this.scene.graph.components)) {
				console.error("component with id=" + this.componentRef[i] + " not found.");
				return "";
			}
			this.children.push(this.scene.graph.components[this.componentRef[i]]);
			if ((error = this.children[i].buildChildren()) != null)
				return error;
		}

		return null;
	};

	//TODO: Same animation in different components
	update(time) {
		for (var i = 0; i < this.animations.length; i++)
		{
			this.animations[i].update(time);
			if(!this.animations[i].finished)
				break;
		}

		for (var i = 0; i < this.children.length; i++)
			this.children[i].update(time);
	};
};
