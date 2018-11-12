class Patch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);

        var nurbsSurface = new CGFnurbsSurface(npointsU - 1, npointsV - 1, controlPoints);
        this.nurbsObject = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    };

    display() {
        this.nurbsObject.display();
    };

};