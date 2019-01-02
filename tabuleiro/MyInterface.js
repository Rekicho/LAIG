/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
	/**
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Initializes the interface.
	 * @param {CGFapplication} application
	 */
	init(application) {
		super.init(application);
		// init GUI. For more information on the methods, check:
		//  http://workshop.chromeexperiments.com/examples/gui

		this.gui = new dat.GUI();

		this.initKeys();

		return true;
	}

	addGraphGroup(graphs) {
		var group = this.gui.add(this.scene, "selectedScene", graphs);
		var self = this;
		group.onFinishChange(function(){
			self.scene.changeGraph();
		});
	}

	/**
	 * Adds a folder containing the IDs of the lights passed as parameter.
	 * @param {array} lights
	 */
	addLightsGroup(lights) {

		var group = this.gui.addFolder("Lights");
		group.open();

		for (var key in lights) {
			if (lights.hasOwnProperty(key)) {
				this.scene.lightValues[key] = lights[key][0];
				group.add(this.scene.lightValues, key);
			}
		}

		group.close();
	}

	addCamerasGroup(cameras) {
		var group = this.gui.add(this.scene, "currCamera", cameras);
		var self = this;
		group.onFinishChange(function(){
			self.scene.changeCamera();
		})
	}

	initKeys() {
		this.scene.gui = this;
		this.processKeyboard = function () {};
		this.activeKeys = {};
	};

	processKeyDown(event) {
		this.activeKeys[event.code] = true;

		if (event.code == "KeyM")
			this.scene.materialsIndex++;
	};

	processKeyUp(event) {
		this.activeKeys[event.code] = false;
	};

	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
	};
}