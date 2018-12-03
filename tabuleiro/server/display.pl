display_game(Board,Player):-
    wins(W1,W2),
    format('~nWins: ~d-~d~n',[W1,W2]),
    treesEaten(T1,T2),
    format('Trees eaten: ~d-~d~n~n',[T1,T2]),
    display_board(0,Board),
    format('~n~nPlayer to move: ~p ',Player),
    display_player(Player),
    write('\n').

display_board(Counter,[Head]):-
    write('                                    \n'),
    format('~d ',Counter),
    display_line(Head),
    write('\n\n   a  b  c  d  e  f  g  h  i  j ').

display_board(Counter,[Head|Tail]):-
    write('                                    \n'),
    format('~d ',Counter),
    display_line(Head),
    write('\n'),
    Next is Counter+1,
    display_board(Next,Tail).

display_line([Head]):-
    (Head = w,
    write('   ')); 
    format(' ~p ',Head).

display_line([Head|Tail]):-
    (
        (Head = w,
        write('   '));

        format(' ~p ',Head)
    ),

    display_line(Tail).

display_player(Player):-
    players(P1,P2),
    (
        (Player=p1,
        write_name(P1));

        (Player=p2,
        write_name(P2))
    ).

write_name(Name):-
    (Name=y,
    write('playing as Yuki')); 
    (Name=m,
    write('playing as Mina')).

translate_moves([],NewMoves,NewMoves).

%Moves are stored internally as [Number,Number] but are displayed to the user as [Number,Char]
%This translates the moves
translate_moves([Head|Tail],PastMoves,NewMoves):-
    [X|Y] = Head,
    Code is Y + 97,
    char_code(Char,Code),
    append(PastMoves,[[X,Char]],MoreMoves),
    translate_moves(Tail,MoreMoves,NewMoves).

display_moves(Moves):-
    write('\nValid moves: \n\n'),
    translate_moves(Moves,[],NewMoves),
    write(NewMoves),
    write('\n\n').

display_game_winner(Winner):-
    write('\n'),
    write(Winner),
    write(' won '),
    display_player(Winner),
    write('!!!\n').

display_match_winner(Winner):-
    (
        (Winner = t,
        write('\n\n\nTHE MATCH WAS A TIE!!!\n\n\n'));

        (write('\n\n\nTHE WINNER IS '),
        write(Winner),
        write('!!!\n\n\n'))
    ).

display_separator:-
    write('\n================================\n================================\n').

display_logo:-
    write('  ______                             ______                      _\n'),
    write(' |  ____|                           |  ____|                    | |\n'),
    write(' | |__  _ __  ___  ____ ___  _ __   | |__  ___   _ __  ___  ___ | |_\n'),
    write(' |  __||  __|/ _ \\|_  // _ \\|  _ \\  |  __|/ _ \\ |  __|/ _ \\/ __|| __|\n'),
    write(' | |   | |  | (_) |/ /|  __/| | | | | |  | (_) || |  |  __/\\__ \\| |_\n'),
    write(' |_|   |_|   \\___//___|\\___||_| |_| |_|   \\___/ |_|   \\___||___/ \\__|\n\n\n').

display_main_menu:-
    display_logo,
    write('\n\nSelect an option\n'),
    write('\n1- New Game'),
    write('\n2- Continue'),
    write('\n0- Exit').

display_new_game_menu:-
    display_logo,
    write('\n\nNew Game\n\nSelect an option\n'),
    write('\n1- Player vs Player'),
    write('\n2- Player vs Computer'),
    write('\n3- Computer vs Computer'),
    write('\n0- Main Menu').

display_PvAI_menu:-
    display_logo,
    write('\n\nPlayer vs Computer\n\nSelect an option\n'),
    write('\n1- Easy'),
    write('\n2- Hard'),
    write('\n0- Main Menu').

display_AIvAI_menu:-
    display_logo,
    write('\n\nComputer vs Computer\n\nSelect an option\n'),
    write('\n1- Easy vs Easy'),
    write('\n2- Easy vs Hard'),
    write('\n3- Hard vs Hard'),
    write('\n0- Main Menu').

display_AI_move(Move):-
    write('\n\nComputer chose Move: '),
    translate_moves([Move],[],Moves),
    [Translated] = Moves,
    write(Translated),
    write('\n\n').

%Clears the console
cls:-
    write('\33\[2J').