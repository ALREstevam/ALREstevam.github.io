


function setVariables() {
    randomSeed(randomSeedInput.value());
    noiseSeed(randomSeedInput.value());
    randomWallPercentage = randomObstaclePercentageSlider.value();
    allowDiagonalMovement = allowDiagonalMovementRadio.value() == 1;
    difficultPathToWallAmount = groupObstacleSlider.value();
    choosenDistanceMethod = distanceHeuristicTypes[distanceMethodRadio.value()];
}



/*Função que gera o grid colocando e conectando os nós*/
function generateGrid() {
    var i;
    grid = new Array(cols);
    //Fazendo uma matriz bidimencional
    for(i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }

    //Colocando um objeto em cada posição do vetor
    for(i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j] = new Cell(i, j);
        }
    }


    var startPoint = ceil(random(0, rows/4));
    var endPoint = ceil(random(rows/4, rows-1));

    start = grid[startPoint][startPoint];
    end = grid[endPoint][endPoint];

    calculateNeigbours();
    end.setDifficulty(0.1);
    calculateNeigbours();

    for(i = 0 ; i < ceil(random(2, 8)); i++){
        grid[ceil(random(0, rows-1))][ceil(random(0, cols-1))].setRisk(ceil(random(2, 6)), 0);
    }

    //Colocando o ponto inicial na lista de nós abertos
    start.g = 0;
    start.h = heuristic(start, end, choosenDistanceMethod);
    start.f = start.g + start.h;
    openSet.push(start);
    //console.log(grid);


    //Vizinhos dos e nós inicial e final não podem ser barreiras
    end.wall = false;

    var i;
    var neiborsLen = end.neighbors.length;

    for(i = 0; i < neiborsLen; i++){
        end.neighbors[i].wall = false;
    }

    neiborsLen = start.neighbors.length;
    start.wall = false;
    for(i = 0; i < neiborsLen; i++){
        start.neighbors[i].wall = false;
    }
}



var showFlag = true;
/*Função que desenha a interface: essa função é chamada repetidamente pelo
* framework utilizado, ela é utilizada ao invés de uma estrutura de repetição,
* dessa forma cada etapa do algoritmo será desenhada na tela*/
function draw() {
    background(0);

    /*Se a flag que indica que o algoritmo deve executar for ativada*/
    if(execute && !fastExecuteFlag){
        pathfindStep();
    }


    var totalNodesCount = 0;

    if(showFlag){
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].show();

            if(!grid[i][j].wall){
                totalNodesCount += 1;
            }
        }
    }
    }

    var closedSetLen = closeSet.length;
    var i;

    var closedHtml = "";
    var openedHtml = "";
    var pathHtml = "";



    for(i = 0; i < closedSetLen; i++){
        closeSet[i].inClosedSet = true;
        closeSet[i].inOpenSet = false;

        closedHtml += "<span>" +
            "<strong class='listItemTitle'>xy(" + closeSet[i].x + ", " + closeSet[i].y + ")</strong><br>" +
            " <strong>f: </strong>" + closeSet[i].f +
            " <strong>g: </strong>" + closeSet[i].g +
            " <strong>h: </strong>" + closeSet[i].h +
            " <br><strong>difficulty: </strong>" + closeSet[i].difficulty +
            " <br><strong>risk: </strong>" + closeSet[i].risk +
            "</span>" +
            "<hr>";

    }
    var openSetLen = openSet.length;
    for(i = 0; i < openSetLen; i++){
        openSet[i].inOpenSet = true;

        openedHtml += "<span>" +
            "<strong class='listItemTitle'>xy(" + openSet[i].x + ", " + openSet[i].y + ")</strong><br>" +
            " <strong>f: </strong>" + openSet[i].f +
            " <strong>g: </strong>" + openSet[i].g +
            " <strong>h: </strong>" + openSet[i].h +
            " <br><strong>difficulty: </strong>" + openSet[i].difficulty +
            " <br><strong>risk: </strong>" + openSet[i].risk +
            "</span>" +
            "<hr>";

    }

    var countPathCost = 0;
    var pathLenValue = path.length;
    for(i = 0; i < pathLenValue; i++){
        path[i].showPath(color(49, 0, 198));

        countPathCost += path[i].difficulty + path[i].risk + 1;

        pathHtml += "<span>" +
            "<strong class='listItemTitle'>xy(" + path[i].x + ", " + path[i].y + ")</strong><br>" +
            " <strong>f: </strong>" + path[i].f +
            " <strong>g: </strong>" + path[i].g +
            " <strong>h: </strong>" + path[i].h +
            " <br><strong>difficulty: </strong>" + path[i].difficulty +
            " <br><strong>risk: </strong>" + path[i].risk +
            "</span>" +
            "<hr>";
    }

    start.show();

    stepsText.html('<strong>Steps:</strong>' + stepsCount);

    pathLen.html("<strong>Path lenght: </strong>" + path.length);
    pathCost.html('<strong>Path cost:</strong> ' + countPathCost);


    openedNodesText.html('<strong>Opened nodes:</strong> ' + openSet.length);
    closedNodesText.html('<strong>Closed nodes:</strong> ' + closeSet.length);
    totalNodes.html('<strong>Total nodes:</strong> ' + totalNodesCount);

    wValueText.html('<strong>w: controla g(n):</strong> ' +   wValueInput.value());
    xValueText.html('<strong>x: controla h(n):</strong>' +           xValueInput.value());
    yValueText.html('<strong>y: controla dif(n):</strong> ' +   yValueInput.value());
    zValueText.html('<strong>z: controls risk(n):</strong>' +           zValueInput.value());


    var formulaHtml = "<span class='formula'>f(n) =1 + w * (y * dif(n) + z * rsk(n)) + x *(h(n))</span><br>";
    formulaHtml += "<span class='formula'>f(n) = 1";

    if(wValueInput.value() != 0 && (yValueInput.value() != 0 || zValueInput.value() != 0)){
        formulaHtml += ' + ';
        formulaHtml +=  wValueInput.value() + " * ( ";
        if(yValueInput.value() != 0){
            formulaHtml += yValueInput.value() + " * dif(n)";
        }

        if(yValueInput.value() != 0 && zValueInput.value() != 0){
            formulaHtml += " + ";
        }

        if(zValueInput.value() != 0){
            formulaHtml += zValueInput.value() + " * rsk(n)";
        }
        formulaHtml += " ) ";

        if(xValueInput.value() != 0){
            formulaHtml += " + ";
        }
    }else{
        if(xValueInput.value() != 0){
            formulaHtml += ' + ';
        }
    }
    if(xValueInput.value() != 0){
        formulaHtml += " " + xValueInput.value() + " * (h(n))";
    }
    formulaHtml += "</span>";



    //f(n) = 1 + w * (y * dif(n) + z * rsk(n)) + x *(h(n))
    
    heuristicFormula.html(formulaHtml);
        

    randomObstaclePercentageText.html('<strong>Random obstacles percentage:</strong> ' + randomObstaclePercentageSlider.value() + "\% (x100)");
    groupObstacleText.html('<strong>Group obstacle percentage:</strong> ' + groupObstacleSlider.value() + '\% (x100)');
    allowDiagonalMovementText.html('<strong>Allow diagonal movement:</strong> ' + (allowDiagonalMovementRadio.value() == 1 ? "yes" : "no"));
    distanceMethodText.html('<strong>Method to calculate distance:</strong>  ' + (distanceMethodRadio.value() == 1 ? "Manhattan" : "Euclidean"));

    closedNodesLog.html(closedHtml);
    openedNodesLog.html(openedHtml);
    pathNodesLog.html(pathHtml);



}



