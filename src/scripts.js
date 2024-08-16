// Create an audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(value) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    
    // Define a range for the pitch
    const minFrequency = 20; // Lowest frequency (Hz)
    const maxFrequency = 200; // Highest frequency (Hz)
    
    // Scale the value to the frequency range
    const scaledValue = minFrequency + (value / 100) * (maxFrequency - minFrequency);
    
    oscillator.frequency.setValueAtTime(scaledValue, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volume

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1); // Play sound for 0.1 seconds
}

function updateAlgorithmInfo() {
    const algorithm = document.getElementById('algorithm-select').value;
    const infoContainer = document.getElementById('algorithm-info');
    let infoText = '';

    switch (algorithm) {
        case 'bubbleSort':
            infoText = 'Bubble Sort: A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.';
            break;
        case 'quickSort':
            infoText = 'Quick Sort: An efficient sorting algorithm that uses a divide-and-conquer approach to divide the list into smaller sub-lists and sort them independently.';
            break;
        case 'insertionSort':
            infoText = 'Insertion Sort: A simple sorting algorithm that builds the final sorted array one item at a time by repeatedly picking the next item and inserting it into its correct position.';
            break;
        case 'mergeSort':
            infoText = 'Merge Sort: A divide-and-conquer sorting algorithm that divides the array into halves, recursively sorts each half, and then merges the sorted halves to produce the sorted array.';
            break;
        case 'binarySearch':
            infoText = 'Binary Search: A fast search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.';
            break;
    }

    infoContainer.textContent = infoText;
}

function startVisualization() {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualization

    const algorithm = document.getElementById('algorithm-select').value;
    const size = parseInt(document.getElementById('size-input').value);
    const speed = parseInt(document.getElementById('speed-input').value);
    let array = Array.from({ length: size }, (_, index) => index + 1); // Array with values from 1 to size
    array = shuffleArray(array); // Shuffle the array to randomize positions

    // Clear the algorithm info
    updateAlgorithmInfo();

    if (algorithm === "bubbleSort") {
        visualizeBubbleSort(array, speed);
    } else if (algorithm === "quickSort") {
        visualizeQuickSort(array, speed);
    } else if (algorithm === "insertionSort") {
        visualizeInsertionSort(array, speed);
    } else if (algorithm === "mergeSort") {
        visualizeMergeSort(array, speed);
    } else if (algorithm === "binarySearch") {
        const target = Math.floor(Math.random() * size) + 1;
        visualizeBinarySearch(array, target, speed);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function visualizeBubbleSort(array, speed) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualization

    let i = 0;
    let j = 0;

    function step() {
        if (i < array.length) {
            if (j < array.length - i - 1) {
                renderArray(array, j, j + 1);
                playSound(array[j]);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }
                j++;
            } else {
                j = 0;
                i++;
            }
            renderArray(array);
            setTimeout(step, speed);
        } else {
            // Extra check for show after sorting is done
            setTimeout(() => {
                renderArray(array);
            }, speed);
        }
    }

    step();
}

function visualizeQuickSort(array, speed) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualization

    quickSort(array, 0, array.length - 1);

    async function quickSort(arr, low, high) {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        } else {
            // Extra check for show after sorting is done
            setTimeout(() => {
                renderArray(array);
            }, speed);
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
                playSound(arr[j]);
                await sleep(speed);
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        renderArray(arr, i + 1, high);
        playSound(arr[i + 1]);
        await sleep(speed);
        return (i + 1);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderArray(array);
}

function visualizeInsertionSort(array, speed) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualization

    let i = 1;
    let j;

    function step() {
        if (i < array.length) {
            let key = array[i];
            j = i - 1;

            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                renderArray(array, j, j + 1);
                playSound(array[j]);
                j--;
            }
            array[j + 1] = key;
            renderArray(array, j + 1);
            playSound(key);
            i++;
            setTimeout(step, speed);
        } else {
            // Extra check for show after sorting is done
            setTimeout(() => {
                renderArray(array);
            }, speed);
        }
    }

    step();
}

function visualizeMergeSort(array, speed) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualization

    mergeSort(array, 0, array.length - 1);

    async function mergeSort(arr, l, r) {
        if (l < r) {
            let m = Math.floor((l + r) / 2);
            await mergeSort(arr, l, m);
            await mergeSort(arr, m + 1, r);
            await merge(arr, l, m, r);
        } else {
            // Extra check for show after sorting is done
            setTimeout(() => {
                renderArray(array);
            }, speed);
        }
    }

    async function merge(arr, l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;

        let L = arr.slice(l, l + n1);
        let R = arr.slice(m + 1, m + 1 + n2);

        let i = 0;
        let j = 0;
        let k = l;

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            renderArray(arr, k);
            playSound(arr[k]);
            k++;
            await sleep(speed);
        }

        while (i < n1) {
            arr[k] = L[i];
            renderArray(arr, k);
            playSound(arr[k]);
            i++;
            k++;
            await sleep(speed);
        }

        while (j < n2) {
            arr[k] = R[j];
            renderArray(arr, k);
            playSound(arr[k]);
            j++;
            k++;
            await sleep(speed);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

function visualizeBinarySearch(array, target, speed) {
    const container = document.getElementById('visualization-container');
    container.innerHTML = ''; // Clear previous visualization

    async function binarySearch(arr, target) {
        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            renderArray(arr, left, right, mid);
            playSound(arr[mid]);
            await sleep(speed);

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

    const barWidth = container.clientWidth / array.length; // Adjust bar width to fit within container
    const maxBarHeight = container.clientHeight; // Maximum height of the bars to fit within the container

    // Find the maximum value in the array for scaling
    const maxValue = Math.max(...array);
    const heightScale = maxValue > 0 ? maxBarHeight / maxValue : 1;

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        // Scale the height of the bars to fit within the container
        const barHeight = value * heightScale;
        bar.style.height = `${barHeight}px`;
        bar.style.width = `${barWidth}px`;
        bar.style.margin = '0'; // Reduce space between bars
        bar.style.backgroundColor = 'black';
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
