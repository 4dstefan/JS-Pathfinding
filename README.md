## 2D Pathfinding (Work in progress)

`Left Click`: Add wall

`Alt + Left Click`: Remove wall

`Ctrl + Left Click`: Find path from top left using breadth-first-search

Inputting a custom cell size will only work if the size of the canvas is divisible by your number so tbh don't bother unless you do the math

### Maze Generation:
Click `Create Maze` button to generate maze walls. You can then use the pathfinding functionality outlined above to find a path from the top left to wherever you choose.

Implemented using [randomized depth-first-search algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_implementation_(with_stack))

Will try to implement different maze generation algorithms later
