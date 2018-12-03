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

        this.board = new MyBoard(this.scene, this.initialBoard, square, tree, texture, yuki, mina);

        this.wins = [0, 0];
        this.treesEaten = [0, 0];
        this.players = ['y', 'm'];

        this.yuki = [0, 0/*-1, -1*/];
        this.mina = [0, 0/*-1, -1*/];

        this.pos = [this.yuki, this.mina];

        this.beforeMina = null;
        this.nextPlayer = 0;
        this.wonAs = null;
        this.difficulty = [1, 1];

        this.valid_moves = [];
        this.getValidMoves();
    };

    getPrologRequest(requestString) {
        var requestPort = 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        var self = this;

        request.onload = function (data) { self.valid_moves = self.parseArray(data.target.response); };
        request.onerror = function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    parseArray(string) {
        var array = [];

        for(var i = 2; i < string.length; i+=6)
        {
            array.push([string[i],string[i+2]]);
        }        

        return array;
    }

    getValidMoves() {
        // Get Parameter Values
        var requestString = "valid_moves";

        // Make Request
        this.getPrologRequest(requestString);
    }

    move() {
        for (var i = 0; i < this.valid_moves.length; i++)
            this.initialBoard[this.valid_moves[i][0]][this.valid_moves[i][1]] = 'v';
        
        var x = Math.floor(Math.random() * 10);
        var y = Math.floor(Math.random() * 10);

        var pos = this.pos[this.nextPlayer];

        if (this.players[this.nextPlayer] == 'm')
            this.initialBoard[pos[0]][pos[1]] = 't';

        else this.initialBoard[pos[0]][pos[1]] = ' ';

        this.pos[this.nextPlayer] = [x, y];
        this.initialBoard[x][y] = this.players[this.nextPlayer];

        this.nextPlayer++;
        this.nextPlayer %= 2;

        this.getValidMoves();
    }

    display() {
        this.board.display();
    };
}