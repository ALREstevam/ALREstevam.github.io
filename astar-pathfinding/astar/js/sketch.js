


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
    var i;

    /*Se a flag que indica que o algoritmo deve executar for ativada*/
    if(execute && !fastExecuteFlag){
        pathfindStep();
    }


    var totalNodesCount = 0;

    if(showFlag){
        for(i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                grid[i][j].show();

                if(!grid[i][j].wall){
                    totalNodesCount += 1;
                }
            }
        }
    }

    var closedSetLen = closeSet.length;
    var openSetLen = openSet.length;


    var closedHtml = "";
    var openedHtml = "";
    var pathHtml = "";


    for(i = 0; i < closedSetLen; i++){
        closedHtml += formatItemForColumn(closeSet[i]);
    }

    for(i = 0; i < openSetLen; i++){
        openedHtml += formatItemForColumn(openSet[i]);
    }

    var countPathCost = 0;
    var pathLenValue = path.length;
    for(i = 0; i < pathLenValue; i++){
        path[i].showPath(color(49, 0, 198));

        countPathCost += path[i].difficulty + path[i].risk + 1;
        pathHtml += formatItemForColumn(path[i]);
    }

    start.show();

    stepsText.html('<strong>Passos: </strong>' + stepsCount);

    pathLen.html("<strong>Tamanho do caminho: </strong>" + path.length);
    pathCost.html('<strong>Custo do caminho:</strong> ' + countPathCost);


    openedNodesText.html('<strong>Nós abertos:</strong> ' + openSet.length);
    closedNodesText.html('<strong>Nós fechados:</strong> ' + closeSet.length);
    totalNodes.html('<strong>Nós totais:</strong> ' + totalNodesCount);

    
    closedNodesLog.html(closedHtml);
    openedNodesLog.html(openedHtml);
    pathNodesLog.html(pathHtml);
}

function configsChanged() {
    randomObstaclePercentageText.html('<strong>Chance de um nó ser água:</strong> ' + randomObstaclePercentageSlider.value() + "\% (x100)");
    groupObstacleText.html('<strong>Chance de água em grupos:</strong> ' + groupObstacleSlider.value() + '\% (x100)');
    allowDiagonalMovementText.html('<strong>Permitir movimento na diagonal:</strong> ' + (allowDiagonalMovementRadio.value() == 1 ? "sim" : "não"));
    distanceMethodText.html('<strong>Método de cálculo de distância:</strong>  ' + (distanceMethodRadio.value() == 1 ? "Manhattan" : "Euclidiana"));

}
function changeHeuristicFormulaView(){
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


    wValueText.html('<strong>w: controla <span class="formula">g(n)</span>:</strong> ' +   wValueInput.value());
    xValueText.html('<strong>x: controla <span class="formula">h(n)</span>:</strong>' +           xValueInput.value());
    yValueText.html('<strong>y: controla <span class="formula">dif(n)</span>:</strong> ' +   yValueInput.value());
    zValueText.html('<strong>z: controls <span class="formula">risk(n)</span>:</strong>' +           zValueInput.value());
}

function formatItemForColumn(elem) {
    return "<span>" +
        "<strong class='listItemTitle'>xy(" + elem.x + ", " + elem.y + ")</strong><br>" +
        " <strong>f: </strong>" + elem.f.toFixed(1) +
        " <strong>g: </strong>" + elem.g.toFixed(1) +
        " <strong>h: </strong>" + elem.h.toFixed(1) +
        " <br><strong>difficulty: </strong>" + elem.difficulty +
        " <br><strong>risk: </strong>" + elem.risk +
        "</span>" +
        "<hr>";
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
    runStatus.html('<strong>Status: </strong> executando rapidamente...');
    fastExecuteFlag = true;
    begin();

    while(execute){
        pathfindStep();
    }
    fastExecuteFlag = false;
}

function stepExecute() {
    runStatus.html('<strong>Status: </strong> execução passo a passo: novo passo.');
    pathfindStep();
}


function pauseExecution() {
    execute = false;
    runStatus.html('<strong>Status: </strong> pausado.');
}

function randomizeInputSeedText(){
    randomSeedInput.value( parseFloat(random(-500, 500).toFixed(2)) );
    reset();
}


/*Função que dispara o início da busca*/
function begin() {
    m = wValueInput.value();
    n = xValueInput.value();
    execute = true;
    runStatus.html('<strong>Status: </strong> executando...');
}

var treeNet = undefined;
var treeContainerName = 'mynetwork';

