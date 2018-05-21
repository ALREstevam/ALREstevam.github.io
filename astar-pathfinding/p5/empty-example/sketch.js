"use strict";

/*
* Este algoritmo gera um mapa e usa de algum algoritmo de busca com ou sem heurística para encontrar um caminho
* (caso exista) entre um nó inicial e um nó final.
*
* O mapa gerado é dividido entre a parte verde (simulando solo) e a parte azul (simulando água),
* o agente precisa encontrar o caminho entre dois nós do grid com a limitação de não poder passar pela água
* os caminhos por terra estão representados em diferentes tons de verde - tons mais claros indicam caminhos mais fáceis
* de serem percorridos e tons mais escuros, caminhos mais difíceis.
*
* A geração do mapa é aleatória, podendo haver mapas em que não existe caminho possível entre os dois nós, nele
* os pedaços de terra que tocam água são mais fáceis de serem percorridos, simulando uma praia.
*
* Este é um código na linguagem JavaScript utilizando o framework P5.
*
* */


/*
* Remoção de um elemento de um vetor: o javascript não faz isso nativamente, é preciso codificar esse comportamento.
* */
function removeFromArray(arr, elem) {
    for(var i = arr.length -1; i >= 0; i--){
        if(arr[i] == elem){
            arr.splice(i, 1);
        }
    }
}

/*Lista dos tipos de cálculo de distância entre pontos (utilizados na heurística)*/
var distanceHeuristicTypes = ['Euclidean', 'Manhattan'];

/*Cálculo da distância entre dois nós*/
function heuristic(a, b, distance) {

    var d;
    if(distance == distanceHeuristicTypes[0]){
        //Euclidean distance
        d = dist(a.x, a.y, b.x, b.y);
    }else{
        //Manhattan distance
        d = abs(a.x - b.x) + abs(a.y - b.y);
    }
    return d;
}

/*Contadores*/
var stepsCount = 0;

/*Tamanho do grid*/
var cols = 60;
var rows = cols;

/*Declaração da variável que armazena o grid/grafo */
var grid = undefined;

/*Lista de nós abertos e nós fechados*/
var openSet = [];
var closeSet = [];

/*Lista de nós no caminho escolhido*/
var path = [];

/*Início e fim*/
var start;
var end;

/*Altura e largura de cada quadrado no mapa*/
var w, h;


/*Variáveis que armazenam objetos do DOM (interface)*/
var inputSize;


/*Flag: algoritmo está em execução*/
var execute = false;


/*======================================= VARIÁVEIS QUE MUDAM O COMPORTAMENTO DO PROGRAMA ===========================*/

var m = 1; //neighbour.g -> difficulty
var n = 1; //neighbour.h -> distance to goal

/*
* A heurística utilizada será:
*
* f(i) = (m * g(i)) + (n * h(i))
*
* Em que i é um nó
* g(i) é a soma do caminho percorrido até o momento somada à dificuldade de ir ao nó i
* h(i) é a distância do nó i até o nó objetivo (o método de cálculo de distância pode ser escolhido posteriormente)
*
* Compotamentos do algoritmo
*
* SE m = 1 e n = 1 ENTÃO A FUNÇÃO HEURÍSTICA SERÁ: (f(i) = g(i) + h(i)) O QUE LEVA A UMA BUSCA: A* visto que a distância
*   até o objetivo e a dificuldade do caminho serão considerados
* SE m = 1 e n = 0 ENTÃO A FUNÇÃO HEURÍSTICA SERÁ: (f(i) = g(i)) O QUE LEVA A UMA BUSCA:
*   mista entre amplitude e profundidade em que os nós de menor custo serão explorados primeiro.
* SE m = 0 e n = 1 ENTÃO A FUNÇÃO HEURÍSTICA SERÁ: (f(i) = h(i)) O QUE LEVA A UMA BUSCA:
*   best first com backtracking: caso o algoritmo chegue em um dead end tentará continuar a partir do nó aberto com
*   menor distância até o objetivo.
* SE m = 0 e n = 0 ENTÃO A FUNÇÃO HEURÍSTICA SERÁ: nenhuma O QUE LEVA A UMA BUSCA: em amplitude, os nós vizinhos do nós
*   abertos serão explorados primeiro.
*
*
* */


