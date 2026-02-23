
class LottoDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .lotto-numbers {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }
                .lotto-number {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white;
                    background-color: rgba(0,0,0,0.2);
                }
            </style>
            <div class="lotto-numbers"></div>
        `;
    }

    displayNumbers(numbers) {
        const container = this.shadowRoot.querySelector('.lotto-numbers');
        container.innerHTML = '';
        numbers.forEach(number => {
            const circle = document.createElement('div');
            circle.className = 'lotto-number';
            circle.textContent = number;
            container.appendChild(circle);
        });
    }
}

customElements.define('lotto-display', LottoDisplay);

document.getElementById('generator-btn').addEventListener('click', () => {
    const lottoDisplay = document.querySelector('lotto-display');
    const numbers = generateLottoNumbers();
    lottoDisplay.displayNumbers(numbers);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}
