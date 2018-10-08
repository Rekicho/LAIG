/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) 
	{
		super(scene);

		this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
		this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;

		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
				this.x1, this.y1, this.z1,
				this.x2, this.y2, this.z2,
				this.x3, this.y3, this.z3
                ];
        
        /* 
        For a triangle p1, p2, p3, if the vector U = p2 - p1 and the vector V = p3 - p1 then the normal N = U X V and can be calculated by:

        Nx = UyVz - UzVy

        Ny = UzVx - UxVz

        Nz = UxVy - UyVx
        */

        var Nx = ((this.y2 - this.y1) * (this.z3 - this.z1)) - ((this.z2 - this.z1) * (this.y3 - this.y1));
        var Ny = ((this.z2 - this.z1) * (this.x3 - this.x1)) - ((this.x2 - this.x1) * (this.z3 - this.z1));
        var Nz = ((this.x2 - this.x1) * (this.y3 - this.y1)) - ((this.y2 - this.y1) * (this.x3 - this.x1));

		this.normals = [
				Nx, Ny, Nz,
				Nx, Ny, Nz,
				Nx, Ny, Nz
		];

		this.indices = [
				0, 1, 2
			];
			
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};
