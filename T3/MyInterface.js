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

	addGameSettings(gameTypeList, gameDifficultyList) {
		var self = this;

		var group = this.gui.addFolder("Game Options");

		group.add(this.scene, "gameType", gameTypeList);
		group.add(this.scene, "gameDifficulty", gameDifficultyList);

		group.add(this.scene, "newGame").onFinishChange(function(){
			if(self.scene.newGame){
				self.scene.restartGame();
				self.scene.newGame = false;
			}
		});

		this.gui.add(this.scene, "undo").onFinishChange(function(){
			if(self.scene.undo){
				self.scene.game.undoMove();
				self.scene.undo = false;
			}
		});
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