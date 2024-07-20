// Инициализация Telegram Web App API
function initApp() {
    console.log('Initializing application...');

    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        const coinSoundURL = 'https://potcefist420.github.io/coingame/collectcoin-6075.mp3';
        let coins = 0;
        let multiTapCost = 10000;
        let tapValue = 1;
        let isMuted = false;
        let referrals = {}; // {referralId: {user: '', referralCount: 0}}
        let leaderboard = []; // {name: '', score: 0}

        // Логирование сообщений
        function log(message) {
            console.log(message);
            const logElement = document.getElementById('log');
            if (logElement) {
                logElement.innerHTML += message + '<br>';
            }
        }

        // Сохранение и загрузка количества кликов
        function saveCount(count) {
            localStorage.setItem('clickerCount', count);
        }

        function loadCount() {
            return parseInt(localStorage.getItem('clickerCount') || '0');
        }

        function updateCounter(newCount) {
            const counter = document.getElementById('counter');
            counter.style.transform = 'scale(1.2)';
            counter.style.transition = 'transform 0.2s';
            counter.textContent = `Coins: ${newCount}`;
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);
        }

        function createDrop(x, y) {
            const drop = document.createElement('div');
            drop.className = 'drop';
            drop.style.left = `${x}px`;
            drop.style.top = `${y}px`;
            document.body.appendChild(drop);

            let posY = y;
            const animate = () => {
                posY += 5;
                drop.style.top = `${posY}px`;
                drop.style.opacity = 1 - (posY - y) / 100;
                if (posY < y + 100) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(drop);
                }
            };
            requestAnimationFrame(animate);
        }

        // Функции управления звуком
        function toggleSound() {
            isMuted = !isMuted;
            tg.showPopup({
                title: 'Sound ' + (isMuted ? 'Muted' : 'Unmuted'),
                message: '',
                buttons: [{ text: 'OK', type: 'ok' }]
            });
        }

        // Реферальная система
        function handleReferral(referralCode) {
            if (!referrals[referralCode]) {
                referrals[referralCode] = { user: referralCode, referralCount: 1 };
            } else {
                referrals[referralCode].referralCount++;
            }
            // Вознаграждение игрока и владельца реферальной ссылки
        }

        function showReferralPopup() {
            tg.showPopup({
                title: 'Referral Program',
                message: 'Enter your referral code to earn rewards!',
                buttons: [
                    { text: 'Submit', type: 'ok', callback: () => {
                        const referralCode = prompt('Enter your referral code:');
                        if (referralCode) {
                            handleReferral(referralCode);
                        }
                    }}
                ]
            });
        }

        // Магазин и мультитап
        function buyMultiTap() {
            if (coins >= multiTapCost) {
                coins -= multiTapCost;
                tapValue += 1;
                multiTapCost += 2;
                tg.showPopup({
                    title: 'Multi-Tap Purchased!',
                    message: 'Your tap value is now ' + tapValue + ' coins per click.',
                    buttons: [{ text: 'OK', type: 'ok' }]
                });
            } else {
                tg.showPopup({
                    title: 'Not Enough Coins',
                    message: 'You need ' + multiTapCost + ' coins to buy Multi-Tap.',
                    buttons: [{ text: 'OK', type: 'ok' }]
                });
            }
        }

        function showShop() {
            tg.showPopup({
                title: 'Shop',
                message: 'Buy upgrades to improve your game!',
                buttons: [
                    { text: 'Buy Multi-Tap (' + multiTapCost + ' coins)', type: 'custom', callback: buyMultiTap }
                ]
            });
        }

        // Список лидеров
        function addPlayerToLeaderboard(name, score) {
            let player = leaderboard.find(p => p.name === name);
            if (player) {
                player.score = score;
            } else {
                leaderboard.push({ name: name, score: score });
            }
            leaderboard.sort((a, b) => b.score - a.score);
        }

        function showLeaderboard() {
            tg.showPopup({
                title: 'Leaderboard',
                message: 'Enter your nickname to see your score and the leaderboard.',
                buttons: [
                    { text: 'Submit', type: 'ok', callback: () => {
                        const nickname = prompt('Enter your nickname:');
                        if (nickname) {
                            const player = leaderboard.find(p => p.name === nickname);
                            if (player) {
                                tg.showPopup({
                                    title: 'Your Score',
                                    message: 'Your score: ' + player.score,
                                    buttons: [{ text: 'OK', type: 'ok' }]
                                });
                            } else {
                                tg.showPopup({
                                    title: 'New Player',
                                    message: 'You are not in the leaderboard yet. Adding you now.',
                                    buttons: [{ text: 'OK', type: 'ok' }]
                                });
                                addPlayerToLeaderboard(nickname, 0);
                            }
                        }
                    }}
                ]
            });
        }

        // Добавление элементов в интерфейс
        const app = document.createElement('div');
        app.innerHTML = `
            <div id="counter">Coins: 0</div>
            <img id="coinButton" src="https://i.postimg.cc/8CSnzB1T/Photo-1720905875371.png" alt="Click me!" style="cursor: pointer; width: 80%; max-width: 300px; height: auto;">
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
        
        updateCounter(count);

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
                -webkit-tap-highlight-color: transparent;
            }
            #coinButton:active {
                transform: scale(1.2);
                filter: none;
            }
            .drop {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: gold;
                border-radius: 50%;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);

        coinButton.addEventListener('click', (event) => {
            count += tapValue;
            updateCounter(count);
            log(`Click! Current count: ${count}`);
            saveCount(count);
            createDrop(event.clientX, event.clientY);

            if (!isMuted) {
                const coinSound = new Audio(coinSoundURL);
                coinSound.play();
            }

            try {
                tg.sendData(JSON.stringify({ action: 'click', count: count }));
                log('Data sent to Telegram');
            } catch (error) {
                log('Error sending data: ' + error.message);
            }
        });

        // Настройка Telegram Web App
        try {
            tg.ready();
            log('Telegram Web App ready');

            tg.onEvent('viewportChanged', () => {
                if (tg.initDataUnsafe.start_param === 'start') {
                    tg.showPopup({
                        title: 'Welcome!',
                        message: 'Welcome to the Coin Clicker Game! Click the image to earn coins.',
                        buttons: [
                            { text: 'Start Playing', type: 'ok' },
                            { text: 'Toggle Sound', type: 'custom', callback: toggleSound },
                            { text: 'Referrals', type: 'custom', callback: showReferralPopup },
                            { text: 'Shop', type: 'custom', callback: showShop },
                            { text: 'Leaderboard', type: 'custom', callback: showLeaderboard }
                        ]
                    });
                }
            });
            
            tg.expand();
            log('App expanded to fullscreen');
        } catch (error) {
            log('Error initializing Telegram Web App: ' + error.message);
        }
    } else {
        log('Telegram Web App API not detected');
    }
}

// Запуск приложения после загрузки страницы
window.addEventListener('load', initApp);

// Обработка глобальных ошибок
window.onerror = function(message, source, lineno, colno, error) {
    log('Global error: ' + message);
    return true;
};
                             
