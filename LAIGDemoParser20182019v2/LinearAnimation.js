class LinearAnimation extends Animation {
    constructor(scene, time, controlPoints) {
        super(scene,time);
        this.controlPoints = controlPoints;

        console.log(this.controlPoints);

        this.timePerPoint = time / (this.controlPoints.length - 1);
    };

    animate(){
        this.timePassed %= this.time;

        var pos = Math.floor(this.timePassed / this.timePerPoint);
        var timeInPoint = (this.timePassed % this.timePerPoint) / this.timePerPoint;

        var x = (this.controlPoints[pos + 1][0] -  this.controlPoints[pos][0]) * timeInPoint + this.controlPoints[pos][0];
        var y = (this.controlPoints[pos + 1][1] -  this.controlPoints[pos][1]) * timeInPoint + this.controlPoints[pos][1];
        var z = (this.controlPoints[pos + 1][2] -  this.controlPoints[pos][2]) * timeInPoint + this.controlPoints[pos][2];
        
        this.scene.translate(x,y,z);

        //TODO: weird rotation shit
    }
}