%Check how many trees can be reached from position [X,Y] with infinite moves
reachableTree(Board,NewBoard,X,Y,TempTrees,Trees):-
    (
        (X > -1,
        X < 10,
        Y > -1,
        Y < 10,
        Line is X + 1,
        Col is Y + 1,
        getPeca(Line, Col, Board, Peca),
        Peca = t,
        NextTrees is TempTrees + 1,
        setPeca(Line, Col, v, Board, NextBoard),
        LastX is X - 1,
        LastY is Y - 1,
        NextX is X + 1,
        NextY is Y + 1,
        reachableTree(NextBoard, Board1, LastX, LastY, NextTrees, T1),
        reachableTree(Board1, Board2, LastX, Y, T1, T2),
        reachableTree(Board2, Board3, LastX, NextY, T2, T3),
        reachableTree(Board3, Board4, X, LastY, T3, T4),
        reachableTree(Board4, Board5, X, NextY, T4, T5),
        reachableTree(Board5, Board6, NextX, LastY, T5, T6),
        reachableTree(Board6, Board7, NextX, Y, T6, T7),
        reachableTree(Board7, NewBoard, NextX, NextY, T7, Trees));

        (Trees is TempTrees,
        NewBoard = Board)
    ).

%Calculates how many trees Yuki can reach with infinite moves
reachableTrees(Board,Trees):-
    yuki(X,Y),
    (
        (X =:= -1,
        Y =:= -1,
        Trees is 100);

        (beforeMina(Before),
        mina(MX,MY),
        (
            (MX \= -1,
            MY \= -1,
            Line is MX + 1,
            Col is MY + 1,
            setPeca(Line,Col,Before,Board,NewBoard));

            (NewBoard = Board)
        ), 
        LastX is X - 1,
        LastY is Y - 1,
        NextX is X + 1,
        NextY is Y + 1,
        reachableTree(NewBoard, Board1, LastX, LastY, 0, T1),
        reachableTree(Board1, Board2, LastX, Y, T1, T2),
        reachableTree(Board2, Board3, LastX, NextY, T2, T3),
        reachableTree(Board3, Board4, X, LastY, T3, T4),
        reachableTree(Board4, Board5, X, NextY, T4, T5),
        reachableTree(Board5, Board6, NextX, LastY, T5, T6),
        reachableTree(Board6, Board7, NextX, Y, T6, T7),
        reachableTree(Board7, _, NextX, NextY, T7, Trees))
    ).

%Check if there is a tree in position [X,Y]
treeAround(Board,X,Y,Temp,Around,Value):-
    (
        (X > -1,
        X < 10,
        Y > -1,
        Y < 10,
        Line is X + 1,
        Col is Y + 1,
        getPeca(Line, Col, Board, Peca),
        Peca = t,
        Around is Temp + Value);

        (Around is Temp)
    ).

%Checks how many trees are around Yuki
treesAround(Board,Around):-
    yuki(X,Y),
    (
        (X =:= -1,
        Y =:= -1,
        Around is 0);

        (LastX is X - 1,
        LastY is Y - 1,
        NextX is X + 1,
        NextY is Y + 1,
        treeAround(Board, LastX, LastY, 0, A1, 5),
        treeAround(Board, LastX, Y, A1, A2, 1),
        treeAround(Board, LastX, NextY, A2, A3, 5),
        treeAround(Board, X, LastY, A3, A4, 1),
        treeAround(Board, X, NextY, A4, A5, 1),
        treeAround(Board, NextX, LastY, A5, A6, 5),
        treeAround(Board, NextX, Y, A6, A7, 1),
        treeAround(Board, NextX, NextY, A7, Around, 5))
    ).

%Calculates distance between Yuki and Mina
distance(Distance):-
    yuki(YX,YY),
    mina(MX,MY),
    (
        (YX \= -1,
        YY \= -1,
        MX \= -1,
        MY \= -1,
        Distance is sqrt(((YX-MX)*(YX-MX)) + ((YY-MY)*(YY-MY)))
        );

        (Distance is 0)
    ).

%Gets the Board Value for Player
value(Board,Player,Value):-
    players(P1,P2),
    (
        (Player = p1,
        Name = P1,
        NextPlayer = p2);

        (Player = p2,
        Name = P2,
        NextPlayer = p1)
    ),
    valid_moves(Board,NextPlayer,Moves),
    (
        (Moves = [],
        Value is 9999999);

        (length(Moves,Length),
        reachableTrees(Board,Trees),
        treesAround(Board,Around),
        distance(Distance),
        (
            (Name = y,
            Value is (100 * Trees) + (50 * Around) - (10 * Distance) - Length);

            (Name = m,
            Value is - (100 * Trees) - (50 * Around) + (10 * Distance) - Length)
        ))
    ).

%Simulates a move done by Yuki
simulateMoveYuki(Player,Line,Col,Board,Value,NewBoard):-
    yuki(X,Y),
    (
        (X < 0,
        Y < 0,
        setPeca(Line,Col,y,Board,NewBoard));
    
        (OldX is X + 1,
        OldY is Y + 1,
        setPeca(OldX,OldY,w,Board,Next),
        setPeca(Line,Col,y,Next,NewBoard))
    ),
    retract(yuki(X,Y)),
    NewX is Line - 1,
    NewY is Col - 1,
    assert(yuki(NewX,NewY)),
    value(NewBoard,Player,Value).

