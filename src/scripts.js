function startVisualization() {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    const algorithm = document.getElementById('algorithm-select').value;
    const size = parseInt(document.getElementById('size-input').value);
    const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);  // Randomized array

    const grid = createGrid(10, 10);

    if (algorithm === "bubbleSort") {
        visualizeBubbleSort(array);
    } else if (algorithm === "quickSort") {
        visualizeQuickSort(array);
    } else if (algorithm === "binarySearch") {
        const target = Math.floor(Math.random() * 100) + 1;
        visualizeBinarySearch(array, target);
    } else if (algorithm === "aStar") {
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
    const barWidth = 50; // Width of each bar

    function step() {
        if (i < array.length) {
            if (j < array.length - i - 1) {
                renderArray(array, j, j + 1);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }
                j++;
            } else {
                j = 0;
                i++;
            }
            renderArray(array);
            setTimeout(step, 500);
        }
    }

    step();
}

function visualizeQuickSort(array) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

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
                renderArray(arr, i, j);
                await sleep(300);
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        renderArray(arr, i + 1, high);
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
    container.innerHTML = '';

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

function renderArray(array, highlight1 = -1, highlight2 = -1, highlight3 = -1) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    const barWidth = container.clientWidth / array.length - 10; // Adjust bar width to fit within container

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${value * 2}px`; // Adjust the scale factor for better visibility
        bar.style.width = `${barWidth}px`;
        bar.style.margin = '0 5px';
        bar.style.backgroundColor = 'blue';
        bar.style.display = 'inline-block';
        bar.style.verticalAlign = 'bottom'; // Ensure bars are aligned at the bottom

        if (index === highlight1) {
            bar.style.backgroundColor = 'red'; // Swapping elements
        } else if (index === highlight2) {
            bar.style.backgroundColor = 'yellow'; // Comparing elements
        } else if (index === highlight3) {
            bar.style.backgroundColor = 'green'; // Pivot in Quick Sort
        }

        container.appendChild(bar);
    });
}

function renderGrid(grid, openSet, closedSet) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    const cellSize = Math.min(container.clientWidth / grid[0].length, container.clientHeight / grid.length);

    grid.forEach(row => {
        row.forEach(node => {
            const cell = document.createElement('div');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
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
//2