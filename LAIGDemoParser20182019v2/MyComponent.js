/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject {
	constructor(scene, transformation, materials, texture, length_s, length_t, componentRef, primitives) {
		super(scene);

		this.transformation = transformation;
		this.materials = materials;
		this.texture = texture;
		this.length_s = length_s;
		this.length_t = length_t;
		this.componentRef = componentRef;
		this.primitives = primitives;

		this.children = [];
	};

	display(texture, length_s, length_t) {
		var materialsIndex = this.scene.materialsIndex % this.materials.length;

		if (this.materials[materialsIndex] != "inherit")
			this.materials[materialsIndex].apply();

		var temporaryTexture = this.texture;
		var temporary_s = this.length_s;
		var temporary_t = this.length_t;

		if (this.texture == "inherit") {
			temporaryTexture = texture;

			if(length_s != null)
				temporary_s = length_s;
			if(length_t != null)
				temporary_t = length_t;
		}

		if (temporaryTexture == "none") {
			if (this.scene.activeTexture != null) {
				this.scene.activeTexture.unbind();
				this.scene.activeTexture = null;
			}
		}

		else {
			temporaryTexture.bind();
			this.scene.activeTexture = temporaryTexture;
		}

		this.scene.pushMatrix();

		if (this.transformation != null)
			this.scene.multMatrix(this.transformation);

		for (var i = 0; i < this.primitives.length; i++)
		{
			//this.primitives[i].changeTex(temporary_s, temporary_t);
			this.primitives[i].display();
		}

		for (var i = 0; i < this.children.length; i++)
			this.children[i].display(temporaryTexture, temporary_s, temporary_t);

		this.scene.popMatrix();
	};

	buildChildren() {
		if (this.children != 0)
			return null;

		var error;

		for (var i = 0; i < this.componentRef.length; i++) {
			if (!(this.componentRef[i] in this.scene.graph.components)) {
				console.log("component with id=" + this.componentRef[i] + " not found.");
				return "";
			}
			this.children.push(this.scene.graph.components[this.componentRef[i]]);
			if ((error = this.children[i].buildChildren()) != null)
				return error;
		}

		return null;
	};
};
