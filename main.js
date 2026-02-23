class LottoDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-height: 80px;
                }
                .lotto-numbers {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
                .lotto-number {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    opacity: 0;
                    transform: scale(0.5);
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                
                @keyframes popIn {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .shuffling {
                    animation: shake 0.1s infinite;
                }

                @keyframes shake {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-2px); }
                }
            </style>
            <div class="lotto-numbers"></div>
        `;
    }

    async displayNumbers(numbers) {
        const container = this.shadowRoot.querySelector('.lotto-numbers');
        container.innerHTML = '';
        
        // Create placeholders
        const slots = [];
        for (let i = 0; i < 6; i++) {
            const circle = document.createElement('div');
            circle.className = 'lotto-number';
            circle.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(circle);
            slots.push(circle);
        }

        // Shuffle effect
        for (let step = 0; step < 10; step++) {
            slots.forEach(slot => {
                slot.textContent = Math.floor(Math.random() * 45) + 1;
                slot.classList.add('shuffling');
            });
            await new Promise(r => setTimeout(r, 50));
        }

        // Set final numbers
        slots.forEach((slot, i) => {
            slot.classList.remove('shuffling');
            slot.textContent = numbers[i];
            slot.style.background = this.getColorForNumber(numbers[i]);
        });
    }

    getColorForNumber(num) {
        if (num <= 10) return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'; // Yellow
        if (num <= 20) return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'; // Blue
        if (num <= 30) return 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'; // Red
        if (num <= 40) return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'; // Gray
        return 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'; // Green
    }
}

customElements.define('lotto-display', LottoDisplay);

const historyList = document.getElementById('history-list');
const historyContainer = document.getElementById('history-container');
const generatorBtn = document.getElementById('generator-btn');
const clearHistoryBtn = document.getElementById('clear-history');

generatorBtn.addEventListener('click', async () => {
    generatorBtn.disabled = true;
    generatorBtn.textContent = 'Generating...';
    
    const lottoDisplay = document.querySelector('lotto-display');
    const numbers = generateLottoNumbers();
    
    await lottoDisplay.displayNumbers(numbers);
    
    addToHistory(numbers);
    
    generatorBtn.disabled = false;
    generatorBtn.textContent = 'Generate Numbers';
});

clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '';
    historyContainer.classList.add('hidden');
    localStorage.removeItem('lottoHistory');
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function addToHistory(numbers) {
    historyContainer.classList.remove('hidden');
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = numbers.map(n => `<span>${n}</span>`).join('');
    
    if (historyList.firstChild) {
        historyList.insertBefore(li, historyList.firstChild);
    } else {
        historyList.appendChild(li);
    }
    
    // Save to local storage
    const history = JSON.parse(localStorage.getItem('lottoHistory') || '[]');
    history.unshift(numbers);
    localStorage.setItem('lottoHistory', JSON.stringify(history.slice(0, 10)));
}

// Load history on start
window.addEventListener('DOMContentLoaded', () => {
    const history = JSON.parse(localStorage.getItem('lottoHistory') || '[]');
    if (history.length > 0) {
        history.reverse().forEach(nums => addToHistory(nums));
    }
});