/*Função que limpa as estruturas de dados geradas e prepara uma nova execução*/
function reset() {
    grid = null;

    var size = inputSize.value();

    stepsText.html('<strong>Etapas:</strong> 0');
    runStatus.html('<strong>Status:</strong> não está sendo executado.');
    pathLen.html('<strong>Tamanho do caminho:</strong> 0');
    pathCost.html('<strong>Custo do caminho:</strong> 0');
    openedNodesText.html('<strong>Nós abertos:</strong> 0');
    closedNodesText.html('<strong>Nós fechados:</strong> 0');
    totalNodes.html('<strong>Nós totais:</strong> 0');

    randomObstaclePercentageText.html('<strong>Chance de um nó ser água:</strong> 0% (x100)');
    groupObstacleText.html('<strong>Chance de água em grupos:</strong> 0% (x100)');
    allowDiagonalMovementText.html('<strong>Permitir movimento na diagonal:</strong> sim');
    distanceMethodText.html('<strong>Método de cálculo de distância:</strong> Euclidiana');

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
    runStatus.html('<strong>Status: </strong> grafo gerado, esperando para executar...');

    
    if(treeNet == undefined){
        treeNet = new MyTreeNetwork();
    }
    treeNet.deleteNetwork();
    //treeNet.createNetwork(treeContainerName);
    treeNet.addFirstNodeWithId(getIdFrom(start), formatNetElemText(start), "rgb(255, 55, 55)", start.f);

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

function showSubtitleModal() {
    document.getElementById('id02').style.display='block';
}

function formatNetElemId(elem){
    elem.idCount += 1;
    return parseInt('1' + elem.x + '00' + elem.y + '00' + elem.idCount);
}

function getIdFrom(elem) {
    return parseInt('1' + elem.x + '00' + elem.y + '00' + elem.idCount);
}

function formatNetElemText(elem){
    return 'xy('+ elem.x + ', '  + elem.y +')\nf(n) = ' + elem.f.toFixed(2);
}

function formatArrowText(elem) {
    return 'h(n) = ' + elem.h.toFixed(2) + '\n' +
           'g(n) = ' + elem.g.toFixed(2) + '\n' +
           'dif(n) = ' + elem.difficulty.toFixed(2) + '\n' +
           'risk(n) = ' + elem.risk.toFixed(2) + '\n';
}

function mantainPathClean() {
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].inClosedSet = false;
            grid[i][j].inOpenSet = false;
        }
    }
}





function mouseIsOverSquare(element){
    var htmlVal = '<strong>Mouse sobre o nó: </strong> (x: '+element.x+', y: '+ element.y + ')';

    if(element == end){
        htmlVal += '<br><strong>Tipo:</strong> nó objetivo';
    }else if(element == start){
        htmlVal += '<br><strong>Tipo:</strong> nó inicial';
    }else if(element.wall){
        htmlVal += '<br><strong>Tipo:</strong> água';
    }else{
        htmlVal += '<br><strong>Tipo:</strong> terra';
    }

    if(element.wall){
        htmlVal += '<br><strong>dificuldade:</strong> -';
        htmlVal += '<br><strong>risco:</strong> -';
        htmlVal += '<br><strong>f:</strong> -';
        htmlVal += '<br><strong>g:</strong> -';
        htmlVal += '<br><strong>h:</strong> -';
    }else{
        htmlVal += '<br><strong>dificuldade:</strong> ' + element.difficulty;
        htmlVal += '<br><strong>risco:</strong> ' + element.risk;
        htmlVal += '<br><strong>f:</strong> ' + element.f;
        htmlVal += '<br><strong>g:</strong> ' + element.g;
        htmlVal += '<br><strong>h:</strong> ' + element.h;
    }

    htmlVal += '<br><strong>Distância até objetivo:</strong> ' + heuristic(element, end, choosenDistanceMethod);
    mouseOverText.html(htmlVal);

    divTextAboutNode.position(mouseX + 50, mouseY + 100);
    var tempClr = element.mycolor;
    var otherColor;

    var minColor = 85;

    if(red(tempClr) < minColor && green(tempClr) < minColor && blue(tempClr) < minColor){
        otherColor = colorAsStrRGBA((red(tempClr) + 50) * 3, (green(tempClr) + 50) * 3, (blue(tempClr) + 50) * 3);
    }else{
        otherColor = colorAsStrRGBA(red(tempClr) /4, green(tempClr)/4, blue(tempClr)/4);
    }

    divTextAboutNode.style(
        'visibility: visible; background: '+colorAsStrRGBA(red(tempClr), green(tempClr), blue(tempClr), 210)+';' +
        'color: ' + otherColor +';' +
        'border: solid 1px ' + otherColor + ';'
    );

}



function mouseIsNotOverSquare() {
    divTextAboutNode.style('visibility: hidden;');
}