/*Porcentagem de barreiras em locais randômicos: chance de um nó qualquer ser uma barreira*/
var randomWallPercentage = 0.0;
/*Permitir que o agente se mova na diagonal*/
var allowDiagonalMovement = true;
/*Quantidade de barreiras geradas em grupos: quanto maior for o número maiores serão os "rios"*/
var difficultPathToWallAmount = 0.5;
/*Método do cálculo de distância
* distanceHeuristicTypes[0] :  distância Euclidiana
* distanceHeuristicTypes[1] :  distância de Manhattan
* */
var choosenDistanceMethod = distanceHeuristicTypes[1];

/*====================================================================================================================*/

/*Definção do objeto que representa cada célula do grid / nó do grafo*/
function Cell(xpos, ypos){
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.x = xpos;
    this.y = ypos;

    this.mark = false;
    this.previous = undefined;
    this.neighbors = [];
    this.wall = random(1) < randomWallPercentage;
    this.supereasy = false;
    this.difficulty =  1;
    this.inClosedSet = false;
    this.inOpenSet = false;

    /*Mostrar o nó de forma visual: com uma cor especidifacada como argumento*/
    this.showPath = function (clr) {
        if(this.wall){
           fill(0);
        }else{
            fill(clr);
        }
        noStroke();
        rect(this.x * w, this.y * h, w, h);
    };

    /*Definição das cores padrão dependendo do tipo e parâmetros do nó*/
    this.show = function () {
        var r = 1;
        var g = 1;
        var b = 1;

        if(this.wall){
            //Wall
            r = 2;
            g = 204;
            b = 204;
        }else if(this.supereasy){
            //Supereasy cell
            r = 60;
            g = 255;
            b = 53;
        }
        else{
            //Normal cell
            r = 32;
            g = 255 - ((this.difficulty * 3) % 200);
            b = 0;
        }
        if(this.inClosedSet){
            r += 150;
        }else
        if(this.inOpenSet){
            b += 150;
            g += 150;
        }


        fill(color(r, g, b));
        noStroke();
        rect(this.x * w, this.y * h, w, h);
    };

    /*Função que gera o mapa*/
    this.setDifficulty = function (initialDif) {
        var maxValue = abs(heuristic(start, end, choosenDistanceMethod)/8);
        this.difficulty = floor(initialDif);

        var tempArr = shuffle(this.neighbors);

        for(var i = 0; i < tempArr.length; i++){
            if(!tempArr[i].mark && !tempArr[i].wall){
                tempArr[i].mark = true;
                tempArr[i].setDifficulty((initialDif + 0.1) % maxValue);

                if(this.difficulty > maxValue - floor(difficultPathToWallAmount * 100)/7){
                    this.wall = true;
                }

                if(this.difficulty < maxValue - (maxValue * 0.8) && !this.wall){
                    this.supereasy = true;
                    this.difficulty = 1;
                }
                else{
                    for(var i = 0; i < this.neighbors.length -1; i++){
                        if(this.neighbors[i].wall && !this.wall){
                            this.supereasy = true;
                            this.difficulty = 1;
                            break;
                        }
                    }
                }
            }
        }

    };

    /*Função que calcula para cada nó quais são seus vizinhos*/
    this.addNeibors = function (grd, isDiagonal) {
        this.neighbors = [];

        var x = this.x;
        var y = this.y;

        if(x < rows-1){ this.neighbors.push(grd[x+1][y]);   }
        if(y < cols-1){ this.neighbors.push(grd[x][y+1]);   }
        if(x > 0){      this.neighbors.push(grd[x-1][y]);   }
        if(y > 0){      this.neighbors.push(grd[x][y-1]);   }

        if(isDiagonal){
            if(x < rows -1 && y < cols -1 /*&&
                !grd[x][y+1].wall && !grd[x+1][y].wall*/)
            {
                this.neighbors.push(grd[x+1][y+1]);
            }

            if(x > 0 && y > 0 /*&&
                !grd[x-1][y].wall && !grd[x-1][y].wall*/)
            {
                this.neighbors.push(grd[x-1][y-1]);
            }

            if(x < rows -1 && y > 0 /*&&
                !grd[x+1][y].wall && !grd[x][y-1].wall*/)
            {
                this.neighbors.push(grd[x+1][y-1]);
            }

            if(x > 0 && y < cols -1 /*&&
                !grd[x-1][y].wall && !grd[x][y+1].wall*/)
            {
                this.neighbors.push(grd[x-1][y+1]);
            }
        }
    };
}

