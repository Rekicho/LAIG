class MyAnimation {
    constructor(scene, time) {
        this.scene = scene;
        this.time = time;
        this.timePassed = 0;
        this.finished = false;
        this.started = false;
    };

    update(time){
        this.started = true;
        this.timePassed += time;

        if(this.timePassed > this.time)
            this.finished = true;
    };

    apply(){};
}