/*Função para definir os vizinhos de cada nó*/
function calculateNeigbours() {
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].addNeibors(grid, allowDiagonalMovement);
        }
    }
}

function fastExecute() {
    runStatus.html('<strong>Status: </strong> running on fast execute...');
    fastExecuteFlag = true;
    begin();

    while(execute){
        pathfindStep();
    }
    fastExecuteFlag = false;
}

function stepExecute() {
    runStatus.html('<strong>Status: </strong> step run.');
    pathfindStep();
}


function pauseExecution() {
    execute = false;
    runStatus.html('<strong>Status: </strong> paused.');
}

function randomizeInputSeedText(){
    randomSeedInput.value(ceil(random(0, 500)));
    reset();
}


/*Função que dispara o início da busca*/
function begin() {
    m = wValueInput.value();
    n = xValueInput.value();
    execute = true;
    runStatus.html('<strong>Status: </strong> running...');
}

var treeNet = undefined;
var treeContainerName = 'mynetwork';

/*Função que limpa as estruturas de dados geradas e prepara uma nova execução*/
function reset() {
    grid = null;

    var size = inputSize.value();

    stepsText.html('<strong>Steps:</strong> 0');
    runStatus.html('<strong>Status:</strong> not running.');
    pathLen.html('<strong>Path lenght:</strong> 0');
    pathCost.html('<strong>Path cost:</strong> 0');
    openedNodesText.html('<strong>Opened nodes:</strong> 0');
    closedNodesText.html('<strong>Closed nodes:</strong> 0');
    totalNodes.html('<strong>Total nodes:</strong> 0');

    randomObstaclePercentageText.html('<strong>Random obstacles percentage:</strong> 0%');
    groupObstacleText.html('<strong>Group obstacle percentage:</strong> 0%');
    allowDiagonalMovementText.html('<strong>Allow diagonal movement:</strong> yes');
    distanceMethodText.html('<strong>Method to calculate distance:</strong> Manhattan');

    if(size > 3 && size <= 300){
        cols = size;
        rows = size;
    }

    setVariables();
    w = width/cols;
    h = height/rows;

    execute = false;


    openSet = [];
    closeSet = [];
    path = [];

    stepsCount = 0;
    generateGrid();
    runStatus.html('<strong>Status: </strong> not started.');
    
    
    if(treeNet == undefined){
        treeNet = new MyTreeNetwork();
    }
    treeNet.deleteNetwork();
    //treeNet.createNetwork(treeContainerName);
    treeNet.addFirstNodeWithId(getIdFrom(start), formatNetElemText(start), "rgb(255, 55, 55)");


    wWeight = wValueInput.value();
    xWeight = xValueInput.value();
    yWeight = yValueInput.value();
    zWeight = zValueInput.value();
}

function showTreeNetwork(){
    if(treeNet == undefined){
        treeNet = new MyTreeNetwork();
    }
    treeNet.commitNetwork();
    treeNet.createNetwork(treeContainerName);
}

function formatNetElemId(elem){
    elem.idCount += 1;
    return parseInt('1' + elem.x + '00' + elem.y + '00' + elem.idCount);
}

function getIdFrom(elem) {
    return parseInt('1' + elem.x + '00' + elem.y + '00' + elem.idCount);
}

function formatNetElemText(elem){
    return 'xy('+ elem.x + ', '  + elem.y +')\nf(n) = ' + elem.f;
}

function formatNetElemColor(elem){
    rgbaToHex(elem.mycolor.toString());
}

function formatArrowText(elem) {
    return 'h(n) = ' + elem.h + '\n' +
           'g(n) = ' + elem.g + '\n' +
           'dif(n) = ' + elem.difficulty + '\n' +
           'risk(n) = ' + elem.risk + '\n';
}

