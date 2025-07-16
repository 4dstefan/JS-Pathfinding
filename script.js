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

function getPath(target) {
    let path = []
    for (let vertex = target; vertex != -1; vertex = vertex.previous) {
        path.push(vertex);
    }
    path.reverse();
    return path;
}

function resetGraph(graph) {
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

function randomDFS(graph, start) {
    resetGraph(graph)
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
    
    let pixelSize = 8;
    
    const rect = canvas.getBoundingClientRect();
    
    let graph = createGraph(pixelSize);

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
    
    function createGraph(pixelSize) {
        let gridPixelWidth = canvas.width / pixelSize;
        let newGraph = Array(gridPixelWidth);
        for (let i = 0; i < gridPixelWidth; i++) {
            newGraph[i] = Array(gridPixelWidth)
        }
        
        for (let i = 0; i < gridPixelWidth; i++) {
            for (let j = 0; j < gridPixelWidth; j++) {
                const value = Array(2);
                value[0] = i;
                value[1] = j;
                
                const vertex = new Vertex(value);
                newGraph[i][j] = vertex;
            }
        }
        
        
        for (let i = 0; i < gridPixelWidth; i++) {
            for (let j = 0; j < gridPixelWidth; j++) {
                if (j+1 < gridPixelWidth){
                    let n1 = newGraph[i][j+1];
                    newGraph[i][j].addNeighbour(n1);
                }

                if (i+1 < gridPixelWidth) {
                    let n2 = newGraph[i+1][j];
                    newGraph[i][j].addNeighbour(n2);
                }
            }
        }

        return newGraph;
    }
    
    
    function displayCoords(e) {
        testText.innerHTML = getCellPosX(e) + " " + getCellPosY(e);

    }
    
    function resetCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        graph.forEach(row => {
            row.forEach(vertex => {
                vertex.removed = false;
            });
        });
        
        var pixelSizeInput = document.getElementById("pixelSize");
        let newPixelSize = pixelSizeInput.value
        // console.log(pixelSizeInput.value)
        
        if (newPixelSize) {
            pixelSize = newPixelSize;
            graph = createGraph(pixelSize);
        }
        pixelSizeInput.value = null;
        
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