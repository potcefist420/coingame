// Функция для логирования
function log(message) {
    console.log(message);
    const logElement = document.getElementById('log');
    if (logElement) {
        logElement.innerHTML += message + '<br>';
    }
}

// Функция для сохранения счета в localStorage
function saveCount(count) {
    localStorage.setItem('clickerCount', count);
    const playerName = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name : 'Player';
    savePlayerScore(playerName, count);
}

// Функция для загрузки счета из localStorage
function loadCount() {
    return parseInt(localStorage.getItem('clickerCount') || '0');
}

// Функция для обновления счетчика с анимацией
function updateCounter(newCount) {
    const counter = document.getElementById('counter');
    counter.style.transform = 'scale(1.2)';
    counter.style.transition = 'transform 0.2s';
    counter.textContent = `Coins: ${newCount}`;
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 200);
}

// Функция для создания частицы
function createDrop(x, y) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    document.body.appendChild(drop);

    let posY = y;
    const animate = () => {
        posY += 5; // Скорость падения
        drop.style.top = `${posY}px`;
        drop.style.opacity = 1 - (posY - y) / 100;
        if (posY < y + 100) { // Дистанция падения
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(drop);
        }
    };
    requestAnimationFrame(animate);
}

// Функция для сохранения счета игрока
function savePlayerScore(player, score) {
    const scores = JSON.parse(localStorage.getItem('playerScores') || '{}');
    scores[player] = score;
    localStorage.setItem('playerScores', JSON.stringify(scores));
}

// Функция для загрузки счетов игроков
function loadPlayerScores() {
    return JSON.parse(localStorage.getItem('playerScores') || '{}');
}

// Функция для отображения списка игроков и их счета
function showPlayerScores() {
    const scores = loadPlayerScores();
    let message = 'Список игроков и их счет:\n\n';
    for (const player in scores) {
        message += `${player}: ${scores[player]} coins\n`;
    }
    alert(message);
}

// Функция для инициализации приложения
function initApp() {
    log('Initializing application...');

    if (window.Telegram && window.Telegram.WebApp) {
        log('Telegram Web App API detected');
        const tg = window.Telegram.WebApp;

        // Создание простого интерфейса
        const app = document.createElement('div');
        app.innerHTML = `
            <div id="counter">Coins: 0</div>
            <img id="coinButton" src="https://i.postimg.cc/8CSnzB1T/Photo-1720905875371.png" alt="Click me!" style="cursor: pointer; width: 80%; max-width: 300px; height: auto;">
            <button id="showScoresButton">Показать счет игроков</button>
        `;
        app.style.display = 'flex';
        app.style.flexDirection = 'column';
        app.style.alignItems = 'center';
        app.style.justifyContent = 'center';
        app.style.height = '100vh';
        app.style.width = '100%';
        document.body.appendChild(app);

        let count = loadCount();
        const counter = document.getElementById('counter');
        const coinButton = document.getElementById('coinButton');
        const showScoresButton = document.getElementById('showScoresButton');
        
        updateCounter(count);

        // Добавление стилей
        const style = document.createElement('style');
        style.textContent = `
            body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: purple;
                color: white;
            }
            #counter {
                font-size: 24px;
                margin-bottom: 20px;
            }
            #coinButton {
                margin-top: 20px;
                outline: none;
                transition: transform 0.2s;
                -webkit-tap-highlight-color: transparent; /* Убирает полупрозрачный прямоугольник */
            }
            #coinButton:active {
                transform: scale(1.2); /* Анимация увеличения */
                filter: none; /* Убирает полупрозрачный эффект */
            }
            .drop {
                position: absolute;
                width: 10px; /* Размер частицы */
                height: 10px; /* Размер частицы */
                background-color: gold; /* Цвет частицы */
                border-radius: 50%;
                pointer-events: none;
            }
            #showScoresButton {
                margin-top: 20px;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        // Создание аудиоэлемента для звука монеты
        const coinSoundURL = 'https://potcefist420.github.io/coingame/collectcoin-6075.mp3';

        coinButton.addEventListener('click', (event) => {
            count++;
            updateCounter(count);
            log(`Click! Current count: ${count}`);
            saveCount(count);
            createDrop(event.clientX, event.clientY);
            
            // Создание и воспроизведение нового аудиоэлемента
            const coinSound = new Audio(coinSoundURL);
            coinSound.play();

            // Попытка отправить данные в Telegram
            try {
                tg.sendData(JSON.stringify({ action: 'click', count: count }));
                log('Data sent to Telegram');
            } catch (error) {
                log('Error sending data: ' + error.message);
            }
        });

        // Обработчик для кнопки "Показать счет игроков"
        showScoresButton.addEventListener('click', showPlayerScores);

        // Инициализация Telegram Web App
        try {
            tg.ready();
            log('Telegram Web App ready');

            // Показать приветственное сообщение при команде /start
            tg.onEvent('viewportChanged', () => {
                if (tg.initDataUnsafe.start_param === 'start') {
                    tg.showPopup({
                        title: 'Welcome!',
                        message: 'Welcome to the Coin Clicker Game! Click the image to earn coins.',
                        buttons: [{text: 'Start Playing', type: 'ok'}]
                    });
                }
            });

        } catch (error) {
            log('Error initializing Telegram Web App: ' + error.message);
        }

        // Попытка развернуть приложение на весь экран
        try {
            tg.expand();
            log('App expanded to fullscreen');
        } catch (error) {
            log('Error expanding app: ' + error.message);
        }
    } else {
        log('Telegram Web App API not detected');
    }
}

// Запуск приложения после загрузки страницы
window.addEventListener('load', initApp);

// Обработка ошибок
window.onerror = function(message, source, lineno, colno, error) {
    log('Global error: ' + message);
    return true;
};
