// Function for logging
function log(message) {
    console.log(message);
    const logElement = document.getElementById('log');
    if (logElement) {
        logElement.innerHTML += message + '<br>';
    }
}

// Function to save count to localStorage
function saveCount(count) {
    localStorage.setItem('clickerCount', count);
}

// Function to load count from localStorage
function loadCount() {
    return parseInt(localStorage.getItem('clickerCount') || '0');
}
// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Создание элементов UI
const app = document.createElement('div');
app.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #8204EA;
`;

const counter = document.createElement('h1');
counter.id = 'counter';
counter.textContent = 'Монет: 0';

const coinButton = document.createElement('button');
coinButton.id = 'coinButton';
coinButton.textContent = '₴';
coinButton.style.cssText = `
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #ffd700;
    border: none;
    font-size: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const coinContainer = document.createElement('div');
coinContainer.id = 'coinContainer';
coinContainer.style.position = 'relative';
coinContainer.appendChild(coinButton);

app.appendChild(counter);
app.appendChild(coinContainer);

// Добавление стилей для частиц
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: silver;
        border-radius: 50%;
        animation: particleAnimation 1s ease-out forwards;
    }
    @keyframes particleAnimation {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Функция для создания частиц
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 60 + 20}%`;
    particle.style.top = `${Math.random() * 60 + 20}%`;
    particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
    coinContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
}

// Обработчик клика
let count = 0;
coinButton.addEventListener('click', () => {
    count++;
    counter.textContent = `Монет: ${count}`;
    for (let i = 0; i < 5; i++) {
        createParticle();
    }
    coinButton.style.transform = 'scale(0.95)';
    setTimeout(() => coinButton.style.transform = 'scale(1)', 100);

    // Отправка данных в Telegram
    tg.sendData(JSON.stringify({ action: 'click', count: count }));
});

// Добавление приложения в body
document.body.appendChild(app);

// Инициализация Telegram Web App
tg.ready();
