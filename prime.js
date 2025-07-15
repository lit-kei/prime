const NoP = 6; // Number of Primes
const primes = [
    { n: 2, p: 3 },
    { n: 3, p: 3 },
    { n: 5, p: 1 },
    { n: 7, p: 1 },
    { n: 11, p: 1 }
];

let isProcessing = false;
let sum = primes.reduce((acc, prime) => acc + prime.p, 0);
let interval = 4000;
let pArr = [];
let txt = "";

const question = document.getElementById('question');
const answer = document.getElementById('answer');
const button = document.getElementById('button');
const progress = document.getElementById('progress');

async function processLoop() {
    while (isProcessing) {
        let num = 1;
        pArr = [];
        txt = "";
        answer.innerHTML = "&#x00A0";

        for (let i = 0; i < NoP; i++) {
            let rand = Math.floor(Math.random() * sum);
            let j = 0;
            for (j = 0; j < primes.length; j++) {
                rand -= primes[j].p;
                if (rand < 0) break;
            }
            num *= primes[j].n;
            pArr.push(primes[j].n);
        }
        pArr.sort((a, b) => a - b);

        question.textContent = num;
        document.getElementById('progress').style.transition = `width ${interval / 1000}s linear`;
        progress.style.width = '100%';
        await new Promise(resolve => setTimeout(resolve, interval));
        for (let i = 0; i < pArr.length; i++) {
            txt += String(pArr[i]);
            if (i != pArr.length - 1) {
                txt += " × ";
            }
        }
        answer.textContent = txt;
        document.getElementById('progress').style.transition = `width 5s linear`;
        progress.style.width = '0%';
        progress.classList.add('back');

        await new Promise(resolve => setTimeout(resolve, 5000));
        progress.classList.remove('back');

    }
}

button.addEventListener('click', () => {
    isProcessing = !isProcessing;
    button.classList.toggle('process');
    button.textContent = isProcessing ? 'ストップ' : 'スタート';

    if (isProcessing) {
        processLoop(); // 非同期処理開始
    }
});


document.getElementById('second').addEventListener('input', () => {
    const data = document.getElementById('second').value;
    if (data >= 1 && data <= 10) {
        interval = data * 1000;
        document.getElementById('progress').style.transition = `width ${data}s linear`;
        document.getElementById('interval').textContent = String(data);
    }
});