let NoP = 5; // Number of Primes
const primes = [
    { n: 2, p: 3 },
    { n: 3, p: 3 },
    { n: 5, p: 2 },
    { n: 7, p: 1 },
    { n: 11, p: 1 },
    { n: 13, p: 1 },
    { n: 17, p: 1 },
    { n: 19, p: 1 },
    { n: 23, p: 1 },
    { n: 29, p: 1 }
];
let kind = 6;
let isProcessing = false;
let isAble = true;
let finish = true;
let interval = 4000;
let pArr = [];
let txt = "";
let last = 0;
let num = 1;

const question = document.getElementById('question');
const answer = document.getElementById('answer');
const button = document.getElementById('button');
const progress = document.getElementById('progress');

let setting = JSON.parse(localStorage.getItem('prime'));
if (setting != null) {
    document.getElementById('speed').value = setting[0];
    document.getElementById('speed-span').textContent = "：" + setting[0];
    interval = setting[0] * 1000;
    document.getElementById('progress').style.transition = `width ${setting[0]}s linear`;

    document.getElementById('num').value = setting[1];
    document.getElementById('num-span').textContent = "：" + setting[1];
    NoP = setting[1];

    document.getElementById('kind').value = setting[2];
    document.getElementById('kind-span').textContent = "：" + setting[2];
    kind = setting[2] - 1;
}

let sum = 0;
for (let i = 0; i < primes.length; i++) {
    sum += primes[i].p;
    primes[i].s = sum;
}

async function processLoop() {
    while (isProcessing) {
        txt = "";
        answer.innerHTML = "&#x00A0";
        //前回と同じ数が出たら繰り返す
        do {
            pArr = [];
            num = 1;
            for (let i = 0; i < NoP; i++) {
                let rand = Math.floor(Math.random() * primes[kind].s);
                let j = 0;
                for (j = 0; j < primes.length; j++) {
                    rand -= primes[j].p;
                    if (rand < 0) break;
                }
                num *= primes[j].n;
                pArr.push(primes[j].n);
            }
        } while (last == num)
        pArr.sort((a, b) => a - b);
        last = num;

        question.textContent = num;
        progress.style.transition = `width ${interval / 1000}s linear`;
        progress.style.width = '100%';
        await new Promise(resolve => setTimeout(resolve, interval));
        for (let i = 0; i < pArr.length; i++) {
            txt += String(pArr[i]);
            if (i != pArr.length - 1) {
                txt += " × ";
            }
        }
        answer.textContent = txt;
        progress.style.transition = `width 5s linear`;
        progress.style.width = '0%';
        progress.classList.add('back');

        await new Promise(resolve => setTimeout(resolve, 5000));
        progress.classList.remove('back');
        if (!isAble) break;
    }
    question.innerHTML = "&#x00A0";
    answer.innerHTML = "&#x00A0";
    progress.style.transition = 'none';
    progress.style.width = '0%';
    progress.classList.remove('back');
    button.textContent = 'スタート';
    finish = true;
}

button.addEventListener('click', () => {
    isProcessing = !isProcessing;
    button.classList.toggle('process');
    button.textContent = isProcessing ? '終わる' : 'スタート';

    if (isProcessing) {
        isAble = true;
        if (finish) {
            finish = false;
            processLoop(); // 非同期処理開始
        }
    } else {
        isAble = false;
        if (finish == false) {
            button.textContent = '再開';
        }
    }

});


document.getElementById('speed').addEventListener('input', () => {
    const data = document.getElementById('speed').value;
    interval = data * 1000;
    document.getElementById('progress').style.transition = `width ${data}s linear`;
    document.getElementById('speed-span').textContent = "：" + String(data);
    saveData();
});
document.getElementById('num').addEventListener('input', () => {
    const data = document.getElementById('num').value;
    NoP = data;
    document.getElementById('num-span').textContent = "：" + String(data);
    saveData();
});
document.getElementById('kind').addEventListener('input', () => {
    const data = document.getElementById('kind').value;
    kind = data - 1;
    document.getElementById('kind-span').textContent = "：" + String(data);
    saveData();
});

function saveData() {
    setting = [document.getElementById('speed').value, document.getElementById('num').value, document.getElementById('kind').value];
    localStorage.setItem('prime', JSON.stringify(setting));
}