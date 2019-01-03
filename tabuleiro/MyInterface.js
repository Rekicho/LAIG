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

	addGameSettings(gameTypeList) {
		var self = this;

		this.gui.add(this.scene, "gameType", gameTypeList);

		// this.gui.add(this.scene, "undo");
		this.gui.add(this.scene, "newGame").onFinishChange(function(){
			if(self.scene.newGame){
				self.scene.game = new MyGame(self.scene, self.scene.yuki, self.scene.mina, self.scene.gameType);
				self.scene.newGame = false;
			}
		});
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