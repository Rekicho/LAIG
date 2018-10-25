class Animation {
    constructor(scene, time) {
        this.scene = scene;
        this.time = time;
        this.timePassed = 0;
    };

    update(time){
        this.timePassed += time;
    }
}