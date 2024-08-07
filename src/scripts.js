function startVisualization() {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    const algorithm = document.getElementById('algorithm-select').value;

    if (algorithm === "bubbleSort") {
        const array = [5, 3, 8, 4, 2];
        visualizeBubbleSort(array);
    } else if (algorithm === "quickSort") {
        const array = [5, 3, 8, 4, 2];
        visualizeQuickSort(array);
    } else if (algorithm === "binarySearch") {
        const array = [2, 3, 4, 5, 8];
        const target = 4;
        visualizeBinarySearch(array, target);
    } else if (algorithm === "aStar") {
        const grid = createGrid(10, 10);
        grid[0][0].isStart = true;
        grid[9][9].isEnd = true;
        visualizeAStar(grid);
    }
}

function visualizeBubbleSort(array) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    let i = 0;
    let j = 0;

    function step() {
        if (i < array.length) {
            if (j < array.length - i - 1) {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }
                j++;
            } else {
                j = 0;
                i++;
            }
            renderArray(array);
            setTimeout(step, 100);
        }
    }

    step();
}

function visualizeQuickSort(array) {
    const container = document.getElementById('visualization-container');
    
    quickSort(array, 0, array.length - 1);

    async function quickSort(arr, low, high) {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
    }

    async function partition(arr, low, high) {
        let pivot = arr[high];
        let i = (low - 1);

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                renderArray(arr);
                await sleep(300);
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        renderArray(arr);
        await sleep(300);
        return (i + 1);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderArray(array);
}

function visualizeBinarySearch(array, target) {
    const container = document.getElementById('visualization-container');
    
    async function binarySearch(arr, target) {
        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            renderArray(arr, left, right, mid);
            await sleep(1000);

            if (arr[mid] === target) {
                alert(`Element found at index ${mid}`);
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        alert("Element not found");
        return -1;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    binarySearch(array, target);
}

function renderArray(array, left = -1, right = -1, mid = -1) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${value * 20}px`;
        bar.style.width = '20px';
        bar.style.margin = '0 5px';
        bar.style.backgroundColor = 'blue';

        if (index === mid) {
            bar.style.backgroundColor = 'red';
        } else if (index >= left && index <= right) {
            bar.style.backgroundColor = 'yellow';
        }

        container.appendChild(bar);
    });
}

function visualizeAStar(grid) {
    const container = document.getElementById('visualization-container');
    
    const startNode = grid[0][0];
    const endNode = grid[grid.length - 1][grid[0].length - 1];
    
    async function aStar(start, end) {
        start.g = 0;
        start.h = heuristic(start, end);
        start.f = start.g + start.h;

        let openSet = [start];
        let closedSet = [];

        while (openSet.length > 0) {
            let current = openSet.pop();

            if (current === end) {
                alert("Path found!");
                return;
            }

            closedSet.push(current);
            renderGrid(grid, openSet, closedSet);

            await sleep(500);

            let neighbors = getNeighbors(current, grid);
            for (let neighbor of neighbors) {
                if (closedSet.includes(neighbor)) {
                    continue;
                }

                let tentative_g = current.g + 1;

                if (!openSet.includes(neighbor) || tentative_g < neighbor.g) {
                    neighbor.g = tentative_g;
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        alert("No path found");
    }

    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    function getNeighbors(node, grid) {
        let neighbors = [];
        let { x, y } = node;

        if (x > 0) neighbors.push(grid[x - 1][y]);
        if (x < grid.length - 1) neighbors.push(grid[x + 1][y]);
        if (y > 0) neighbors.push(grid[x][y - 1]);
        if (y < grid[0].length - 1) neighbors.push(grid[x][y + 1]);

        return neighbors;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    aStar(startNode, endNode);
}

function renderGrid(grid, openSet, closedSet) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    grid.forEach(row => {
        row.forEach(node => {
            const cell = document.createElement('div');
            cell.style.width = '20px';
            cell.style.height = '20px';
            cell.style.margin = '1px';
            cell.style.display = 'inline-block';
            cell.style.backgroundColor = 'white';

            if (closedSet.includes(node)) {
                cell.style.backgroundColor = 'red';
            } else if (openSet.includes(node)) {
                cell.style.backgroundColor = 'green';
            } else if (node.isStart) {
                cell.style.backgroundColor = 'blue';
            } else if (node.isEnd) {
                cell.style.backgroundColor = 'yellow';
            }

            container.appendChild(cell);
        });
        const br = document.createElement('br');
        container.appendChild(br);
    });
}

function createGrid(rows, cols) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push({ x: i, y: j, isStart: false, isEnd: false });
        }
        grid.push(row);
    }
    return grid;
}
