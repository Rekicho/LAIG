mina(Board, X, Y):-
    getPeca(Line, Col, Board, m),
    X is Line - 1,
    Y is Col - 1.

mina(_, -1, -1).

%Executes a Mina move
moveMina(Line,Col,Board,NewBoard, Before):-
    mina(Board,OldX,OldY),
    (
        (OldX < 0,
        OldY < 0,
        setPeca(Line,Col,m,Board,NewBoard));

        (OldLine is OldX + 1,
        OldCol is OldY + 1,
        setPeca(OldLine,OldCol,Before,Board,Next),
        setPeca(Line,Col,m,Next,NewBoard))
    ).

%Checks if a Mina move is valid
valid_move_mina(Board, X, Y, Moves, NewMoves, DX, DY):-
    (
        (X > -1,
        X < 10,
        Y > -1,
        Y < 10,
        yuki(Board, YX,YY),
        (
            (X =:= YX,
            Y =:= YY,
            MoreMoves = Moves);

            (canSee(YX,YY,X,Y,Board),
            MoreMoves = Moves);

            (append(Moves,[[X,Y]],MoreMoves))
        ),
        NextX is X + DX,
        NextY is Y + DY, 
        valid_move_mina(Board, NextX, NextY, MoreMoves, NewMoves, DX, DY));

        (NewMoves = Moves)
    ).

checkSeen(_,[],ValidMoves,ValidMoves).

%In the first Mina move, checks all positions to see where Mina can be placed
%Only restriction is she is not seen by Yuki
checkSeen(Board,[Head|Tail],ListOfMoves,ValidMoves):-
    [X,Y] = Head,
    yuki(Board, YX,YY),
    (
        (X =:= YX,
        Y =:= YY,
        checkSeen(Board,Tail,ListOfMoves,ValidMoves));
    
        (canSee(YX,YY,X,Y,Board),
        checkSeen(Board,Tail,ListOfMoves,ValidMoves));
    
        (append(ListOfMoves,[Head],MoreMoves),
        checkSeen(Board,Tail,MoreMoves,ValidMoves))
    ).

%Gets all Mina valid moves
valid_moves_mina(Board, ListOfMoves):-
    mina(Board, X,Y),
    (
        (X =:= -1,
        Y =:= -1,
        allMoves(Moves),
        checkSeen(Board,Moves,[],ListOfMoves));
    
        (LastX is X - 1,
        LastY is Y - 1,
        NextX is X + 1,
        NextY is Y + 1,
        valid_move_mina(Board, LastX, LastY, [], Moves1, -1, -1),
        valid_move_mina(Board, LastX, Y, Moves1, Moves2, -1, 0),
        valid_move_mina(Board, LastX, NextY, Moves2, Moves3, -1, 1),
        valid_move_mina(Board, X, LastY, Moves3, Moves4, 0, -1),
        valid_move_mina(Board, X, NextY, Moves4, Moves5, 0 , 1),
        valid_move_mina(Board, NextX, LastY, Moves5, Moves6, 1, -1),
        valid_move_mina(Board, NextX, Y, Moves6, Moves7, 1, 0),
        valid_move_mina(Board, NextX, NextY, Moves7, ListOfMoves, 1, 1))
    ).