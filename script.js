const frog = document.getElementById('frog');
const goal = document.getElementById('goal');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');

// Ensure frog is absolutely positioned so movement works
frog.style.position = 'absolute';
frog.style.left = '180px';
frog.style.top = '350px';

let frogX = 180;          // Frog's horizontal position
let frogY = 350;          // Frog's vertical position
let obstacle1X = 0;       // First obstacle's starting position (left side)
let obstacle2X = 20;     // Second obstacle's starting position (right side)
let gameOver = false;     // Tracks if the game has ended
let score = 0;            // Player's current score
let lives = 3;            // Remaining lives
let gameSpeed = 2;        // Base speed of obstacles
let level = 1;            // Current level
let isInvulnerable = false; // Prevents multiple collision detections in quick succession

// ...existing code...
// Create and style the score display div
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score';
scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '16px';
scoreDisplay.style.left = '16px';
scoreDisplay.style.color = '#fffbe7';
scoreDisplay.style.fontFamily = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Arial Rounded MT Bold', Arial, sans-serif";
scoreDisplay.style.fontSize = '22px';
scoreDisplay.style.textShadow = '2px 2px 4px #2e2e2e';
scoreDisplay.style.background = 'rgba(34, 66, 139, 0.85)'; // Frog green, semi-transparent
scoreDisplay.style.padding = '10px 22px';
scoreDisplay.style.borderRadius = '18px';
scoreDisplay.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
scoreDisplay.style.letterSpacing = '1px';
scoreDisplay.style.border = '2px solid #fffbe7';

// Create and style the lives display div
const livesDisplay = document.createElement('div');
livesDisplay.id = 'lives';
livesDisplay.textContent = `Lives: ${lives}`;
livesDisplay.style.position = 'absolute';
livesDisplay.style.top = '16px';
livesDisplay.style.right = '16px';
livesDisplay.style.color = '#fffbe7';
livesDisplay.style.fontFamily = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Arial Rounded MT Bold', Arial, sans-serif";
livesDisplay.style.fontSize = '22px';
livesDisplay.style.textShadow = '2px 2px 4px #2e2e2e';
livesDisplay.style.background = 'rgba(220, 20, 60, 0.85)'; // Crimson, semi-transparent
livesDisplay.style.padding = '10px 22px';
livesDisplay.style.borderRadius = '18px';
livesDisplay.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
livesDisplay.style.letterSpacing = '1px';
livesDisplay.style.border = '2px solid #fffbe7';

// Append both divs to the document body
document.body.appendChild(scoreDisplay);
document.body.appendChild(livesDisplay);

// Position the goal element
goal.style.position = 'absolute';
goal.style.top = '50px';
goal.style.left = '0px';

// Position obstacle1
obstacle1.style.position = 'absolute';
obstacle1.style.top = '150px';
obstacle1.style.left = obstacle1X + 'px';

// Position obstacle2
obstacle2.style.position = 'absolute';
obstacle2.style.top = '250px';
obstacle2.style.left = obstacle2X + 'px';

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
}

function checkGoal() {
    const frogRect = frog.getBoundingClientRect();
    const goalRect = goal.getBoundingClientRect();

    if (
        frogRect.left < goalRect.right &&
        frogRect.right > goalRect.left &&
        frogRect.top < goalRect.bottom &&
        frogRect.bottom > goalRect.top
    ) {
        handleGoalCrossed();
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

    frog.style.left = frogX + 'px';
    frog.style.top = frogY + 'px';
    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';

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

    // Reset obstacle positions
    obstacle1X = 0;
    obstacle2X = 20;
    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';

    alert(`${message}\nScore penalty: -${penalty}`);

    if (lives <= 0) {

        // Hide game elements
        frog.style.display = 'none';
        goal.style.display = 'none';
        obstacle1.style.display = 'none';
        obstacle2.style.display = 'none';
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
            scoreDisplay.style.display = '';
            livesDisplay.style.display = '';

            // Reset positions
            frog.style.left = frogX + 'px';
            frog.style.top = frogY + 'px';
            obstacle1.style.left = obstacle1X + 'px';
            obstacle2.style.left = obstacle2X + 'px';

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

    // Get obstacle widths (assume 40px if not set)
    const obstacleWidth1 = obstacle1.offsetWidth || 40;
    const obstacleWidth2 = obstacle2.offsetWidth || 40;

    // Wrap obstacles around screen edges only after fully obscured
    if (obstacle1X > 400) obstacle1X = -obstacleWidth1;
    if (obstacle2X < -obstacleWidth2) obstacle2X = 400;

    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';

    // Check collision each frame
    checkCollision();

    requestAnimationFrame(gameLoop);
}

gameLoop();