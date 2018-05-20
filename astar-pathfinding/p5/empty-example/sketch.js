"use strict";

function removeFromArray(arr, elem) {
    for(var i = arr.length -1; i >= 0; i--){
        if(arr[i] == elem){
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {

    //Euclidean
    //var d = dist(a.x, a.y, b.x, b.y);
    var d = abs(a.x - b.x) + abs(a.y - b.y);
    //Manhattan

    return d;

}




var cols = 60;
var rows = cols;

var grid = undefined;

var openSet = [];
var closeSet = [];

var start;
var end;

var w, h;

var path = [];

var inputSize;



var m = 0.5; //neighbour.g -> difficulty
var n = 1; //neighbour.h -> distance to goal
var randomWallPercentage = 0.0;
var allowDiagonalMovement = true;
var difficultPathToWallAmount = 0.6;




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


    this.showPath = function (clr) {
        if(this.wall){
           fill(0);
        }else{
            fill(clr);
        }
        noStroke();
        rect(this.x * w, this.y * h, w, h);
    };

    this.show = function () {
        var r = 1;
        var g = 1;
        var b = 1;

        if(this.wall){
            r = 2;
            g = 204;
            b = 204;
        }else if(this.supereasy){
            //60, 255, 53
            r = 60;
            g = 255;
            b = 53;
        }
        else{
            r = 32;
            g = 255 - ((this.difficulty * 3) % 200);
            b = 0;



        }
        fill(color(r, g, b));
        noStroke();
        rect(this.x * w, this.y * h, w, h);
    };

    this.setDifficulty = function (initialDif) {
        var maxValue = abs(heuristic(start, end)/8);
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
    resetButton.mousePressed(reset)
}

var execute = false;

function begin() {
    execute = true;
}

function reset() {
    var size = inputSize.value();

    if(size > 3 && size <= 200){
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
    calculateNeigbours();


    //Colocando o ponto inicial na lista de nós abertos
    openSet.push(start);
    //console.log(grid);

    start.wall = false;
    end.wall = false;

    for(var i = 0; i < end.neighbors.length; i++){
        end.neighbors[i].wall = false;
    }

    for(var i = 0; i < start.neighbors.length; i++){
        start.neighbors[i].wall = false;
    }
}


function calculateNeigbours() {
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].addNeibors(grid, allowDiagonalMovement);
        }
    }
}

function draw() {
    background(0);

    if(execute){
        if(openSet.length > 0){
            //Continuar procurando

            var lowestIndex = 0;

            for(var i = 0; i < openSet.length; i++){
                if(openSet[i].f < openSet[lowestIndex].f){
                    lowestIndex = i;
                }
            }
            var current = openSet[lowestIndex];

            if(current === end){
                console.log("DONE!");
                noLoop();
            }

            removeFromArray(openSet, current);
            closeSet.push(current);

            path = [];
            var temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }

            var neighbors = current.neighbors;

            for(var i = 0; i < neighbors.length; i++){
                var neighbour = neighbors[i];

                var newPath = false;
                if(!closeSet.includes(neighbour) && !neighbour.wall){
                    var tempg = current.g + neighbour.difficulty;

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
                        neighbour.h = heuristic(neighbour, end);
                        neighbour.f = (m * neighbour.g) + (n * neighbour.h);
                        neighbour.previous = current;
                    }
                }
            }
        }else{
            console.log('No solution');
            noLoop();
            //return;
        }
    }


    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].show();
        }
    }

    /*for(var i = 0; i < closeSet.length; i++){
        closeSet[i].showPath(color(255,0,0));
    }
    */
    for(var i = 0; i < openSet.length; i++){
        openSet[i].showPath(color(132, 132, 132));
    }

    for(var i = 0; i < path.length; i++){
        path[i].showPath(color(89, 65, 65));
    }

}


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