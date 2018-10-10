/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, transformation, textureString, length_s, length_t, componentRef, primitives) 
	{
		super(scene);

		this.transformation = transformation;
		this.componentRef = componentRef;
		this.primitives = primitives;
		this.textureString = textureString;
		this.length_s = length_s;
		this.length_t = length_t;

		this.children = [];

		this.texture;
	};

	display()
	{
		if(this.texture != null)
			this.texture.apply();

		this.scene.pushMatrix();

		if(this.transformation != null)
			this.scene.multMatrix(this.transformation);

		for(var i = 0; i < this.primitives.length; i++)
			this.primitives[i].display();

		for(var i = 0; i < this.children.length; i++)
			this.children[i].display();

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

	inheritTextures(texture)
	{
		if(this.texture != null)
			return null;

		if(this.textureString == "inherit")
		{
			if(texture == "none")
			{
				console.log("can't inherit texture 'none'");
				return "";
			}

			this.texture = new CGFappearance(this.scene);
			this.texture.loadTexture(texture);

			this.textureString = texture;
		}

		else if(this.textureString != "none")
		{
			this.texture = new CGFappearance(this.scene);
			this.texture.loadTexture(this.textureString);
		}

		var error;

		for(var i = 0; i < this.children.length; i++)
			if(error = this.children[i].inheritTextures(this.textureString) != null)
				return error;

		return null;
	}
};
