%Checks if user input is inside the board
checkInput(Line,Col):-
    Line >= 0,
    Line =< 9,
    Col >= 0,
    Col =< 9.

%Gets user move input, only checks if it is inside the board and not if it is valid
getInput(Line,Col):-
    write('Line: '),
    read(Line),
    write('Col: '),
    read(Char),
    number(Line),
    not(number(Char)),
    char_code(Char,Code),
    Col is Code - 97.

%Gets a menu option
getOption(Option):-
    write('\n\nOption: '),
    read(Option),
    number(Option).