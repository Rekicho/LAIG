%Executes a Yuki move
moveYuki(Player,Line,Col,Board,NewBoard):-
    yuki(X,Y),
    treesEaten(T1,T2),
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
    retract(treesEaten(T1,T2)),
    NewX is Line - 1,
    NewY is Col - 1,
    assert(yuki(NewX,NewY)),
    (
        (Player = p1,
        NewT is T1 + 1,
        assert(treesEaten(NewT,T2)));

        (Player = p2,
        NewT is T2 + 1,
        assert(treesEaten(T1,NewT)))
    ).

%Checks if a Yuki move is valid
valid_move_yuki(Board, X, Y, Moves, NewMoves):-
    (
        (X > -1,
        X < 10,
        Y > -1,
        Y < 10,
        Line is X + 1,
        Col is Y + 1,
        getPeca(Line, Col, Board, Peca),
        Peca = t,
        mina(MX,MY),
        canSee(X,Y,MX,MY,Board),
        append(Moves,[[X,Y]],NewMoves));

        (NewMoves = Moves)
    ).

%Gets all Yuki valid moves
valid_moves_yuki(Board, ListOfMoves):-
    yuki(X,Y),
    (
        (X =:= -1,
        Y =:= -1,
        allMoves(Moves),
        ListOfMoves = Moves);
    
        (LastX is X - 1,
        LastY is Y - 1,
        NextX is X + 1,
        NextY is Y + 1,
        valid_move_yuki(Board, LastX, LastY, [], Moves1),
        valid_move_yuki(Board, LastX, Y, Moves1, Moves2),
        valid_move_yuki(Board, LastX, NextY, Moves2, Moves3),
        valid_move_yuki(Board, X, LastY, Moves3, Moves4),
        valid_move_yuki(Board, X, NextY, Moves4, Moves5),
        valid_move_yuki(Board, NextX, LastY, Moves5, Moves6),
        valid_move_yuki(Board, NextX, Y, Moves6, Moves7),
        valid_move_yuki(Board, NextX, NextY, Moves7, ListOfMoves))
    ).

%In case both players won as Yuki, solves the tie according to who ate fewer trees
solve_Yuki_tie(T1,T2,Winner):-
    (
        (T1 > T2,
        Winner = p2);

        (T1 < T2,
        Winner = p1);

        (Winner = t)
    ).