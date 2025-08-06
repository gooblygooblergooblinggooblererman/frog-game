const frog = document.getElementById('frog');
const goal = document.getElementById('goal');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');
const obstacle3 = document.getElementById('obstacle3');


// Initial position and movement direction for obstacle3
let obstacle3Y = 180;
let obstacle3Direction = 1; // 1 = down, -1 = up

// ...existing code...

// Position obstacle1
obstacle1.style.position = 'absolute';
obstacle1.style.top = '150px';
obstacle1.style.left = obstacle1X + 'px';

// Position obstacle2
obstacle2.style.position = 'absolute';
obstacle2.style.top = '250px';
obstacle2.style.left = obstacle2X + 'px';

// Position obstacle3 (center)
obstacle3.style.left = '180px';
obstacle3.style.top = obstacle3Y + 'px';

// Listen for keyboard key presses
document.addEventListener('keydown', function(event) {
    // Only move if game is not over
    if (gameOver) return;

    // Only move once per key press (ignore auto-repeat)
    if (event.repeat) return;

    let moved = false;
    if (event.code === 'KeyW') {
        frogY -= 10;
        moved = true;
    }
    if (event.code === 'KeyS') {
        frogY += 10;
        moved = true;
    }
    if (event.code === 'KeyA') {
        frogX -= 10;
        moved = true;
    }
    if (event.code === 'KeyD') {
        frogX += 10;
        moved = true;
    }
    if (!moved) return; // Ignore other keys

    // Keep frog within 400x400 area (0 to 360, since frog is 40x40)
    frogX = Math.max(0, Math.min(frogX, 360));
    frogY = Math.max(0, Math.min(frogY, 360));

    // Update frog's position on screen
    frog.style.left = frogX + 'px';
    frog.style.top = frogY + 'px';

    // Check if frog reached the goal
    checkGoal();

    // Check for collisions if not invulnerable
    if (!isInvulnerable) {
        checkCollision();
    }
});

function checkCollision() {
    // Get frog and obstacle bounding boxes
    const frogRect = frog.getBoundingClientRect();
    const obstacle1Rect = obstacle1.getBoundingClientRect();
    const obstacle2Rect = obstacle2.getBoundingClientRect();
    const obstacle3Rect = obstacle3.getBoundingClientRect();

    // Simple AABB collision detection
    if (
        frogRect.left < obstacle1Rect.right &&
        frogRect.right > obstacle1Rect.left &&
        frogRect.top < obstacle1Rect.bottom &&
        frogRect.bottom > obstacle1Rect.top
    ) {
        endGame('You hit obstacle 1!');
    }
    if (
        frogRect.left < obstacle2Rect.right &&
        frogRect.right > obstacle2Rect.left &&
        frogRect.top < obstacle2Rect.bottom &&
        frogRect.bottom > obstacle2Rect.top
    ) {
        endGame('You hit obstacle 2!');
    }
    if (
        frogRect.left < obstacle3Rect.right &&
        frogRect.right > obstacle3Rect.left &&
        frogRect.top < obstacle3Rect.bottom &&
        frogRect.bottom > obstacle3Rect.top
    ) {
        endGame('You hit obstacle 3!');
    }
}

function handleGoalCrossed() {
    // Increase difficulty and score
    gameSpeed += 1;
    level += 1;
    score += 100;

    // Reset positions
    frogX = 180;
    frogY = 350;
    obstacle1X = 0;
    obstacle2X = 20;
    obstacle3Y = 180;
    obstacle3Direction = 1;

    frog.style.left = frogX + 'px';
    frog.style.top = frogY + 'px';
    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';
    obstacle3.style.top = obstacle3Y + 'px';

    // Update displays
    scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;

    // Briefly show a message
    alert('You reached the goal! Level up!');
}

