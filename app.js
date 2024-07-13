<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coin Clicker</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color:#f0f0f0;
        }
        #coinButton {
            width: 100px;
            height: 100px;
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
        }
        #coinButton:active {
            transform: scale(0.95);
        }
        .particle {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: gold;
            border-radius: 50%;
            animation: particleAnimation 1s ease-out forwards;
        }
        @keyframes particleAnimation {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
    </style>
</head>
<body>
    <h1 id="counter">Монет: 0</h1>
    <div id="coinContainer">
        <button id="coinButton">₿</button>
    </div>

    <script>
        let count = 0;
        const counter = document.getElementById('counter');
        const coinButton = document.getElementById('coinButton');
        const coinContainer = document.getElementById('coinContainer');

        // Инициализация Telegram Web App
        window.Telegram.WebApp.ready();

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

        coinButton.addEventListener('click', () => {
            count++;
            counter.textContent = `Монет: ${count}`;
            for (let i = 0; i < 5; i++) {
                createParticle();
            }

            // Отправка данных в Telegram
            window.Telegram.WebApp.sendData(JSON.stringify({ action: 'click', count: count }));
        });
    </script>
</body>
</html>
