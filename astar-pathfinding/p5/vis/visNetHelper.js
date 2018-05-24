/**
 * Created by andre on 24/05/2018.
 */

// create an array with nodes



var nodes = new vis.DataSet([
   /* {id: 1, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 0, 'color': 'rgb(255,168,7)'},
    {id: 2, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 1, 'color': 'rgb(255,168,7)'},
    {id: 3, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 1},
    {id: 4, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 1},
    {id: 5, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2, 'color': 'rgb(255,168,7)'},
    {id: 6, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 7, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 8, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 9, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 10, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 11, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 12, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2},
    {id: 13, label: 'xy(1, 2) \nf:200 \ng:1000 \nh:200', 'level': 2}*/
]);


// create an array with edges
var edges = new vis.DataSet([
    /*{from: 1, to: 2, arrows:'to', 'label': 'alabel label'},
    {from: 1, to: 3, arrows:'to', 'label': 'alabel label'},
    {from: 1, to: 4, arrows:'to', 'label': 'alabel label'},
    {from: 2, to: 5, arrows:'to', 'label': 'alabel label'},
    {from: 2, to: 6, arrows:'to', 'label': 'alabel label'},
    {from: 2, to: 7, arrows:'to', 'label': 'alabel label'},
    {from: 3, to: 8, arrows:'to', 'label': 'alabel label'},
    {from: 3, to: 9, arrows:'to', 'label': 'alabel label'},
    {from: 3, to: 10, arrows:'to', 'label': 'alabel label'},
    {from: 4, to: 11, arrows:'to', 'label': 'alabel label'},
    {from: 4, to: 12, arrows:'to', 'label': 'alabel label'},
    {from: 4, to: 13, arrows:'to', 'label': 'alabel label'}*/
]);


// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    /*width: (window.innerWidth - 25) + "px",
    height: (window.innerHeight - 75) + "px",*/
    height:(window.innerHeight + 1000) + "px",
    edges: {
        smooth: {
            type: 'cubicBezier',
            forceDirection: 'vertical',
            roundness: 0.4
        },
        arrows: {
            to: {
                scaleFactor: 1
            }
        }
    },
    layout: {
        hierarchical: {
            direction: 'UD'
        }
    },
    physics:false
};

var network = undefined;

function addNodeWithId(nodeid, nodeLabel, arrowLabel, parentId, color) {
    var level =  nodes.get(parentId)['level'] + 1;
    if(color){
        nodes.add({id: nodeid, label: nodeLabel, 'level': level, 'color': color});
    }else{
        nodes.add({id: nodeid, label: nodeLabel, 'level': level});
    }

    edges.add({from: parentId, to: nodeid, arrows:'to', 'label': arrowLabel});
}

function addFirstNodeWithId(nodeId, nodeLabel, color) {
    if(color){
        nodes.add({id: nodeId, label: nodeLabel, 'level': 0, 'color': color});
    }else{
        nodes.add({id: nodeId, label: nodeLabel, 'level': 0});
    }
}

function createNetwork(containterID) {
    // create a network
    var container = document.getElementById(containterID);
    // initialize your network!
    network = new vis.Network(container, data, options);
}
