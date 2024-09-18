// Existing variables
let template = [];
let isFCFS = true;
let isSJF = false;
let multiplicador = 1;
let lengthProcess = 5;
let isCreate = false;
let isRunning = false;
let isPaused = false;
let processInterval;
let isNewTemplate = false;
let currentIndex = 0;
let isResetting = false;

// Existing event listeners
document.getElementById('algorithm').addEventListener('change', (event) => {
    const selectedAlgorithm = event.target.value;
    isFCFS = selectedAlgorithm === 'FCFS';
    isSJF = selectedAlgorithm === 'SJF';
});

document.getElementById('start-button').addEventListener('click', async () => {
    if (isRunning) {
        if (isPaused) {
            resumeProcessing();
            document.getElementById('start-button').textContent = 'Pause';
        } else {
            pauseProcessing();
            document.getElementById('start-button').textContent = 'Resume';
        }
    } else {
        if (!isCreate) {
            generateTemplate();
        } else if (isNewTemplate) {
            isNewTemplate = false;
            renderTable();
        }
        clearLog();
        isRunning = true;
        isPaused = false;
        document.getElementById('start-button').textContent = 'Pause';
        await solveProblem();
    }
});

document.getElementById('generate-processes').addEventListener('click', () => {
    lengthProcess = document.getElementById('num-processes').value;
    const min = 1
    const max = 1000

    if(lengthProcess < min){
        lengthProcess = 5
    }

    if(lengthProcess > max){
        lengthProcess = max
    }

    document.getElementById("num-processes").value = lengthProcess

    if (isRunning) {
        pauseProcessing();
        isNewTemplate = true;
        document.getElementById('start-button').textContent = 'Start';
    } else {
        generateTemplate();
    }
});

document.getElementById('num-velocity').addEventListener('input', (event) => {
    const min = 1;
    const max = 10;

    if (event.target.value > max) {
        event.target.value = max;
    }

    multiplicador = Number(event.target.value) == 0 ? 1 : Number(event.target.value);
    console.log(multiplicador);
});

document.getElementById('reset-button').addEventListener('click', () => {
    isResetting = true;
    
    if (isRunning) {
        isRunning = false;
        pauseProcessing();
        clearInterval(processInterval);
        logProgress('Processing stopped and reset.');
    }

    template = [];
    isCreate = false;
    isNewTemplate = false;
    currentIndex = 0;
    
    renderTable();
    clearLog();

    document.getElementById('start-button').textContent = 'Start';
    
    setTimeout(() => {
        isResetting = false;
    }, 100);
});

function orderBy(arr, key) {
    return arr.sort((a, b) => {
        const valueA = a.colums.find(col => col.key === key).value;
        const valueB = b.colums.find(col => col.key === key).value;
        return valueA - valueB;
    });
}

function generateTemplate() {
    template = Array.from({ length: lengthProcess }, (_, i) => ({
        process: `P${i + 1}`,
        colums: [
            { key: "at", value: getRandomNumber() },
            { key: "bt", value: getRandomNumber() },
            { key: "ct", value: 0 },
            { key: "tat", value: 0 },
            { key: "wt", value: 0 }
        ]
    }));

    isCreate = true;
    if (isRunning) {
        pauseProcessing();
    } else {
        renderTable();
    }
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkReset = setInterval(() => {
            if (isResetting) {
                clearInterval(checkReset);
                reject(new Error('Reset requested'));
            } else if (Date.now() - startTime >= ms / multiplicador) {
                clearInterval(checkReset);
                resolve();
            }
        }, 100);
    });
}

async function solveProblem() {
    template.forEach(item => {
        item.colums.forEach(colum => {
            if (colum.key === 'ct' || colum.key === 'tat' || colum.key === 'wt') {
                colum.value = 0;
            }
        });
    });

    if (isFCFS) {
        orderBy(template, "at");
        renderTable();
        await executeFCFS();
    } else if (isSJF) {
        await executeSJF();
    }
}

async function executeFCFS() {
    let ctAcumulate = 0;

    for (const item of template) {
        if (isResetting) return;
        if (!isRunning) break;
        if (isPaused) {
            await pauseHandler();
        }

        const at = item.colums.find(col => col.key === "at");
        const bt = item.colums.find(col => col.key === "bt");
        const ct = item.colums.find(col => col.key === "ct");
        const tat = item.colums.find(col => col.key === "tat");
        const wt = item.colums.find(col => col.key === "wt");

        logProgress(`Processing ${item.process}: Waiting for ${bt.value} seconds`);
        try {
            await delay(bt.value * 1000);
        } catch (error) {
            if (error.message === 'Reset requested') {
                logProgress('Reset requested. Stopping execution.');
                return;
            }
        }

        if (isResetting) return;

        ct.value = Number(ct.value) + Number(bt.value) + ctAcumulate;
        tat.value = Math.abs(ct.value - at.value);
        wt.value = Math.abs(tat.value - bt.value);
        ctAcumulate = ct.value;

        renderTable();
    }

    logProgress('All processes have been completed');
    isRunning = false;
    document.getElementById('start-button').textContent = 'Start';

    renderTable();
}

