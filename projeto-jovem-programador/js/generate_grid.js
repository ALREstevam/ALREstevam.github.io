
var imagename = "thumb.png";
var executablename = "index.html";

var info = [
    {"text":"Projeto finalizado",          "path":"executaveis\\Nosso\\final"},
    {"text":"Aula 1",          "path":"executaveis\\Nosso\\aula1"},
    {"text":"Aula 2",          "path":"executaveis\\Nosso\\aula2-1"},
    {"text":"Aula 2 (correção)",          "path":"executaveis\\Nosso\\aula2-2"},
    {"text":"Aula 3",          "path":"executaveis\\Nosso\\aula3"},
    {"text":"Aula 4",          "path":"executaveis\\Nosso\\aula4"},
    {"text":"Aula 5",          "path":"executaveis\\Nosso\\aula5"},
    {"text":"Aluno: ? - Aula 6",          "path":"executaveis\\aula6\\01"},
    {"text":"Aluno: ? - Aula 6",          "path":"executaveis\\aula6\\02"},
    {"text":"Aluno: ? - Aula 5",          "path":"executaveis\\aula5\\01"},
    {"text":"Aluno: ? - Aula 5",          "path":"executaveis\\aula5\\02"},
    {"text":"Aluno: ? - Aula 4",          "path":"executaveis\\aula4\\01"},
    {"text":"Aluno: ? - Aula 4",          "path":"executaveis\\aula4\\02"},
    {"text":"Aluno: ? - Aula 4",          "path":"executaveis\\aula4\\03"},
    {"text":"Aluno: ? - Aula 3",          "path":"executaveis\\aula3\\01"},
    {"text":"Aluno: ? - Aula 3",          "path":"executaveis\\aula3\\02"},
    {"text":"Aluno: ? - Aula 3",          "path":"executaveis\\aula3\\03"},
    {"text":"Aluno: ? - Aula 2",          "path":"executaveis\\aula2\\01"},
    {"text":"Aluno: ? - Aula 2",          "path":"executaveis\\aula2\\02"},
    {"text":"Aluno: ? - Aula 2",          "path":"executaveis\\aula2\\03"},
    {"text":"Aluno: ? - Aula 1",          "path":"executaveis\\aula1\\01"},
    {"text":"Aluno: ? - Aula 1",          "path":"executaveis\\aula1\\02"}
];





var insertArea = document.getElementById('insertContainer');


for(var i = 0; i < info.length; i++){
    var text = info[i]["text"];
    var path = info[i]["path"];

    var html =  '<a href="'+ path+'\\'+executablename +'">' +
                '    <div class="grid-item">' +
                '        <div>' +
                '            <img src="'+ path + '\\' + imagename +'"><br>' +
                '            <span>'+ text +'</span><br>' +
                '        </div>' +
                '    </div>' +
                '</a>';
    insertArea.innerHTML += html;
}





















