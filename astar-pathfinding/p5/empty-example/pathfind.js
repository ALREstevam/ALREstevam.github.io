/**
 * Created by andre on 23/05/2018.
 */

function pathfindStep() {
    stepsCount ++;
    if(openSet.length > 0){
        //BUSCANDO

        var lowestIndex = 0;
        //Encontrando o nó com menor custo (f)
        var i;
        var opensetLen = openSet.length;
        
        for(i = 0; i < opensetLen; i++){
            if(openSet[i].f < openSet[lowestIndex].f){
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];

        //Caso tenha chegado ao fim
        if(current === end){
            runStatus.html('<strong>Status: </strong> path finded.');
            console.log("DONE!");
            execute = false;

            path = [];
            var temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }

            return;
        }
        
        removeFromArray(openSet, current);
        closeSet.push(current);
        current.inClosedSet = true;

        //Cálculo da heurística e definição do caminho
        var neighbors = current.neighbors;
        var neighborsLen = neighbors.length;

        //Testando para cada vizinho do nó aberto
        for(i = 0; i < neighborsLen; i++){
            var neighbour = neighbors[i];//shortcut
            var newPath = false;//Existe um novo caminho?

            //Caso o vizinho em questão não esteja fechado e não seja uma barreira
            if(!closeSet.includes(neighbour) && !neighbour.wall){
                //Cálculo de um g(n) temporário
                //var tempg = 1 + current.g + neighbour.difficulty + neighbour.risk;
                var tempg = 1 + current.g +  (yWeight * neighbour.difficulty) + (zWeight * neighbour.risk);


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
                    neighbour.h = xWeight * heuristic(neighbour, end, choosenDistanceMethod);
                    neighbour.f = (wWeight * neighbour.g) + neighbour.h;
                    neighbour.previous = current;
                }

                var clr = (neighbour == end)? '#ffc107': formatNetElemColor(neighbour);
                treeNet.addNodeWithId(formatNetElemId(neighbour), formatNetElemText(neighbour), formatArrowText(neighbour), getIdFrom(current), clr);
            }


        }

        //Definindo variáveis para desenhar o caminho atual
        path = [];
        var temp = current;
        path.push(temp);
        while(temp.previous){
            path.push(temp.previous);
            temp = temp.previous;
        }

    }else{
        //NÃO EXISTE SOLUÇÃO
        console.log('No solution');
        runStatus.html('<strong>Status: </strong> no solution.');
        execute = false;
        return;
    }
}
