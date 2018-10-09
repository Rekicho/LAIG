/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySphere extends CGFobject
{
	constructor(scene,slices,stacks, minS, maxS, minT, maxT) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		
		this.minS = minS || 0.0;
        this.minT = minT || 0.0;
        this.maxS = maxS || 1.0;
        this.maxT = maxT || 1.0;
        this.semisphere = new MyLamp(scene,20,20);

        this.backboard = new CGFappearance(this.scene);
		this.backboard.loadTexture("../resources/images/basketball.png"); 
		this.backboard.setAmbient(1,1,1,1);
		
	};

	display() 
	{
		this.scene.pushMatrix();
		this.backboard.apply();
		this.semisphere.display();
		this.scene.rotate(Math.PI,0,1,0);
		this.semisphere.display();
		this.scene.popMatrix();
	};
};
