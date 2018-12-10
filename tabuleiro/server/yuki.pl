yuki(Board, X, Y):-
    getPeca(Line, Col, Board, y),
    X is Line - 1,
    Y is Col - 1.

yuki(_, -1, -1).

%Executes a Yuki move
moveYuki(Line,Col,Board,NewBoard):-
    yuki(Board,OldX,OldY),
    (
        (OldX < 0,
        OldY < 0,
        setPeca(Line,Col,y,Board,NewBoard));
    
        (OldLine is OldX + 1,
        OldCol is OldY + 1,
        setPeca(OldLine,OldCol,w,Board,Next),
        setPeca(Line,Col,y,Next,NewBoard))
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
        mina(Board, MX,MY),
        canSee(X,Y,MX,MY,Board),
        append(Moves,[[X,Y]],NewMoves));

        (NewMoves = Moves)
    ).

%Gets all Yuki valid moves
valid_moves_yuki(Board, ListOfMoves):-
    yuki(Board, X,Y),
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