function endGame(message) {
    if (isInvulnerable || gameOver) return;

    lives -= 1;
    // Decrease score by a random amount between 50 and 100
    const penalty = Math.floor(Math.random() * 51) + 50;
    score = Math.max(0, score - penalty);
    livesDisplay.textContent = `Lives: ${lives}`;
    scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
    isInvulnerable = true;

    alert(`${message}\nScore penalty: -${penalty}`);

    if (lives <= 0) {

        // Hide game elements
        frog.style.display = 'none';
        goal.style.display = 'none';
        obstacle1.style.display = 'none';
        obstacle2.style.display = 'none';
        obstacle3.style.display = 'none';
        scoreDisplay.style.display = 'none';
        livesDisplay.style.display = 'none';

        // Stop the game loop
        gameOver = true;

        // Create GAME OVER screen
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'gameOverScreen';
        gameOverScreen.style.position = 'fixed';
        gameOverScreen.style.top = '0';
        gameOverScreen.style.left = '0';
        gameOverScreen.style.width = '100vw';
        gameOverScreen.style.height = '100vh';
        gameOverScreen.style.background = 'rgba(34, 66, 139, 0.95)';
        gameOverScreen.style.display = 'flex';
        gameOverScreen.style.flexDirection = 'column';
        gameOverScreen.style.justifyContent = 'center';
        gameOverScreen.style.alignItems = 'center';
        gameOverScreen.style.zIndex = '9999';

        const title = document.createElement('h1');
        title.textContent = 'GAME OVER';
        title.style.color = '#fffbe7';
        title.style.fontSize = '64px';
        title.style.marginBottom = '24px';
        title.style.textShadow = '2px 2px 8px #2e2e2e';

        const points = document.createElement('div');
        points.textContent = `Your Score: ${score}`;
        points.style.color = '#fffbe7';
        points.style.fontSize = '32px';
        points.style.marginBottom = '32px';

        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Retry';
        retryBtn.style.fontSize = '28px';
        retryBtn.style.padding = '16px 48px';
        retryBtn.style.borderRadius = '12px';
        retryBtn.style.border = '2px solid #fffbe7';
        retryBtn.style.background = '#228B22';
        retryBtn.style.color = '#fffbe7';
        retryBtn.style.cursor = 'pointer';
        retryBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';

        // Attach click handler for retry button
        retryBtn.onclick = function() {
            // Remove GAME OVER screen
            document.body.removeChild(gameOverScreen);

            // Reset game state
            frogX = 180;
            frogY = 350;
            obstacle1X = 0;
            obstacle2X = 20;
            obstacle3Y = 180;
            obstacle3Direction = 1;
            score = 0;
            lives = 3;
            gameSpeed = 2;
            level = 1;
            isInvulnerable = false;

            // Show game elements
            frog.style.display = '';
            goal.style.display = '';
            obstacle1.style.display = '';
            obstacle2.style.display = '';
            obstacle3.style.display = '';
            scoreDisplay.style.display = '';
            livesDisplay.style.display = '';

            // Reset positions
            frog.style.left = frogX + 'px';
            frog.style.top = frogY + 'px';
            obstacle1.style.left = obstacle1X + 'px';
            obstacle2.style.left = obstacle2X + 'px';
            obstacle3.style.top = obstacle3Y + 'px';

            // Update displays
            scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
            livesDisplay.textContent = `Lives: ${lives}`;

            // Restart game loop
            gameOver = false;
            gameLoop();
        };

        gameOverScreen.appendChild(title);
        gameOverScreen.appendChild(points);
        gameOverScreen.appendChild(retryBtn);
        document.body.appendChild(gameOverScreen);

    } else {
        // Reset frog position
        frogX = 180;
        frogY = 350;
        frog.style.left = frogX + 'px';
        frog.style.top = frogY + 'px';

        // Brief invulnerability after hit
        setTimeout(() => {
            isInvulnerable = false;
        }, 1000);
    }
}

// Simple game loop to move obstacles
function gameLoop() {
    if (gameOver) return;

    // Move obstacles horizontally
    obstacle1X += gameSpeed;
    obstacle2X -= gameSpeed;

    // Move obstacle3 vertically
    obstacle3Y += gameSpeed * obstacle3Direction;

    // Get obstacle widths/heights (assume 40px if not set)
    const obstacleWidth1 = obstacle1.offsetWidth || 40;
    const obstacleWidth2 = obstacle2.offsetWidth || 40;
    const obstacleHeight3 = obstacle3.offsetHeight || 40;

    // Wrap obstacles around screen edges only after fully obscured
    if (obstacle1X > 400) obstacle1X = -obstacleWidth1;
    if (obstacle2X < -obstacleWidth2) obstacle2X = 400;

    // Bounce obstacle3 vertically within 0 to 360
    if (obstacle3Y < 0) {
        obstacle3Y = 0;
        obstacle3Direction = 1;
    }
    if (obstacle3Y > 360) {
        obstacle3Y = 360;
        obstacle3Direction = -1;
    }

    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';
    obstacle3.style.top = obstacle3Y + 'px';

    // Check collision each frame
    checkCollision();

    requestAnimationFrame(gameLoop);
}

gameLoop();
