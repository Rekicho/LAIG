class MyGame extends CGFobject {
    constructor(scene) {
        super(scene);

        var square = new MyPlane(this.scene, 1, 1);
        var tree = new MyTree(this.scene);
        var texture = new CGFtexture(this.scene, "images/snow.jpg");
        var yuki = new MyVehicle(this.scene);
        var mina = new MyTorus(this.scene, 0.1, 0.25, 20, 20);

        this.initialBoard = [['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't'],
        ['t', 't', 't', 't', 't', 't', 't', 't', 't', 't']];

        this.valid = [];

        for(var i = 0; i < this.initialBoard.length; i++)
            for(var j = 0; j < this.initialBoard[i].length; j++)
                this.valid.push(false);

        this.board = new MyBoard(this.scene, this.initialBoard, square, tree, texture, yuki, mina, this.valid);

        //this.wins = [0, 0];
        this.treesEaten = [0, 0];
        this.players = ['y', 'm'];

        this.beforeMina = 'm'; //nothing on start
        this.nextPlayer = 0;
        this.wonAs = null;
        //this.difficulty = [1, 1];

        this.moving = false;
        this.finished = false;
    };

    getPrologRequest(requestString) {
        var requestPort = 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        var self = this;

        if (requestString[0] == 'v') { 
            request.onload = function (data) {
                self.parseValid(data.target.response);
                if(!self.finished)
                    self.randomMove();
            };
        }

        else {
            request.onload = function (data) {
                self.parseMove(data.target.response);
                self.moving = false;
            };
        }

        request.onerror = function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    parseValid(string) {
        if(string == "[]"){
            this.finished = true;
            return;
        }

        var valid_moves = [];

        for(var i = 2; i < string.length; i+=6){
            valid_moves.push([string[i],string[i+2]]);
        }

        for(var i = 0; i < this.initialBoard.length; i++)
            for(var j = 0; j < this.initialBoard[i].length; j++)
                this.valid[i][j] = false;


        for (var i = 0; i < this.valid_moves.length; i++)
            this.valid[this.valid_moves[i][0]][this.valid_moves[i][1]] = true;

        
    }

    parseMove(string) {
        var index = 2;

        for (var i = 0; i < this.initialBoard.length; i++) {

            for (var j = 0; j < this.initialBoard[i].length; j++) {
                if (string[index] == 'm' && this.initialBoard[i][j] != 'm')
                    this.beforeMina = this.initialBoard[i][j];

                this.initialBoard[i][j] = string[index];
                index += 2;
            }

            index += 2;
        }

        if (this.players[this.nextPlayer] == 'y')
            this.treesEaten[this.nextPlayer]++;

        this.nextPlayer++;
        this.nextPlayer %= 2;
    }

    randomMove() {
        // Get Parameter Values
        var requestString = "randomMove([";

        for (var i = 0; i < this.initialBoard.length; i++) {
            requestString += "[";

            for (var j = 0; j < this.initialBoard[i].length; j++) {
                requestString += this.initialBoard[i][j];

                if (j != this.initialBoard[i].length - 1)
                    requestString += ",";
            }

            requestString += "]";

            if (i != this.initialBoard.length - 1)
                requestString += ",";
        }

        requestString += "]," + this.players[this.nextPlayer] + "," + this.beforeMina + ")";

        // Make Request
        this.getPrologRequest(requestString);
    }

    validMoves() {
        // Get Parameter Values
        var requestString = "validMoves([";

        for (var i = 0; i < this.initialBoard.length; i++) {
            requestString += "[";

            for (var j = 0; j < this.initialBoard[i].length; j++) {
                requestString += this.initialBoard[i][j];

                if (j != this.initialBoard[i].length - 1)
                    requestString += ",";
            }

            requestString += "]";

            if (i != this.initialBoard.length - 1)
                requestString += ",";
        }

        requestString += "]," + this.players[this.nextPlayer] + ")";

        // Make Request
        this.getPrologRequest(requestString);
    }

    move() {
        if (this.finished || this.moving)
            return;

        this.moving = true;
        this.validMoves();
    }

    display() {
        this.board.display();
    };
}