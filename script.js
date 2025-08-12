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

function convertedGraph(graph){
    width = graph.length

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
    resetGraph(graph); // you have to make it all walls

    let stack = [];
    
    start.visited = true;
    stack.push(start);

    let path = [];

    while (stack.length != 0) {
        let current = stack.pop();

        let untouchedNeighbours = getUntouchedNeighbours(current); // all show as visited idk
        if (untouchedNeighbours.length > 0) {
            stack.push(current);
            randNeighbour = untouchedNeighbours[getRandomInt(0, untouchedNeighbours.length-1)]
            path.push(current);
            path.push(randNeighbour);
            console.log(randNeighbour.value)
            randNeighbour.visited = true;
            stack.push(randNeighbour);
        }
    }

    return path;
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
    
    let pixelSize = 20;
    
    const rect = canvas.getBoundingClientRect();
    
    // let graph = createGraph(pixelSize);
    let graph = createGraph(canvas.width / pixelSize);


    // mazeWalls = randomDFS(graph, graph[1][1]);
    // console.log(mazeWalls);

    // mazeWalls.forEach(cell => {
    //     addWall(cell.value[0], cell.value[1])
    // }); // FIX THIS LATER. SHOULD NOT BE WALLS, BUT PATH

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
            removePixel(e)
        }
        else {
            isDrawing = true;
            drawWallAtMouse(e);
        }
    });
    
    // Handle mouse move while dragging
    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing & e.altKey) {
            removePixel(e)
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
    
    function removePixel(e) {
        const x = getCellPosX(e) * pixelSize;
        const y = getCellPosY(e) * pixelSize;
        
        let graphx = getCellPosX(e);
        let graphy = getCellPosY(e);
        
        graph[graphx][graphy].removed = false;
        
        ctx.fillStyle = 'white';
        
        ctx.fillRect(x, y, pixelSize, pixelSize);
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