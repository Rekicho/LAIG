class Plane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);

        var controlpoints =
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

        var nurbsSurface = new CGFnurbsSurface(1, 1, controlpoints);
        this.nurbsObject = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    };

    display() {
        this.nurbsObject.display();
    };

    changeTex(length_s, length_t) { };
};