class LinearAnimation extends Animation {
    constructor(scene, time, controlPoints) {
        super(scene, time);
        this.controlPoints = controlPoints;

        this.x = this.controlPoints[0][0];
        this.y = this.controlPoints[0][1];
        this.z = this.controlPoints[0][2];

        this.angle = 0;

        var distance = 0;
        this.timeinPoint = [];

        for (var i = 0; i < this.controlPoints.length - 1; i++)
            distance += Math.sqrt(Math.pow(this.controlPoints[i + 1][0] - this.controlPoints[i][0], 2) + Math.pow(this.controlPoints[i + 1][1] - this.controlPoints[i][1], 2) + Math.pow(this.controlPoints[i + 1][2] - this.controlPoints[i][2], 2));


        for (var i = 0; i < this.controlPoints.length - 1; i++)
            this.timeinPoint.push(this.time * Math.sqrt(Math.pow(this.controlPoints[i + 1][0] - this.controlPoints[i][0], 2) + Math.pow(this.controlPoints[i + 1][1] - this.controlPoints[i][1], 2) + Math.pow(this.controlPoints[i + 1][2] - this.controlPoints[i][2], 2)) / distance);

        this.pos = 0;
        this.timeinPos = 0;
    };

    update(time) {
        super.update(time);

        if (!this.finished) {
            this.timeinPos += time;

            if (this.timeinPos > this.timeinPoint[this.pos]) {
                this.timeinPos -= this.timeinPoint[this.pos];
                this.pos++;
                this.pos %= this.timeinPoint.length;
            }

            this.x = (this.controlPoints[this.pos + 1][0] - this.controlPoints[this.pos][0]) * (this.timeinPos / this.timeinPoint[this.pos]) + this.controlPoints[this.pos][0];
            this.y = (this.controlPoints[this.pos + 1][1] - this.controlPoints[this.pos][1]) * (this.timeinPos / this.timeinPoint[this.pos]) + this.controlPoints[this.pos][1];
            this.z = (this.controlPoints[this.pos + 1][2] - this.controlPoints[this.pos][2]) * (this.timeinPos / this.timeinPoint[this.pos]) + this.controlPoints[this.pos][2];

            this.angle = Math.atan((this.controlPoints[this.pos + 1][0] - this.controlPoints[this.pos][0]) / (this.controlPoints[this.pos + 1][2] - this.controlPoints[this.pos][2]));

            if (this.controlPoints[this.pos + 1][0] - this.controlPoints[this.pos][0] == 0)
                this.angle = 0;

            if (this.controlPoints[this.pos + 1][2] < this.controlPoints[this.pos][2])
                this.angle += Math.PI;
        }
    };

    apply() {
        if (!this.finished) {
        this.scene.translate(this.x, this.y, this.z);
        //this.scene.rotate(this.angle, 0, 1, 0);
        }
    };
}