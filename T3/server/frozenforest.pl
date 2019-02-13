:- use_module(library(lists)).
:- use_module(library(random)).

:- reconsult('lists.pl').
:- reconsult('yuki.pl').
:- reconsult('mina.pl').

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

not( X ) :- X, !, fail.
not( _ ).

%G = Greatest Common Denominator between X and Y
gcd(X,Y,G):-
    X = Y,
    !,
    G = X.

gcd(X,Y,G):-
    X < Y,
    !,
    NextY is Y - X,
    gcd(X,NextY,G).

gcd(X,Y,G):-
    X > Y,
    !,
    gcd(Y, X, G).

%Checks if X and Y are coprime numbers.
coprime(X,Y):-
    X > 0,
    Y > 0,
    !,
    gcd(X,Y,G),
    G = 1.

untilZero(0,List,List,_).

%Get all possible tree positions in a orthogonal line between Mina and Yuki
untilZero(Num,List,FullList,Coord):-
    Next is Num - 1,
    (
        (Coord = x,
        !,
        append(List,[[Num,0]],NextList));

        (Coord = y,
        !,
        append(List,[[0,Num]],NextList))
    ),

    untilZero(Next,NextList,FullList,Coord).

allpoints(X,Y,_,DX,DY,List,List):-
    (floor(X) >= DX,
    !);
    (floor(Y) >= DY,
    !).

%Get all possible tree positions in a diagonal line between Mina and Yuki
allpoints(X,Y,M,DX,DY,Points,List):-
    (
        (FY is floor(Y),
        CY is ceiling(Y),
        FY =:= CY,
        append(Points,[[X,FY]],MorePoints));

        (MorePoints = Points)
    ),
    NextX is X + 1,
    NextY is Y + M,
    allpoints(NextX,NextY,M,DX,DY,MorePoints,List).

%Get all possible tree positions between Mina and Yuki
possibleTrees(DX,DY,List):-
    (
        (DX =:= 0,
        !,
        LastY is DY - 1,
        untilZero(LastY,[],List,y));

        (DY =:= 0,
        !,
        LastX is DX - 1,
        untilZero(LastX,[],List,x));

        (M is DY/DX,
        allpoints(1,M,M,DX,DY,[],List))
    ).

changeSign(_,_,[],NewList,NewList).

%Changes possible tree position signs relative to where Mina is in relation to where Yuki is
changeSign(SX,SY,[Head|Tail],LastList,NewList):-
    [X|Y] = Head,
    NewX is X * SX,
    NewY is Y * SY,
    append(LastList,[[NewX,NewY]],List),
    changeSign(SX,SY,Tail,List,NewList).

checkTree(_,_,_,[]):-
    fail.

%Checks if there is any tree between Mina and Yuki
checkTree(X,Y,Board,[Head|Tail]):-
    [DX|DY] = Head,
    Line is X + DX + 1,
    Col is Y + DY + 1,
    getPeca(Line,Col,Board,Peca),
    (
        (Peca = t);

        (checkTree(X,Y,Board,Tail))
    ).

%Gets all possible tree positions between Mina and Yuki and checks to see if they are trees
checkTrees(X,Y,MX,MY,Board,DX,DY):-
    possibleTrees(DX,DY,List),
    (
        (DX = 0,
        !,
        SX is 0,
        SY is floor((MY - Y)/DY));

        (DY = 0,
        !,
        SY is 0,
        SX is floor((MX - X)/DX));

        (SX is floor((MX - X)/DX),
        SY is floor((MY - Y)/DY))
    ),
    changeSign(SX,SY,List,[],NewList),
    checkTree(X,Y,Board,NewList).

%Checks if Yuki can see Mina
canSee(X,Y,MX,MY,Board):-
    DX is abs(MX - X),
    DY is abs(MY - Y),
    (
        (coprime(DX,DY));
    
        (not(checkTrees(X,Y,MX,MY,Board,DX,DY)))
    ).

%Gets all Player valid moves
valid_moves(Board, Player, ListOfMoves):-
    (
        (Player=y,
        valid_moves_yuki(Board, ListOfMoves),
        !);

        (Player=m,
        valid_moves_mina(Board, ListOfMoves),
        !)
    ).

move(Board, Player, Move, NewBoard, Before):-
    [X,Y] = Move,
    valid_moves(Board, Player, Moves),
    member(Move,Moves),
    Line is X + 1,
    Col is Y + 1,
    (
        (Player = y,
        moveYuki(Line,Col,Board,NewBoard));

        (Player = m,
        moveMina(Line,Col,Board,NewBoard, Before))
    ).

randomMove(Board, Player, NewBoard, Before):-
    valid_moves(Board, Player, Moves),
    random_member(Move, Moves),
    move(Board, Player, Move, NewBoard, Before).
