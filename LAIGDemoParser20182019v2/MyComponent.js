/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, transformation, texture, length_s, length_t, componentRef, primitives) 
	{
		super(scene);

		this.transformation = transformation;
		this.componentRef = componentRef;
		this.primitives = primitives;
		this.texture = texture;
		this.length_s = length_s;
		this.length_t = length_t;

		this.children = [];
	};

	display(texture)
	{
		var temporaryTexture = this.texture;

		if(this.texture == "inherit")
			temporaryTexture = texture;

		if(temporaryTexture == "none")
		{
			if(this.scene.activeTexture != null)
			{
				this.scene.activeTexture.unbind();
				this.scene.activeTexture = null;
			}
		}

		else
		{
			temporaryTexture.bind();
			this.scene.activeTexture = temporaryTexture;
		}

		this.scene.pushMatrix();

		if(this.transformation != null)
			this.scene.multMatrix(this.transformation);

		for(var i = 0; i < this.children.length; i++)
				this.children[i].display(temporaryTexture);

		for(var i = 0; i < this.primitives.length; i++)
			this.primitives[i].display();

		this.scene.popMatrix();
	};

	buildChildren()
	{
		if(this.children != 0)
			return null;

		var error;

		for(var i = 0; i < this.componentRef.length; i++)
		{
			if(!(this.componentRef[i] in this.scene.graph.components)){
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
