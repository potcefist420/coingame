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

// Function to update counter with animation
function updateCounter(newCount) {
    const counter = document.getElementById('counter');
    counter.style.transform = 'scale(1.2)';
    counter.style.transition = 'transform 0.2s';
    counter.textContent = `Coins: ${newCount}`;
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 200);
}

// Function to create a drop element
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

// Function to initialize the application
function initApp() {
    log('Initializing application...');

    if (window.Telegram && window.Telegram.WebApp) {
        log('Telegram Web App API detected');
        const tg = window.Telegram.WebApp;

        // Create simple interface
        const app = document.createElement('div');
        app.innerHTML = `
            <div id="counter">Coins: 0</div>
            <img id="coinButton" src="https://i.postimg.cc/8CSnzB1T/Photo-1720905875371.png" alt="Click me!" style="cursor: pointer; width: 80%; max-width: 300px; height: auto;">
        `;
        document.body.appendChild(app);

        let count = loadCount();
        const counter = document.getElementById('counter');
        const coinButton = document.getElementById('coinButton');
        
        updateCounter(count);

        // Add styles
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

        // Create audio element for coin sound
        const coinSound = new Audio('https://www.dropbox.com/scl/fi/btpeqtebhg0rb64tz53jp/coin-flip-88793.mp3?rlkey=iixhkqqzeehecl3jp1ggowalm&st=o2athugd&dl=0'); // Replace with actual sound URL

        coinButton.addEventListener('click', (event) => {
            count++;
            updateCounter(count);
            log(`Click! Current count: ${count}`);
            saveCount(count);
            createDrop(event.clientX, event.clientY);
            coinSound.play();

            // Attempt to send data to Telegram
            try {
                tg.sendData(JSON.stringify({ action: 'click', count: count }));
                log('Data sent to Telegram');
            } catch (error) {
                log('Error sending data: ' + error.message);
            }
        });

        // Initialize Telegram Web App
        try {
            tg.ready();
            log('Telegram Web App ready');

            // Show welcome message on /start command
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

        // Try to expand the app to fullscreen
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

// Start the app after page load
window.addEventListener('load', initApp);

// Handle errors
window.onerror = function(message, source, lineno, colno, error) {
    log('Global error: ' + message);
    return true;
};
