class Animation {
    constructor(scene, time) {
        this.scene = scene;
        this.time = time;
        this.timePassed = 0;
        this.finished = false;
    };

    update(time){
        this.timePassed += time;

        if(this.timePassed > this.time)
            this.finished = true;
    };

    apply(){};
}