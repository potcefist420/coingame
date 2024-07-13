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

// Function to create a drop element
function createDrop() {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = `${Math.random() * 100}%`;
    document.body.appendChild(drop);
    
    // Animate the drop
    let position = 0;
    const animate = () => {
        if (position >= window.innerHeight) {
            document.body.removeChild(drop);
        } else {
            position += 2;
            drop.style.top = `${position}px`;
            requestAnimationFrame(animate);
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

        // Set background color
        document.body.style.backgroundColor = 'purple';

        // Create simple interface
        const app = document.createElement('div');
        app.innerHTML = `
            <div id="counter">Coins: 0</div>
            <img id="coinButton" src="https://telegra.ph/file/1620a11a55b8c01edd60a.jpg" alt="Click me!" style="cursor: pointer; width: 80%; max-width: 300px; height: auto;">
        `;
        document.body.appendChild(app);

        let count = loadCount();
        const counter = document.getElementById('counter');
        const coinButton = document.getElementById('coinButton');
        
        counter.textContent = `Coins: ${count}`;

        coinButton.addEventListener('click', () => {
            count++;
            counter.textContent = `Coins: ${count}`;
            log(`Click! Current count: ${count}`);
            saveCount(count);
            createDrop();

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
                        message: 'Welcome to the Clicker Game! Click the image to earn coins.',
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

// CSS for drops
const style = document.createElement('style');
style.textContent = `
    .drop {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: gold;
        border-radius: 50%;
        opacity: 0.7;
    }
`;
document.head.appendChild(style);
