:-dynamic wins/2.
:-dynamic treesEaten/2.
:-dynamic players/2.
:-dynamic board/1.
:-dynamic yuki/2.
:-dynamic mina/2.
:-dynamic beforeMina/1.
:-dynamic nextPlayer/1.
:-dynamic wonAs/1.
:-dynamic difficulty/2.

wins(0,0).
treesEaten(0,0).
players(y,m).
initialBoard([
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t],
             [t,t,t,t,t,t,t,t,t,t]
             ]).
board([
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t],
      [t,t,t,t,t,t,t,t,t,t]
      ]).
yuki(-1,-1).
mina(-1,-1).
%In the start, yuki and mina are not on the board
beforeMina(m). %Need because mina can move to a tree or a blank space. In the start, there is nothing in the place where mina is
nextPlayer(p1).
wonAs(x). %In the start, no one has won.
difficulty(-1,-1). %-1 means human player, Default game is player vs player

%Gets all starting possible move for Yuki
allMoves([
            [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],
            [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],
            [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],
            [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],
            [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],
            [5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],
            [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9],
            [7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9],
            [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8],[8,9],
            [9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9]
        ]).

%Setups the game acording to user difficulty settings
setup(AI1,AI2):-
    retract(wins(_,_)),
    retract(treesEaten(_,_)),
    retract(players(_,_)),
    retract(board(_)),
    retract(yuki(_,_)),
    retract(mina(_,_)),
    retract(beforeMina(_)),
    retract(nextPlayer(_)),
    retract(wonAs(_)),
    retract(difficulty(_,_)),
    assert(wins(0,0)),
    assert(treesEaten(0,0)),
    assert(players(y,m)),
    initialBoard(Board),
    assert(board(Board)),
    assert(yuki(-1,-1)),
    assert(mina(-1,-1)),
    assert(beforeMina(m)),
    assert(nextPlayer(p1)),
    assert(wonAs(x)),
    assert(difficulty(AI1,AI2)).

%Changes game when the game is over, switching players characters
change_game:-
    players(P1,P2),
    retract(players(P1,P2)),
    assert(players(P2,P1)),
    retract(board(_)),
    initialBoard(Board),
    assert(board(Board)),
    retract(yuki(_,_)),
    retract(mina(_,_)),
    assert(yuki(-1,-1)),
    assert(mina(-1,-1)),
    retract(beforeMina(_)),
    retract(nextPlayer(_)),
    assert(beforeMina(m)),
    assert(nextPlayer(p2)).