/*Função de setup do algoritmo*/
var stepsText;
function setup() {
    randomSeed(0);
    var mycanvas = createCanvas(600, 600);
    //mycanvas.parent("canvasContainer");

    w = width/cols;
    h = height/rows;

    generateGrid();

    inputSize = createInput("60", "number");

    var beginButton = createButton("Begin");
    var resetButton = createButton("Reset");

    beginButton.mousePressed(begin);
    resetButton.mousePressed(reset);

    //stepsText = createP('Steps: 0');
}

/*Função que dispara o início da busca*/
function begin() {
    execute = true;
}

/*Função que limpa as estruturas de dados geradas e prepara uma nova execução*/
function reset() {
    var size = inputSize.value();

    if(size > 3 && size <= 110){
        cols = size;
        rows = size;
    }

    w = width/cols;
    h = height/rows;

    execute = false;


    openSet = [];
    closeSet = [];
    path = [];
    generateGrid();
    loop();
}

/*Função que gera o grid colocando e conectando os nós*/
function generateGrid() {
    grid = new Array(cols);
    //Fazendo uma matriz bidimencional
    for(var i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }

    //Colocando um objeto em cada posição do vetor
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j] = new Cell(i, j);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows -1];

    calculateNeigbours();

    end.setDifficulty(0.1);

    calculateNeigbours();
    //calculateNeigbours();


    //Colocando o ponto inicial na lista de nós abertos
    openSet.push(start);
    //console.log(grid);




    //Vizinhos dos e nós inicial e final não podem ser barreiras
    end.wall = false;
    for(var i = 0; i < end.neighbors.length; i++){
        end.neighbors[i].wall = false;
    }

    start.wall = false;
    for(var i = 0; i < start.neighbors.length; i++){
        start.neighbors[i].wall = false;
    }
}

/*Função para definir os vizinhos de cada nó*/
function calculateNeigbours() {
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].addNeibors(grid, allowDiagonalMovement);
        }
    }
}


/*Função que desenha a interface: essa função é chamada repetidamente pelo
* framework utilizado, ela é utilizada ao invés de uma estrutura de repetição,
* dessa forma cada etapa do algoritmo será desenhada na tela*/
function draw() {
    background(0);

    /*Se a flag que indica que o algoritmo deve executar for ativada*/
    if(execute){
        stepsCount ++;
        if(openSet.length > 0){
            //BUSCANDO

            var lowestIndex = 0;

            //Encontrando o nó com menor custo (f)
            for(var i = 0; i < openSet.length; i++){
                if(openSet[i].f < openSet[lowestIndex].f){
                    lowestIndex = i;
                }
            }
            var current = openSet[lowestIndex];

            //Caso tenha chegado ao fim
            if(current === end){
                console.log("DONE!");
                noLoop();
            }


            removeFromArray(openSet, current);
            closeSet.push(current);
            current.inClosedSet = true;

            //Definindo variáveis para desenhar o caminho atual
            path = [];
            var temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }

            //Cálculo da heurística e definição do caminho
            var neighbors = current.neighbors;
            for(var i = 0; i < neighbors.length; i++){
                var neighbour = neighbors[i];

                var newPath = false;
                //Caso o vizinho em questão não esteja fechado e não seja uma barreira
                if(!closeSet.includes(neighbour) && !neighbour.wall){
                    //Cálculo de um g(n) temporário
                    var tempg = current.g + neighbour.difficulty;

                    //Escolh do menor g
                    if(openSet.includes(neighbour)){
                        if(tempg < neighbour.g){
                            neighbour.g = tempg;
                            newPath = true;
                        }
                    }else{
                        neighbour.g = tempg;
                        openSet.push(neighbour);
                        newPath = true;
                    }
                    if(newPath){
                        //Cálculo da heurística
                        neighbour.h = heuristic(neighbour, end, choosenDistanceMethod);
                        neighbour.f = (m * neighbour.g) + (n * neighbour.h);
                        neighbour.previous = current;
                    }
                }
            }
        }else{
            //NÃO EXISTE SOLUÇÃO
            console.log('No solution');
            noLoop();
        }
    }


    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].show();
        }
    }

    for(var i = 0; i < closeSet.length; i++){
        closeSet[i].inClosedSet = true;
        closeSet[i].inOpenSet = false;
    }
    for(var i = 0; i < openSet.length; i++){
        //openSet[i].showPath(color(132, 132, 132));
        openSet[i].inOpenSet = true;
    }

    for(var i = 0; i < path.length; i++){
        path[i].showPath(color(49, 0, 198));
    }

}

/*Função que embaralha os elementos de um vetor*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}