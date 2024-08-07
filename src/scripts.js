function startVisualization() {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    // Example of a simple visualization (bubble sort)
    const array = [5, 3, 8, 4, 2];
    visualizeBubbleSort(array);
}

function visualizeBubbleSort(array) {
    const container = document.getElementById('visualization-container');
    
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

function renderArray(array) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = '';

    array.forEach(value => {
        const bar = document.createElement('div');
        bar.style.height = `${value * 20}px`;
        bar.style.width = '20px';
        bar.style.margin = '0 5px';
        bar.style.backgroundColor = 'blue';
        container.appendChild(bar);
    });
}
