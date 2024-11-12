const socket = new WebSocket("ws://localhost:8080");

document.addEventListener('DOMContentLoaded', () => {
    const aimDiv = document.getElementById('aim');
    const shootDiv = document.getElementById('shoot');
    const aimOutput = document.getElementById('aimOutput');
    const shootOutput = document.getElementById('shootOutput');

    const aimHammer = new Hammer(aimDiv);
    aimHammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    const shootHammer = new Hammer(shootDiv)
    shootHammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

    let startX = 0;
    let startY = 0;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    aimHammer.on('panstart', (event) => {
        startX = event.center.x;
        aimOutput.textContent = 'Aim Distance: 0';
    });

    aimHammer.on('panmove', (event) => {
        const deltaX = event.center.x - startX;
        const distancePercent = Math.min(Math.max((deltaX / screenWidth) * 100, -100), 100);
        aimOutput.textContent = `Aim Distance: ${Math.round(distancePercent)}`;
        sendToServer(`Shoot Distance: ${Math.round(distancePercent)}`);
    });
    
    aimHammer.on('panend', () => {
        startX = 0;
    });
    
    shootHammer.on('panstart', (event) => {
        startY = event.center.y;
        shootOutput.textContent = 'Shoot Distance: 0';
    });

    shootHammer.on('panmove', (event) => {
        const deltaY = event.center.y - startY;
        const distancePercent = Math.min(Math.max((deltaY / screenHeight) * 100, -100), 100);
        shootOutput.textContent = `Shoot Distance: ${Math.round(distancePercent)}`;
        sendToServer(`Shoot Distance: ${Math.round(distancePercent)}`);
    });

    shootHammer.on('panend', () => {
        startY = 0;
    });
});

function sendToServer(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
}