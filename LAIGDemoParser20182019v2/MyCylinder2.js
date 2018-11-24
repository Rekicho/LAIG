/**
 * MyCylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder2 extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);
		this.height = height;
		this.botRad = base;
		this.topRad = top;
		this.npartsU = stacks;
		this.npartsV = slices;
		this.npointsU = 2;
		this.npointsV = 9;

		this.controlpoints = [
			[
				[0.0, -this.botRad, 0.0, 1],
				[-this.botRad, -this.botRad, 0.0, Math.sqrt(2) / 2],
				[-this.botRad, 0.0, 0.0, 1],
				[-this.botRad, this.botRad, 0.0, Math.sqrt(2) / 2],
				[0.0, this.botRad, 0.0, 1],
				[this.botRad, this.botRad, 0.0, Math.sqrt(2) / 2],
				[this.botRad, 0.0, 0.0, 1],
				[this.botRad, -this.botRad, 0.0, Math.sqrt(2) / 2],
				[0.0, -this.botRad, 0.0, 1]
			],
			[
				[0.0, -this.topRad, this.height, 1],
				[-this.topRad, -this.topRad, this.height, Math.sqrt(2) / 2],
				[-this.topRad, 0.0, this.height, 1],
				[-this.topRad, this.topRad, this.height, Math.sqrt(2) / 2],
				[0.0, this.topRad, this.height, 1],
				[this.topRad, this.topRad, this.height, Math.sqrt(2) / 2],
				[this.topRad, 0.0, this.height, 1],
				[this.topRad, -this.topRad, this.height, Math.sqrt(2) / 2],
				[0.0, -this.topRad, this.height, 1]
			]
		];
		this.cylinder2 = new MyPatch(scene, this.npointsU, this.npointsV, this.npartsU, this.npartsV, this.controlpoints);

	};

	display() {
		this.cylinder2.display();
	};

	changeTex(length_s, length_t) {};
};