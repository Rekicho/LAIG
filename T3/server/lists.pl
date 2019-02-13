getPeca(Nlinha,Ncoluna,Tab,Peca):-
    nth1(Nlinha,Tab,Linha),
    nth1(Ncoluna,Linha,Peca).

setPeca(Nlinha,Ncoluna,Peca,TabIn,TabOut):-
    setPecaLinha(Nlinha,Ncoluna,Peca,TabIn,TabOut).

setPecaLinha(1,Ncoluna,Peca,[Linha|MaisLinhas],[NovaLinha|MaisLinhas]):-
    setPecaColuna(Ncoluna,Peca,Linha,NovaLinha).

setPecaLinha(N,Ncoluna,Peca,[Linha|MaisLinhas],[Linha|NovasLinhas]):-
    N>1,
    Next is N-1,
    setPecaLinha(Next,Ncoluna,Peca,MaisLinhas,NovasLinhas).

setPecaColuna(1,Peca,[_|Resto],[Peca|Resto]).

setPecaColuna(N,Peca,[Peca1|Resto],[Peca1|Mais]):-
    N>1,
    Next is N-1,
    setPecaColuna(Next,Peca,Resto,Mais).