async function executeSJF() {
    let time = 0;
    let remainingProcesses = [...template];

    while (remainingProcesses.length > 0) {
        if (isResetting) return;
        if (!isRunning) break;
        if (isPaused) {
            await pauseHandler();
        }

        let readyProcesses = remainingProcesses.filter(item => {
            const at = item.colums.find(col => col.key === "at").value;
            return at <= time;
        });

        if (readyProcesses.length > 0) {
            readyProcesses.sort((a, b) => {
                const btA = a.colums.find(col => col.key === "bt").value;
                const btB = b.colums.find(col => col.key === "bt").value;
                return btA - btB;
            });

            const currentProcess = readyProcesses[0];
            const at = currentProcess.colums.find(col => col.key === "at").value;
            const bt = currentProcess.colums.find(col => col.key === "bt");
            const ct = currentProcess.colums.find(col => col.key === "ct");
            const tat = currentProcess.colums.find(col => col.key === "tat");
            const wt = currentProcess.colums.find(col => col.key === "wt");

            logProgress(`Processing ${currentProcess.process}: Waiting for ${bt.value} seconds`);
            try {
                await delay(bt.value * 1000);
            } catch (error) {
                if (error.message === 'Reset requested') {
                    logProgress('Reset requested. Stopping execution.');
                    return;
                }
            }

            if (isResetting) return;

            ct.value = time + bt.value;
            tat.value = ct.value - at;
            wt.value = tat.value - bt.value;
            time = ct.value;

            remainingProcesses = remainingProcesses.filter(item => item !== currentProcess);

            renderTable();
        } else {
            time++;
        }
    }

    logProgress('All processes have been completed');
    isRunning = false;
    document.getElementById('start-button').textContent = 'Start';

    renderTable();
}

function pauseProcessing() {
    isPaused = true;
    clearInterval(processInterval);
}

async function pauseHandler() {
    logProgress('Processing paused, waiting to resume...');
    return new Promise(resolve => {
        const checkResume = setInterval(() => {
            if (!isPaused) {
                clearInterval(checkResume);
                resolve();
            }
        }, 100);
    });
}

function resumeProcessing() {
    isPaused = false;
    processInterval = setInterval(async () => {
        if (isResetting) {
            clearInterval(processInterval);
            return;
        }

        if (isPaused) {
            clearInterval(processInterval);
            return;
        }

        if (currentIndex < template.length) {
            const item = template[currentIndex];
            logProgress(`Processing ${item.process}`);
            await delay(item.colums.find(col => col.key === "bt").value * 1000);
            currentIndex++;
            renderTable();
        } else {
            clearInterval(processInterval);
            logProgress('All processes have been completed');
        }
    }, 1000);
}

function renderTable() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    template.forEach(item => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-200";

        const thProcess = document.createElement("th");
        thProcess.className = "border-2 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider";
        thProcess.textContent = item.process;
        tr.appendChild(thProcess);

        item.colums.forEach(colum => {
            const th = document.createElement("th");
            th.className = "border-2 hover:bg-gray-100 cursor-pointer px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider";
            th.style.position = 'relative';
            th.setAttribute('data-key', colum.key);
            th.setAttribute('data-value', colum.value);
            th.setAttribute('data-process', item.process);
            th.textContent = colum.value;

            const input = document.createElement('input');
            input.style.position = 'absolute';
            input.style.top = '0';
            input.style.left = '0';
            input.style.width = '100%';
            input.style.height = '100%';
            input.type = 'number';  // Allow only numbers
            input.value = colum.value;
            input.className = 'abosolute top-0 left-0 p-1 border border-gray-300 rounded text-center outline-blue-400';

            // Make cell editable on double-click
            th.addEventListener('dblclick', () => {
                th.appendChild(input);
                input.focus();

                input.addEventListener('blur', () => {
                    colum.value = input.value;
                    th.textContent = input.value;
                    input.remove();
                });

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        colum.value = input.value;
                        th.textContent = input.value;
                        input.remove();
                    }
                });
            });

            tr.appendChild(th);
        });

        tbody.appendChild(tr);
    });
}

function logProgress(message) {
    const log = document.getElementById('log');
    log.textContent += message + '\n';
}

function clearLog() {
    document.getElementById('log').textContent = '';
}
