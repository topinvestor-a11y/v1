import { winningNumbersData } from './data.js';

/**
 * Lotto Board Web Component
 * Displays the generated lottery numbers with animations.
 */
class LottoBoard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80px;
                }
                .lotto-numbers {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .ball {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #0d0d0d; /* Dark text for contrast */
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 -5px 10px rgba(0,0,0,0.1);
                    opacity: 0;
                    transform: translateY(20px) scale(0.8);
                    animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    position: relative;
                    overflow: hidden;
                }
                @keyframes popIn {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .shine {
                    position: absolute;
                    top: 5%;
                    left: 15%;
                    width: 70%;
                    height: 40%;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    filter: blur(5px);
                    transform: rotate(20deg);
                }
            </style>
            <div class="lotto-numbers"></div>
        `;
    }

    displayNumbers(numbers = []) {
        const container = this.shadowRoot.querySelector('.lotto-numbers');
        container.innerHTML = '';
        numbers.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.style.animationDelay = `${index * 100}ms`;
            ball.style.background = this.getColorForNumber(num);
            
            const numberSpan = document.createElement('span');
            numberSpan.textContent = num;

            const shine = document.createElement('div');
            shine.className = 'shine';

            ball.appendChild(numberSpan);
            ball.appendChild(shine);
            container.appendChild(ball);
        });
    }

    getColorForNumber(num) {
        if (num <= 10) return 'linear-gradient(135deg, #FFD700, #FFA500)'; // Gold/Orange
        if (num <= 20) return 'linear-gradient(135deg, #87CEEB, #4682B4)'; // SkyBlue/SteelBlue
        if (num <= 30) return 'linear-gradient(135deg, #FF6B6B, #FF0000)'; // LightRed/Red
        if (num <= 40) return 'linear-gradient(135deg, #A9A9A9, #696969)'; // DarkGray/DimGray
        return 'linear-gradient(135deg, #90EE90, #2E8B57)'; // LightGreen/SeaGreen
    }
}
customElements.define('lotto-board', LottoBoard);


/**
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const analyzeBtn = document.getElementById('analyze-btn');
    const lottoBoard = document.querySelector('lotto-board');
    const probabilityValue = document.getElementById('probability-value');
    const historyList = document.getElementById('history-list');
    const historyPanel = document.getElementById('history-panel');
    const showHistoryBtn = document.getElementById('show-history');
    const clearHistoryBtn = document.getElementById('clear-history');
    const patternType = document.getElementById('pattern-type');

    // --- Real Statistical Data Processing ---
    const allNumbers = winningNumbersData.flatMap(draw => draw[1]);
    const numberFrequencies = allNumbers.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
    }, {});
    
    const firstDraw = winningNumbersData[winningNumbersData.length - 1][0];
    const lastDraw = winningNumbersData[0][0];
    patternType.textContent = `${firstDraw}회 ~ ${lastDraw}회`;
    probabilityValue.textContent = `${allNumbers.length}개`;

    // --- Core Functions ---

    /**
     * Generates lotto numbers based on weighted frequencies from real data.
     * @returns {number[]} A sorted array of 6 unique lotto numbers.
     */
    function generateWeightedLottoNumbers() {
        const weightedList = [];
        for (const num in numberFrequencies) {
            const weight = numberFrequencies[num];
            for (let i = 0; i < weight; i++) {
                weightedList.push(parseInt(num));
            }
        }

        const selectedNumbers = new Set();
        while (selectedNumbers.size < 6) {
            const randomIndex = Math.floor(Math.random() * weightedList.length);
            selectedNumbers.add(weightedList[randomIndex]);
        }

        return Array.from(selectedNumbers).sort((a, b) => a - b);
    }

    // --- Event Listeners ---

    analyzeBtn.addEventListener('click', () => {
        analyzeBtn.disabled = true;
        analyzeBtn.querySelector('.btn-text').textContent = '번호 추출 중...';
        lottoBoard.displayNumbers([]); // Clear previous numbers

        setTimeout(() => {
            const numbers = generateWeightedLottoNumbers();
            lottoBoard.displayNumbers(numbers);
            saveToHistory(numbers);

            analyzeBtn.disabled = false;
            analyzeBtn.querySelector('.btn-text').textContent = '⚡ 최적의 번호 조합 추출';
        }, 500); // Simulate analysis time
    });

    showHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
    });

    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
        localStorage.removeItem('lottoHistory');
        historyPanel.classList.add('hidden');
    });

    // --- History Management ---

    function saveToHistory(numbers) {
        let history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
        history.unshift(numbers);
        if (history.length > 10) history = history.slice(0, 10);
        localStorage.setItem('lottoHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        const history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
        history.forEach(numbers => {
            const li = document.createElement('li');
            li.textContent = numbers.join(', ');
            historyList.appendChild(li);
        });
    }

    // --- Initial Load ---
    lottoBoard.displayNumbers();
    renderHistory();
});
