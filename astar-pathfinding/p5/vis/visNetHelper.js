/**
 * Created by andre on 24/05/2018.
 */

// create an array with nodes


function MyTreeNetwork() {
    this.network = undefined;
    this.nodes = new vis.DataSet([]);
    this.edges = new vis.DataSet([]);

    this.lazyNodes = new vis.DataSet([]);
    this.lazyEdges = new vis.DataSet([]);
    
    
    this.data = {
        nodes: this.nodes,
        edges: this.edges
    };

    this.options = {
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

    this.addNodeWithId = function(nodeid, nodeLabel, arrowLabel, parentId, color) {
        var level =  this.lazyNodes.get(parentId)['level'] + 1;
        if(color){
            this.lazyNodes.add({id: nodeid, label: nodeLabel, 'level': level, 'color': color});
        }else{
            this.lazyNodes.add({id: nodeid, label: nodeLabel, 'level': level});
        }
        this.lazyEdges.add({from: parentId, to: nodeid, arrows:'to', 'label': arrowLabel});
    };

    this.addFirstNodeWithId = function(nodeId, nodeLabel, color) {
        if(color){
            this.lazyNodes.add({id: nodeId, label: nodeLabel, 'level': 0, 'color': color});
        }else{
            this.lazyNodes.add({id: nodeId, label: nodeLabel, 'level': 0});
        }
    };

    this.createNetwork = function (containterID) {
        this.data = {
            nodes: this.nodes,
            edges: this.edges
        };

        console.log('Creating network!');
        var container = document.getElementById(containterID);
        this.network = new vis.Network(container, this.data, this.options);
    };

    this.commitNetwork = function () {
        this.nodes = deepcopy(this.lazyNodes);
        this.edges = deepcopy(this.lazyEdges);
    };
    


    this.deleteNetwork = function () {
        console.log('Deleting network!');
        if(this.network != undefined) {
            this.network.destroy();
        }

        this.network = undefined;
        this.nodes = new vis.DataSet([]);
        this.edges = new vis.DataSet([]);
        this.lazyEdges = new vis.DataSet([]);
        this.lazyNodes = new vis.DataSet([]);
    };

}