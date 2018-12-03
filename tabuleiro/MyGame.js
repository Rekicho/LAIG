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
    };

    getPrologRequest(requestString) {
        var requestPort = 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);
        
        var self = this;

        request.onload = function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest() {
        // Get Parameter Values
        var requestString = "valid_moves";

        // Make Request
        this.getPrologRequest(requestString);
    }

    parseArray(string) {
        var array = [];

        array.push(string);

        console.log(array);

        return array;
    }

    /*//Handle the Reply
    handleReply(game, data) {
        console.log(data.target.response);
        game.valid_moves = game.parseArray(data.target.response);
        console.log(game.valid_moves);

        for (var i = 0; i < game.valid_moves.length; i++)
            game.initialBoard[game.valid_moves[i][0]][game.valid_moves[i][1]] = 'v';
    }*/

    move() {
        this.makeRequest();
        console.log(this.valid_moves);
        /*var x = Math.floor(Math.random() * 10);
        var y = Math.floor(Math.random() * 10);

        var pos = this.pos[this.nextPlayer];

        if (this.players[this.nextPlayer] == 'm')
            this.initialBoard[pos[0]][pos[1]] = 't';

        else this.initialBoard[pos[0]][pos[1]] = ' ';

        this.pos[this.nextPlayer] = [x, y];
        this.initialBoard[x][y] = this.players[this.nextPlayer];

        this.nextPlayer++;
        this.nextPlayer %= 2;*/
    }

    display() {
        this.board.display();
    };
}