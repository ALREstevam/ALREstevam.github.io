/**
 * Created by andre on 23/05/2018.
 */
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
 * */


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
var stepsText;
var runStatus;
var pathLen;
var pathCost;
var openedNodesText;
var closedNodesText;
var totalNodes;
var mValueText;
var nValueText;
var nValueInput;
var mValueInput;
var randomSeedInput;
var randomObstaclePercentageText;
var randomObstaclePercentageSlider;
var allowDiagonalMovementText;
var allowDiagonalMovementRadio;
var distanceMethodText;
var distanceMethodRadio;
var groupObstacleText;
var groupObstacleSlider;
var openedNodesLog;
var closedNodesLog;
var pathNodesLog;

/*Flag: algoritmo está em execução*/
var execute = false;
var fastExecuteFlag = false;


/*======================================= VARIÁVEIS QUE MUDAM O COMPORTAMENTO DO PROGRAMA ===========================*/

var m; //neighbour.g -> difficulty weight
var n; //neighbour.h -> distance to goal weight
var o; //neighbour.risk -> consider risk areas weight

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



/*Função de setup do algoritmo*/

function setup() {

    var mycanvas = createCanvas(600, 600);
    mycanvas.parent("leftSection");
    //mycanvas.parent("canvasContainer");

    w = width/cols;
    h = height/rows;

    generateGrid();

    inputSize = createInput("60", "number");
    createP("Grid size:").parent("configuration");
    inputSize.parent("configuration");

    createP("Random seed for map generation:").parent("configuration");
    randomSeedInput = createInput(ceil(random(0, 200)), "number");
    randomSeedInput.parent("configuration");

    var buttonRandomize = createButton('Randomize');
    buttonRandomize.parent("configuration");
    buttonRandomize.mousePressed(randomizeInputSeedText);
    buttonRandomize.class("defaultButton blueButton");

    var showHeuristicButton = createButton('Show Heuristic Formula');
    showHeuristicButton.parent("configuration");
    showHeuristicButton.mousePressed(openHeuristicModal);
    showHeuristicButton.class("defaultButton blueButton");

    openedNodesLog = createDiv('Nothing to show.');
    closedNodesLog = createDiv('Nothing to show.');
    pathNodesLog = createDiv('Nothing to show.');

    openedNodesLog.parent('openedLog');
    closedNodesLog.parent('closedLog');
    pathNodesLog.parent('pathLog');

    openedNodesLog.class('divOverflow');
    closedNodesLog.class('divOverflow');
    pathNodesLog.class('divOverflow');

    createP("").parent("configuration");

    mValueText = createP("m:").parent("configuration");
    mValueInput = createSlider(0,1, 1, 0.1);//min, max, value, step
    mValueInput.parent("configuration");

    nValueText = createP("n:").parent("configuration");
    nValueInput = createSlider(0,1, 1, 0.1);//min, max, value, step
    nValueInput.parent("configuration");


    var beginButton = createButton("Begin/Play");
    createP("").parent("configuration");
    var fastExecuteButton = createButton("Fast execute");
    var resetButton = createButton("Set / Reset");
    var pauseButton = createButton("Pause Execution");
    var stepExecuteButton = createButton("Next step");


    createP("").parent("configuration");

    beginButton.parent("buttonArea");
    resetButton.parent("buttonArea");
    fastExecuteButton.parent("buttonArea");
    pauseButton.parent("buttonArea");
    stepExecuteButton.parent("buttonArea");

    beginButton.class("defaultButton geenButton");
    resetButton.class("defaultButton redButton");
    fastExecuteButton.class("defaultButton geenButton");
    pauseButton.class("defaultButton blackButton");
    stepExecuteButton.class("defaultButton blueButton");

    beginButton.mousePressed(begin);
    resetButton.mousePressed(reset);
    fastExecuteButton.mousePressed(fastExecute);
    pauseButton.mousePressed(pauseExecution);
    stepExecuteButton.mousePressed(stepExecute);

    stepsText = createP('<strong>Steps:</strong> 0');
    runStatus = createP('<strong>Status:</strong> not running.');
    pathLen = createP('<strong>Path lenght:</strong> 0');
    pathCost = createP('<strong>Path cost:</strong> 0');
    openedNodesText = createP('<strong>Opened nodes:</strong> 0');
    closedNodesText = createP('<strong>Closed nodes:</strong> 0');
    totalNodes = createP('<strong>Total nodes:</strong> 0');

    stepsText.parent("data");
    runStatus.parent("data");
    pathLen.parent("data");
    pathCost.parent("data");
    openedNodesText.parent("data");
    closedNodesText.parent("data");
    totalNodes.parent("data");


    randomObstaclePercentageText = createP('<strong>Random obstacles percentage:</strong> 0%');
    randomObstaclePercentageSlider = createSlider(0,1, 0, 0.1);//min, max, value, step
    randomObstaclePercentageText.parent('configuration2');
    randomObstaclePercentageSlider.parent('configuration2');

    groupObstacleText = createP('<strong>Group obstacle percentage:</strong> 0%');
    groupObstacleSlider = createSlider(0,1, 0.5, 0.1);//min, max, value, step
    groupObstacleText.parent('configuration2');
    groupObstacleSlider.parent('configuration2');

    allowDiagonalMovementText = createP('<strong>Allow diagonal movement:</strong> yes');
    allowDiagonalMovementRadio = createRadio('');
    allowDiagonalMovementRadio.option('Yes', 1).checked = true;
    allowDiagonalMovementRadio.option('No', 0);
    allowDiagonalMovementText.parent('configuration2');
    allowDiagonalMovementRadio.parent('configuration2');

    distanceMethodText = createP('<strong>Method to calculate distance:</strong> Manhattan');
    distanceMethodRadio = createRadio('');
    distanceMethodRadio.option('Euclidean', 0).checked = true;
    distanceMethodRadio.option('Manhattan', 1);
    distanceMethodText.parent('configuration2');
    distanceMethodRadio.parent('configuration2');

    reset();
}