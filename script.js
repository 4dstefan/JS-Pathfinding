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

function bfs(graph, start) {
    graph.forEach(row => {
        // reset
        row.forEach(vertex => {
            vertex.visited = false;
            vertex.previous = -1;
        });
    });
    
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

document.addEventListener('DOMContentLoaded', function() {
    
    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetCanvas, false);
    
    const testText = document.getElementById('test');
    const canvas = document.getElementById('pixelCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set initial white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set default drawing color to black
    ctx.fillStyle = 'black';
    
    // Pixel size (1x1 for true pixel art)
    const pixelSize = 8;
    
    const gridPixelWidth = canvas.width / pixelSize;
    
    // initialize graph
    let graph = Array(gridPixelWidth) // do a matrix instead
    for (let i = 0; i < gridPixelWidth; i++) {
        graph[i] = Array(gridPixelWidth)
    }
    
    for (let i = 0; i < gridPixelWidth; i++) {
        for (let j = 0; j < gridPixelWidth; j++) {
            const value = Array(2);
            value[0] = i;
            value[1] = j;
            
            const vertex = new Vertex(value);
            graph[i][j] = vertex;
        }
    }
    
    
    for (let i = 0; i < gridPixelWidth-1; i++) {
        for (let j = 0; j < gridPixelWidth-1; j++) {
            let n1 = graph[i][j+1];
            let n2 = graph[i+1][j];
            graph[i][j].addNeighbour(n1);
            graph[i][j].addNeighbour(n2);
        }
    }
    
    
    function drawPath(x, y) {
        bfs(graph, graph[0][0]);
        let path = getPath(graph[x][y]);
        path.forEach(vertex => {
            ctx.fillStyle = 'lime';
            ctx.fillRect(vertex.value[0] * pixelSize, vertex.value[1] * pixelSize, pixelSize, pixelSize);
        });
    }
    
    const rect = canvas.getBoundingClientRect();
    
    // Track mouse state
    let isDrawing = false;
    
    document.addEventListener('mousedown', displayCoords);
    
    function displayCoords(e) {
        const rect = canvas.getBoundingClientRect();
        testText.innerHTML = Math.floor((e.clientX - rect.left) / pixelSize) + " " + Math.floor((e.clientY - rect.top) / pixelSize);
    }
    
    function resetCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        graph.forEach(row => {
            row.forEach(vertex => {
                vertex.removed = false;
            });
        });
        
    }
    
    // Handle mouse down
    canvas.addEventListener('mousedown', function(e) {
        if (e.ctrlKey) {
            let x = Math.floor((e.clientX - rect.left) / pixelSize);
            let y = Math.floor((e.clientY - rect.top) / pixelSize);
            drawPath(x, y);
        }
        else if (e.altKey) {
            isDrawing = true;
            removePixel(e)
        }
        else {
            isDrawing = true;
            drawPixel(e);
        }
    });
    
    // Handle mouse move while dragging
    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing & e.altKey) {
            removePixel(e)
        }
        else if (isDrawing) {
            drawPixel(e);
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
        const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
        const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;
        
        let graphx = Math.floor((e.clientX - rect.left) / pixelSize);
        let graphy = Math.floor((e.clientY - rect.top) / pixelSize);
        
        graph[graphx][graphy].removed = false;
        
        ctx.fillStyle = 'white';
        
        // Draw the pixel
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }
    
    // Function to draw a pixel at mouse position
    function drawPixel(e) {
        // Get mouse position relative to canvas
        const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
        const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;
        
        let graphx = Math.floor((e.clientX - rect.left) / pixelSize);
        let graphy = Math.floor((e.clientY - rect.top) / pixelSize);
        
        graph[graphx][graphy].removed = true;
        
        // Toggle between black and white
        ctx.fillStyle = 'black';
        
        // Draw the pixel
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }
});