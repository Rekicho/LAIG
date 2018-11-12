class Patch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
        super(scene);

        var nurbsSurface = new CGFnurbsSurface(npointsU - 1, npointsV - 1, controlpoints);
        this.nurbsObject = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    };

    display() {
        this.nurbsObject.display();
    };

    changeTex(length_s, length_t) { };
};