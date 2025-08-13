class Vertex {
    
    constructor(value) {
        this.value = value;
        this.visited = false;
        this.neighbours = []
        this.previous = -1;
        this.removed = false;
    }
    
    addNeighbour(vertex) {
        try {
            this.neighbours.push(vertex);
            vertex.neighbours.push(this);
        } catch (error) {
            
        }
    }
    
    getNeighbours() {
        return this.neighbours;
    }
}

function createGraph(gridCellsWidth) {
    let newGraph = Array(gridCellsWidth);
    for (let i = 0; i < gridCellsWidth; i++) {
        newGraph[i] = Array(gridCellsWidth)
    }
    
    for (let i = 0; i < gridCellsWidth; i++) {
        for (let j = 0; j < gridCellsWidth; j++) {
            const value = Array(2);
            value[0] = i;
            value[1] = j;
            
            const vertex = new Vertex(value);
            newGraph[i][j] = vertex;
        }
    }
    
    
    for (let i = 0; i < gridCellsWidth; i++) {
        for (let j = 0; j < gridCellsWidth; j++) {
            if (j+1 < gridCellsWidth){
                let n1 = newGraph[i][j+1];
                newGraph[i][j].addNeighbour(n1);
            }
            
            if (i+1 < gridCellsWidth) {
                let n2 = newGraph[i+1][j];
                newGraph[i][j].addNeighbour(n2);
            }
        }
    }
    
    return newGraph;
}

function reduceGraph(graph){
    // reduced size to account for the fact that half of cells will be walls
    // graph node maps on to every other pixel cell (probably?)
    width = Math.floor(graph.length / 2)
    
    return createGraph(width);
}

function convertNodePosition(posArray) {
    let x = (posArray[0]+1)*2 - 1;
    let y = (posArray[1]+1)*2 - 1;

    return [x,y];
}

function getPath(target) {
    let path = []
    for (let vertex = target; vertex != -1; vertex = vertex.previous) {
        path.push(vertex);
    }
    path.reverse();
    return path;
}

function resetGraph(graph, walls=false) {
    graph.forEach(row => {
        row.forEach(vertex => {
            vertex.visited = false;
            vertex.previous = -1;
        });
    });
}



function bfs(graph, start) {
    resetGraph(graph)
    
    let queue = [];
    
    start.visited = true;
    queue.push(start);
    
    let path = [];
    
    while (queue.length != 0) {
        let current = queue.shift();
        path.push(current)
        
        current.getNeighbours().forEach(neighbour => {
            if ((!neighbour.visited) & (!neighbour.removed)) {
                neighbour.visited = true;
                neighbour.previous = current;
                queue.push(neighbour)
            }
        });
    }
    return path
}

function getUnvisitedNeighbours(vertex) { //possibly useless
    let unvisitedNeighboursArray = [];
    vertex.getNeighbours().forEach(neighbour => {
        if (!neighbour.visited) {
            unvisitedNeighboursArray.push(neighbour);
        }
    });
    
    return unvisitedNeighboursArray;
}

function touched(targetVertex, exceptionVertex) {
    targetVertex.getNeighbours().forEach(neighbour => {
        if (neighbour.visited && (neighbour !== exceptionVertex)){
            return true;
        }
    });
    return false;
}

