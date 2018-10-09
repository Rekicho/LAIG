/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, transformation, componentRef, primitives) 
	{
		super(scene);

		this.transformation = transformation;
		this.componentRef = componentRef;
		this.primitives = primitives;
		this.children = [];
	};

	display()
	{
		if(this.transformation != null)
			this.scene.multMatrix(this.transformation);

		for(var i = 0; i < this.primitives.length; i++)
			this.primitives[i].display();

		for(var i = 0; i < this.children.length; i++)
			this.children[i].display();
	};

	buildChildren()
	{
		for(var i = 0; i < this.componentRef.length; i++)
		{
			if(!(this.componentRef[i] in this.scene.graph.components))
				return "component with id=" + this.componentRef[i] + " not found.";

			this.children.push(this.scene.graph.components[this.componentRef[i]]);
		}

		return null;
	};
};
