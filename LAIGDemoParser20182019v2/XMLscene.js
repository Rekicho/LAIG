var DEGREE_TO_RAD = Math.PI / 180;
var FPS = 60;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};

        this.currCamera;
        this.cameraList = {};
        this.lastCamera;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.materialsIndex = 0;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                if (this.graph.spots.hasOwnProperty(key)) {
                    var spot = this.graph.spots[key];

                    this.lights[i].setSpotCutOff(spot[0]);
                    this.lights[i].setSpotExponent(spot[1]);
                    this.lights[i].setSpotDirection(spot[2][0] - light[1][0], spot[2][1] - light[1][1], spot[2][2] - light[1][2]);
                }

                this.lights[i].update();

                i++;
            }
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.axis_length);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
        // Adds cameras group.
        var i = 0;
        for (var key in this.graph.cameras) {
            if (key == this.graph.defaultCamera)
                this.currCamera = i;
            this.cameraList[key] = i;
            i++;
        }
        this.lastCamera = this.currCamera;
        this.interface.addCamerasGroup(this.cameraList);

        this.defaultMaterial = new CGFappearance(this);
        this.defaultTexture = new CGFtexture(this);

        this.activeTexture = null;

        this.sceneInited = true;

        this.setUpdatePeriod(1000/FPS);
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            if (this.currCamera != this.lastCamera) {
                var cam;
                for (var key in this.cameraList) {
                    if (this.cameraList[key] == this.currCamera) {
                        cam = key;
                    }
                }
                this.camera = this.graph.cameras[cam];
                this.interface.setActiveCamera(this.graph.cameras[cam]);

                this.lastCamera = this.currCamera;
            }

            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(currTime){
        this.lastTime = this.lastTime || 0;
        
        //if(this.lastTime != 0)
            //this.animation.update((currTime - this.lastTime) / 1000);

		this.lastTime = currTime;
    }
}