function getUntouchedNeighbours(vertex) {
    let untouchedNeighboursArray = []
    vertex.getNeighbours().forEach(neighbour => {
        if (!touched(neighbour, vertex)) {
            untouchedNeighboursArray.push(neighbour);
        }
    });
    return untouchedNeighboursArray;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function specialVisit(graph, vertex) { //possibly useless
    vertex.visited = true;
    try {
        graph[vertex.value[0]+1][vertex.value[1]].visited = true;
    } catch (error) { }
    try {
        graph[vertex.value[0]-1][vertex.value[1]].visited = true;
    } catch (error) { }
    try {
        graph[vertex.value[0]][vertex.value[1]+1].visited = true;
    } catch (error) { }
    try {
        graph[vertex.value[0]][vertex.value[1]-1].visited = true;
    } catch (error) { }
}

function randomDFS(graph, start) {
    resetGraph(graph);

    let stack = [];
    
    start.visited = true;
    stack.push(start);

    let path = [];

    while (stack.length != 0) {
        let current = stack.pop();

        let unvisitedNeighbours = getUnvisitedNeighbours(current);
        if (unvisitedNeighbours.length > 0) {
            stack.push(current);
            randNeighbour = unvisitedNeighbours[getRandomInt(0, unvisitedNeighbours.length-1)]
            path.push(current)
            path.push(randNeighbour)
            randNeighbour.visited = true;
            randNeighbour.previous = current;
            stack.push(randNeighbour);
        }
    }

    return path;
}

function expandedPath(graph, reducedPath) {
    let path = [];
    reducedPath.forEach(vertex => {
        let newValue = convertNodePosition(vertex.value);
        let newVertex = graph[newValue[0]][newValue[1]];
        if (vertex.previous != -1) {
            let newPrevNode = convertNodePosition(vertex.previous.value);
            newVertex.previous = graph[newPrevNode[0]][newPrevNode[1]];
        }
        path.push(newVertex);
    });
    return path;
}

function getAllBetweenPositions(graph, vertexPath) {
    let path = [];
    vertexPath.forEach(vertex => {
        path.push(vertex);
        if (vertex.previous != -1) {
            // somehow include previous. previous is always -1
            betweenPos = getValueBetween(vertex, vertex.previous);
            path.push(graph[betweenPos[0]][betweenPos[1]]);
            path.push(vertex.previous);
        }
    });
    return path;
}

function getValueBetween(vertex1, vertex2) {
    let x = (vertex1.value[0] + vertex2.value[0]) / 2
    let y = (vertex1.value[1] + vertex2.value[1]) / 2

    return [x, y]
}

document.addEventListener('DOMContentLoaded', function() {
    
    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetCanvas, false);
    
    const testText = document.getElementById('test');
    const canvas = document.getElementById('pixelCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    
    let pixelSize = 10;
    
    const rect = canvas.getBoundingClientRect();
    
    let graph = createGraph(canvas.width / pixelSize);
    
    let reducedGraph = reduceGraph(graph);

    let reducedPathTree = randomDFS(reducedGraph, reducedGraph[0][0])

    console.log(reducedPathTree);

    pathTree = expandedPath(graph, reducedPathTree);
    filledPathTree = getAllBetweenPositions(graph, pathTree);
    console.log(filledPathTree);


    filledPathTree.forEach(vertex => {
        addWall(vertex.value[0], vertex.value[1])
    });
    
    let isDrawing = false;
    
    document.addEventListener('mousedown', displayCoords);
    
    
    function drawPath(x, y) {
        bfs(graph, graph[0][0]);
        let path = getPath(graph[x][y]);
        path.forEach(vertex => {
            ctx.fillStyle = 'lime';
            ctx.fillRect(vertex.value[0] * pixelSize, vertex.value[1] * pixelSize, pixelSize, pixelSize);
        });
    }
    
    
    
    
    function resetCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        resetGraph(graph);
        
        var pixelSizeInput = document.getElementById("pixelSize");
        let newPixelSize = pixelSizeInput.value
        
        if (newPixelSize) {
            pixelSize = newPixelSize;
            graph = createGraph(canvas.width / pixelSize);
        }
        pixelSizeInput.value = null;
        
    }
    
    
    function displayCoords(e) {
        testText.innerHTML = getCellPosX(e) + " " + getCellPosY(e);
        
    }
    
    
    canvas.addEventListener('mousedown', function(e) {
        if (e.ctrlKey) {
            let x = getCellPosX(e);
            let y = getCellPosY(e);
            drawPath(x, y);
        }
        else if (e.altKey) {
            isDrawing = true;
            removePixelAtMouse(e)
        }
        else {
            isDrawing = true;
            drawWallAtMouse(e);
        }
    });
    
    // Handle mouse move while dragging
    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing & e.altKey) {
            removePixelAtMouse(e)
        }
        else if (isDrawing) {
            drawWallAtMouse(e);
        }
    });
    
    // Handle mouse up (stop drawing)
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });
    
    // Handle mouse leaving canvas
    canvas.addEventListener('mouseleave', function() {
        isDrawing = false;
    });
    
    function removePixelAtMouse(e) {
        const cellPositionX = getCellPosX(e);
        const cellPositionY =  getCellPosY(e);
        
        removePixel(cellPositionX, cellPositionY);
    }

    function removePixel(x, y) { //change name to wall
        graph[x][y].removed = false;
        
        ctx.fillStyle = 'white';
        
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
    
    function getCellPosX(e) {
        return Math.floor((e.clientX - rect.left) / pixelSize);
    }
    
    function getCellPosY(e) {
        return Math.floor((e.clientY - rect.top) / pixelSize);
    }
    
    function addWall(x, y) {
        graph[x][y].removed = true;
        
        ctx.fillStyle = 'black';
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
    
    function drawWallAtMouse(e) {
        const cellPositionX = getCellPosX(e);
        const cellPositionY =  getCellPosY(e);
        
        addWall(cellPositionX, cellPositionY);
        
    }
});