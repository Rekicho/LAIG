class Plane extends CGFobject {
    constructor(scene, uDiv, vDiv) {
        super(scene);

        this.uDiv = uDiv;
        this.vDiv = vDiv;

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
        this.nurbsObject = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, nurbsSurface);
    };

    display() {
        this.nurbsObject.display();
    };

};