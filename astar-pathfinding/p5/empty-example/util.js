/**
 * Created by andre on 23/05/2018.
 */
/*Função que embaralha os elementos de um vetor*/
function shuffleArr(a) {
    var aLen = a.length;
    for (var i = aLen - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function openHeuristicModal() {
    document.getElementById('id01').style.display='block';
}

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


//Encontrando o nó com menor custo (f)
function getLowerFIndex(arr){
    var lowestIndex = 0;
    var i;
    var opensetLen = arr.length;

    for(i = 0; i < opensetLen; i++){
        if(arr[i].f < arr[lowestIndex].f){
            lowestIndex = i;
        }
    }
    return lowestIndex;
}

function swapSets(node, fromSet, toSet, closed){

    removeFromArray(fromSet, node);
    closeSet.push(toSet);

    if(closed){
        node.inClosedSet = true;
    }else{
        node.inClosedSet = false;
    }
}


function getCurrentPath(node){
    var localpath = [];
    var temp = node;
    localpath.push(node);
    while(temp.previous){
        localpath.push(temp.previous);
        temp = temp.previous;
    }
    return localpath;
}
