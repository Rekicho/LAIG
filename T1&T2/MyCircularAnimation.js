class MyCircularAnimation extends MyAnimation {
	constructor(scene, time, center, radius, startang, rotang) {
		super(scene, time);
		this.center = center;
		this.radius = radius;
		this.startang = startang;

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
		if (this.started && !this.finished) {
			this.scene.translate(this.center[0], this.center[1], this.center[2]);
			this.scene.rotate(this.currang, 0, 1, 0);
			this.scene.translate(this.radius, 0, 0);

			if (this.velocity > 0)
				this.scene.rotate(Math.PI, 0, 1, 0);
		}
	};

	getAnimationInfo(animationInfo) {
		animationInfo["type"] = "circular";
		animationInfo["time"] = this.time;
		animationInfo["center"] = this.center;
		animationInfo["radius"] = this.radius;
		animationInfo["startang"] = this.startang;
		animationInfo["rotang"] = this.velocity * this.time;
	};
}