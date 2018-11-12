class CircularAnimation extends Animation {
    constructor(scene, time, center, radius, startang, rotang) {
        super(scene, time);
        this.center = center;
        this.radius = radius;
        this.startang = startang;
        this.rotang = rotang;

        this.velocity = rotang / this.time;
        this.currang = startang;
    };

    update(time) {
        super.update(time);

        if (!this.finished) {
            this.currang = this.startang + (this.timePassed * this.velocity);
        }
    };

    apply() {
        if (!this.finished) {
            this.scene.translate(this.center[0], this.center[1], this.center[2]);
            this.scene.rotate(this.currang, 0, 1, 0);
            this.scene.translate(this.radius, 0, 0);
        }
    };
}