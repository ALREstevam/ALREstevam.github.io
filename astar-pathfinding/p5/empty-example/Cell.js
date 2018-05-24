/**
 * Created by andre on 23/05/2018.
 */
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
    this.risk = 0;
    this.difficulty =  1;
    this.inClosedSet = false;
    this.inOpenSet = false;
    this.mycolor = color(0, 0, 0);
    this.idCount = 0;

    /*Mostrar o nó de forma visual: com uma cor especidifacada como argumento*/
    this.showPath = function (clr) {

        if(clr.toString() != this.mycolor.toString()){
            fill(clr);
            this.mycolor = clr;
            noStroke();
            rect(this.x * w, this.y * h, w, h);
        }
    };

    /*Definição das cores padrão dependendo do tipo e parâmetros do nó*/
    this.show = function () {
        var r = 1;
        var g = 1;
        var b = 1;

        if(this == start || this == end){
            r = 0;
            g = 0;
            b = 0;
        }
        else if(this.wall){
            //Wall
            r = 2;
            g = 204;
            b = 204;
        }else if(this.supereasy){
            //Supereasy cell
            r = 56;
            g = 255;
            b = 66;
        }else if(this.risk > 0){
            r = (this.risk * 5) + 50;
            g = ((this.risk * 5) + 50)/2;
            b = 0;
        }
        else{
            //Normal cell
            r = 32;
            g = 255 - ((this.difficulty * 3));
            b = 0;
        }

        if(this != start && this != end){
            if(this.inClosedSet){
                r += 150;
            }
            else
            if(this.inOpenSet){
                b += 150;
                g += 150;
            }
        }


        this.mycolor =  color(r, g, b);
        fill(this.mycolor);
        noStroke();
        rect(this.x * w, this.y * h, w, h);

    };

    /*Função que gera o mapa*/
    this.setDifficulty = function (initialDif) {
        var sumAmount;

        if(allowDiagonalMovement){
            sumAmount = random(0.1, 0.7);
        }else{
            sumAmount = random(0.7);
        }

        var maxValue = floor(abs(heuristic(start, end, choosenDistanceMethod)/3));
        this.difficulty = floor(initialDif);

        var tempArr = shuffleArr(this.neighbors);

        for(var i = 0; i < tempArr.length; i++){
            if(!tempArr[i].mark && !tempArr[i].wall){
                tempArr[i].mark = true;
                tempArr[i].setDifficulty(   floor((initialDif + sumAmount) % maxValue) + 1   );

                if(this.difficulty <= 0){
                    this.difficulty = 1;
                }

                if(this.difficulty > maxValue - floor(difficultPathToWallAmount * 100)/5){
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


    this.setRisk = function (maxIterations, currentIteration) {
        var tempArr = shuffleArr(this.neighbors);
        for(var i = 0; i < tempArr.length; i++){
            if(!tempArr[i].wall && currentIteration < maxIterations){
                tempArr[i].setRisk(maxIterations, currentIteration + 1);
                this.risk = floor(random(50, heuristic(start, end)/5));
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