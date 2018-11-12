class Plane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);

        var controlPoints =
            [
                [
                    [0.5, 0, -0.5, 1],
                    [0.5, 0, 0.5, 1]
                ],
                [
                    [-0.5, 0, -0.5, 1],
                    [-0.5, 0, 0.5, 1]
                ]
            ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        this.nurbsObject = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    };

    display() {
        this.nurbsObject.display();
    };

};