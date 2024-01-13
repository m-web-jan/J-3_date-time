var audioAlert = new Audio('sound.mp3');
let workTime = 25;
let brakeTime = 5;

let workInput = document.getElementsByTagName('input')[0];
let brakeInput = document.getElementsByTagName('input')[1];
let timer = document.getElementById('time');

let saveBtn = document.getElementsByTagName('button')[0];
let startBtn = document.getElementsByTagName('button')[1];
let stopBtn = document.getElementsByTagName('button')[2];


function save() {
    if (!parseInt(workInput.value) || !parseInt(brakeInput.value)) {
        alert('Введите вермя интервалов');
        return;
    };
    workTime = parseInt(workInput.value);
    brakeTime = parseInt(brakeInput.value);
    workInput.value = '';
    brakeInput.value = '';
    timer.innerText = (workTime<10?'0'+workTime:workTime)+':00';
}

window.intervalIds = [];
let timerEnd = new Date();

function start() {
    saveBtn.classList.add('disabled');
    saveBtn.onclick = '';
    brakeEnd = false;
    var timerId = setInterval(countDown, 1000);
    window.intervalIds.push(timerId);
    timerEnd = new Date();
    timerEnd.setMinutes(timerEnd.getMinutes() + workTime);
}

let brakeEnd = false;
function countDown() {
    startBtn.innerText = 'Пауза';
    diff = timerEnd - new Date();
    let m = Math.floor(diff / 1000 / 60) % 60;
    let s = Math.floor(diff / 1000) % 60 + 1;
    m = m < 10 ? '0' + m : m;
    s  = s < 10 ? '0' + s : s;
    timer.innerText = m+':'+s;
    if (diff < 1000) {
        audioAlert.play();
        clear();
        timer.innerText = (brakeTime < 10 ? '0' + brakeTime : brakeTime) +':00';
        startBrake();
        return;
    }
    startBtn.onclick = pause;
}

function startBrake() {
    if (brakeEnd) {
        stop();
        document.body.classList.remove('brake');
        return;
    }
    document.body.classList.add('brake');
    var timerId = setInterval(countDown, 1000);
    window.intervalIds.push(timerId);
    timerEnd = new Date();
    timerEnd.setMinutes(timerEnd.getMinutes() + brakeTime);
    brakeEnd = true;
}

let left;
function pause() {
    startBtn.innerText = 'Продолжить';
    clear();
    startBtn.onclick = cont;
    left = timerEnd - new Date();
}
function cont() {
    startBtn.innerText = 'Пауза';
    var timerId = setInterval(countDown, 1000);
    window.intervalIds.push(timerId);
    timerEnd = new Date();
    timerEnd.setMinutes(timerEnd.getMinutes() + Math.floor(left / 1000 / 60) % 60);
    timerEnd.setSeconds(timerEnd.getSeconds() + (Math.floor(left / 1000) % 60) + 1);
    startBtn.onclick = pause;
}

function stop() {
    startBtn.innerText = 'Старт';
    clear();
    timer.innerText = (workTime<10?'0'+workTime:workTime)+':'+'00';
    startBtn.onclick = start;
    saveBtn.classList.remove('disabled');
    saveBtn.onclick = save;
}

function clear() {
    for (let i = 0; i < window.intervalIds.length; i++) {
        clearInterval(window.intervalIds[i]);
    }
}

saveBtn.onclick = save;
startBtn.onclick = start;
stopBtn.onclick = stop;