%Simulates a move done by Mina
simulateMoveMina(Player,Line,Col,Board,Value,NewBoard):-
    mina(X,Y),
    beforeMina(Before),
    (
        (X < 0,
        Y < 0,
        getPeca(Line,Col,Board,After),
        setPeca(Line,Col,m,Board,NewBoard));

        (OldX is X + 1,
        OldY is Y + 1,
        setPeca(OldX,OldY,Before,Board,Next),
        getPeca(Line,Col,Board,After),
        setPeca(Line,Col,m,Next,NewBoard))
    ),
    retract(mina(X,Y)),
    retract(beforeMina(Before)),
    NewX is Line - 1,
    NewY is Col - 1,
    assert(mina(NewX,NewY)),
    assert(beforeMina(After)),
    value(NewBoard,Player,Value).

%Simulates a move and returns it's Value
simulateValue(Board,Player,Move,Value,NewBoard):-
    [Line,Col] = Move,
    players(P1,P2),
    (
        (Player=p1,
        Name = P1);
    
        (Player=p2,
        Name = P2)
    ),
    L is Line + 1,
    C is Col + 1,
    (
        (Name = y,
        simulateMoveYuki(Player,L,C,Board,Value,NewBoard));

        (Name = m,
        simulateMoveMina(Player,L,C,Board,Value,NewBoard))
    ).

%When Level > 1, it is called to get opponent best move
%and then called again to get best move after opponent move
bestNext(Board,Level,Player,Value,NextBoard):-
    valid_moves(Board,Player,Moves),
    random_shuffle(Moves,[],RandomMoves),
    best(Board,Level,Player,RandomMoves,_,-10000000,_,Value,_,NextBoard).


best(Board,Level,Player,[],Move,MaxValue,Move,MaxValue,FinalBoard,FinalBoard):-
    (
        (Level =:= 1,
        simulateValue(Board,Player,Move,_,_));

        (true)
    ).

%Gets the best move for Player
%If Level =:= 1, just checks all valid moves and returns the best
%Else for every move also simulates oponent best next move and the Players best following move
best(Board,Level,Player,[Head|Tail],Move,Max,MaxMove,MaxValue,MaxBoard,FinalBoard):-
    (
        (Level =:= 1,
        !,
        yuki(YX,YY),
        mina(MX,MY),
        beforeMina(Before),
        simulateValue(Board,Player,Head,Value,NewBoard),
        retract(yuki(_,_)),
        retract(mina(_,_)),
        retract(beforeMina(_)),
        assert(yuki(YX,YY)),
        assert(mina(MX,MY)),
        assert(beforeMina(Before)));

        (yuki(YX,YY),
        mina(MX,MY),
        beforeMina(Before),
        simulateValue(Board,Player,Head,NextValue,NextBoard),
        (
            (NextValue =:= 9999999,
            Value is 9999999);

            ((
                (Player = p1,
                NextPlayer = p2);

                (Player = p2,
                NextPlayer = p1)
            ),
            NewLevel is Level - 2,
            bestNext(NextBoard,NewLevel,NextPlayer,NextNextValue,NextNextBoard),
            (
                (NextNextValue =:= 9999999,
                Value is -9999999);

                (bestNext(NextNextBoard,NewLevel,Player,Value,NewBoard))
            ))
        ),
        retract(yuki(_,_)),
        retract(mina(_,_)),
        retract(beforeMina(_)),
        assert(yuki(YX,YY)),
        assert(mina(MX,MY)),
        assert(beforeMina(Before)))
    ),
    (
        (Value >= Max,
        !,
        best(Board,Level,Player,Tail,Move,Value,Head,MaxValue,NewBoard,FinalBoard));

        (best(Board,Level,Player,Tail,Move,Max,MaxMove,MaxValue,MaxBoard,FinalBoard))    
    ).

random_shuffle([],Random,Random).

%Takes a list and puts it in a random order
random_shuffle(Moves,ShuffledMoves,Random):-
    length(Moves,Length),
    random(0,Length,Rand),
    nth0(Rand,Moves,Move),
    delete(Moves,Move,NewMoves),
    append(ShuffledMoves,[Move],RandomMoves),
    random_shuffle(NewMoves,RandomMoves,Random).

%Choses the best move for Player
choose_move(Board,Level,Move):-
    nextPlayer(Player),
    valid_moves(Board,Player,Moves),
    random_shuffle(Moves,[],Random),
    yuki(YX,YY),
    mina(MX,MY),
    beforeMina(Before),
    best(Board,Level,Player,Random,Move,-10000000,_,_,_,_),
    retract(yuki(_,_)),
    retract(mina(_,_)),
    retract(beforeMina(_)),
    assert(yuki(YX,YY)),
    assert(mina(MX,MY)),
    assert(beforeMina(Before)).