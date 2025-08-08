// Initialize game elements
const frog = document.getElementById('frog');
const goal = document.getElementById('goal');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');
const obstacle3 = document.getElementById('obstacle3');

// Game state variables
let frogX = 180;          
let frogY = 350;          
let obstacle1X = 0;       
let obstacle2X = 20;     
let obstacle3Y = 200;
let obstacle3Direction = 1;
let gameOver = false;     
let score = 0;            
let lives = 3;            
let gameSpeed = 2;        
let level = 1;            // Start at level 1
let isInvulnerable = false;
const MAX_SPEED = 5; // Speed cap

// Initialize elements
frog.style.position = 'absolute';
frog.style.left = frogX + 'px';
frog.style.top = frogY + 'px';
frog.tabIndex = 0;

goal.style.position = 'absolute';
goal.style.top = '10px';
goal.style.left = '0px';

obstacle1.style.position = 'absolute';
obstacle1.style.top = '150px';
obstacle1.style.left = obstacle1X + 'px';

obstacle2.style.position = 'absolute';
obstacle2.style.top = '250px';
obstacle2.style.left = obstacle2X + 'px';

obstacle3.style.position = 'absolute';
obstacle3.style.top = obstacle3Y + 'px';
obstacle3.style.left = '180px';
obstacle3.style.display = 'none'; // Start hidden

// Create score and lives displays
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
scoreDisplay.style.background = 'rgba(34, 66, 139, 0.85)'; 
scoreDisplay.style.padding = '10px 22px';
scoreDisplay.style.borderRadius = '18px';
scoreDisplay.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
scoreDisplay.style.letterSpacing = '1px';
scoreDisplay.style.border = '2px solid #fffbe7';

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
livesDisplay.style.background = 'rgba(220, 20, 60, 0.85)'; 
livesDisplay.style.padding = '10px 22px';
livesDisplay.style.borderRadius = '18px';
livesDisplay.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
livesDisplay.style.letterSpacing = '1px';
livesDisplay.style.border = '2px solid #fffbe7';

document.body.appendChild(scoreDisplay);
document.body.appendChild(livesDisplay);

// Animation and sound functions
function animateJump() {
    frog.animate([
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-12px)' },
        { transform: 'translateY(0px)' }
    ], {
        duration: 180,
        easing: 'ease-out'
    });
}

const jumpSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9c7b2b.mp3');
const hitSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9c7b2b.mp3');
const goalSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9c7b2b.mp3');

function setInvulnerableEffect(on) {
    frog.style.filter = on ? 'brightness(1.5) drop-shadow(0 0 8px gold)' : '';
}

function updateBackground() {
    const colors = [
        '#22428b', '#1e5631', '#3a3a3a', '#8b5e22', '#2e8b8b', '#8b2242'
    ];
    document.body.style.background = colors[(level - 1) % colors.length];
}

// Game logic functions
function checkCollision() {
    if (isInvulnerable) return;

    const frogRect = frog.getBoundingClientRect();
    const obstacle1Rect = obstacle1.getBoundingClientRect();
    const obstacle2Rect = obstacle2.getBoundingClientRect();
    const obstacle3Rect = obstacle3.getBoundingClientRect();

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
        level >= 3 && // Only check obstacle3 collision from level 3 onwards
        frogRect.left < obstacle3Rect.right &&
        frogRect.right > obstacle3Rect.left &&
        frogRect.top < obstacle3Rect.bottom &&
        frogRect.bottom > obstacle3Rect.top
    ) {
        endGame('You hit obstacle 3!');
    }
}

function checkGoal() {
    const frogRect = frog.getBoundingClientRect();
    const goalRect = goal.getBoundingClientRect();

    // Prevent immediate goal crossing by checking if frog is at starting position
    if (frogY === 350 && frogX === 180) return;

    if (
        frogRect.left < goalRect.right &&
        frogRect.right > goalRect.left &&
        frogRect.top < goalRect.bottom &&
        frogRect.bottom > goalRect.top
    ) {
        handleGoalCrossed();
    }
}

// Create message box above the game screen
const messageBox = document.createElement('div');
messageBox.id = 'messageBox';
messageBox.style.position = 'absolute';
messageBox.style.top = '0';
messageBox.style.left = '50%';
messageBox.style.transform = 'translateX(-50%)';
messageBox.style.background = 'rgba(34, 66, 139, 0.95)';
messageBox.style.color = '#fffbe7';
messageBox.style.fontFamily = "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Arial Rounded MT Bold', Arial, sans-serif";
messageBox.style.fontSize = '26px';
messageBox.style.padding = '14px 36px';
messageBox.style.borderRadius = '16px';
messageBox.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
messageBox.style.border = '2px solid #fffbe7';
messageBox.style.zIndex = '1000';
messageBox.style.display = 'none';
document.body.appendChild(messageBox);

function showMessage(msg, duration = 1800) {
    messageBox.textContent = msg;
    messageBox.style.display = 'block';
    clearTimeout(showMessage._timeout);
    showMessage._timeout = setTimeout(() => {
        messageBox.style.display = 'none';
    }, duration);
}

function handleGoalCrossed() {
    goalSound.currentTime = 0; 
    goalSound.play();
    
    // Increase speed up to MAX_SPEED, then add other difficulty factors
    if (gameSpeed < MAX_SPEED) {
        gameSpeed += 1;
    } else {
        // After reaching max speed, increase score bonus instead
        score += Math.floor(level * 1.5);
    }
    
    level += 1;
    score += 100;

    frogX = 180;
    frogY = 350;
    obstacle1X = 0;
    obstacle2X = 20;
    obstacle3Y = 150;
    obstacle3Direction = 1;

    frog.style.left = frogX + 'px';
    frog.style.top = frogY + 'px';
    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';
    obstacle3.style.top = obstacle3Y + 'px';

    let levelUpMessage = `Level up! ${gameSpeed < MAX_SPEED ? 'Speed increased!' : 'Bonus points!'}`;
    
    // Show obstacle3 starting from level 3 with special message
    if (level === 3) {
        obstacle3.style.display = '';
        levelUpMessage = 'Level up! Added third obstacle!';
    }

    scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
    updateBackground();
    
    // Special level-up effects
    if (level > 3) {
        // Flash the frog for higher levels
        frog.animate([
            { filter: 'brightness(2)' },
            { filter: 'brightness(1)' }
        ], {
            duration: 300,
            iterations: 3
        });
    }
    
    showMessage(levelUpMessage);
}

function endGame(message) {
    if (isInvulnerable || gameOver) return;

    hitSound.currentTime = 0; 
    hitSound.play();
    setInvulnerableEffect(true);
    
    lives -= 1;
    const penalty = Math.floor(Math.random() * 51) + 50;
    score = Math.max(0, score - penalty);
    livesDisplay.textContent = `Lives: ${lives}`;
    scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
    isInvulnerable = true;

    obstacle1X = 0;
    obstacle2X = 20;
    obstacle3Y = 150;
    obstacle3Direction = 1;
    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';
    obstacle3.style.top = obstacle3Y + 'px';

    showMessage(`${message}\nScore penalty: -${penalty}`);

    if (lives <= 0) {
        frog.style.display = 'none';
        goal.style.display = 'none';
        obstacle1.style.display = 'none';
        obstacle2.style.display = 'none';
        obstacle3.style.display = 'none';
        scoreDisplay.style.display = 'none';
        livesDisplay.style.display = 'none';

        gameOver = true;

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

        retryBtn.onclick = function() {
            document.body.removeChild(gameOverScreen);

            frogX = 180;
            frogY = 350;
            obstacle1X = 0;
            obstacle2X = 20;
            obstacle3Y = 150;
            obstacle3Direction = 1;
            score = 0;
            lives = 3;
            gameSpeed = 2;
            level = 1;
            isInvulnerable = false;

            frog.style.display = '';
            goal.style.display = '';
            obstacle1.style.display = '';
            obstacle2.style.display = '';
            obstacle3.style.display = 'none'; // Reset to hidden
            scoreDisplay.style.display = '';
            livesDisplay.style.display = '';

            frog.style.left = frogX + 'px';
            frog.style.top = frogY + 'px';
            obstacle1.style.left = obstacle1X + 'px';
            obstacle2.style.left = obstacle2X + 'px';
            obstacle3.style.top = obstacle3Y + 'px';

            scoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
            livesDisplay.textContent = `Lives: ${lives}`;

            gameOver = false;
            updateBackground();
            gameLoop();
        };

        gameOverScreen.appendChild(title);
        gameOverScreen.appendChild(points);
        gameOverScreen.appendChild(retryBtn);
        document.body.appendChild(gameOverScreen);
    } else {
        frogX = 180;
        frogY = 350;
        frog.style.left = frogX + 'px';
        frog.style.top = frogY + 'px';

        setTimeout(() => {
            isInvulnerable = false;
            setInvulnerableEffect(false);
        }, 1000);
    }
}

// Single keyboard event listener
document.addEventListener('keydown', function(event) {
    if (gameOver) return;
    if (event.repeat) return;

    let moved = false;
    if (event.code === 'KeyW' || event.code === 'ArrowUp') {
        frogY -= 10;
        moved = true;
        animateJump();
        jumpSound.currentTime = 0; 
        jumpSound.play();
    }
    if (event.code === 'KeyS' || event.code === 'ArrowDown') {
        frogY += 10;
        moved = true;
    }
    if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        frogX -= 10;
        moved = true;
    }
    if (event.code === 'KeyD' || event.code === 'ArrowRight') {
        frogX += 10;
        moved = true;
    }
    if (!moved) return;

    frogX = Math.max(0, Math.min(frogX, 360));
    frogY = Math.max(0, Math.min(frogY, 360));

    frog.style.left = frogX + 'px';
    frog.style.top = frogY + 'px';

    checkGoal();
    checkCollision();
});

// Game loop
function gameLoop() {
    if (gameOver) return;

    // Move horizontal obstacles
    obstacle1X += gameSpeed;
    obstacle2X -= gameSpeed;

    // Move vertical obstacle only if level >= 3
    if (level >= 3) {
        obstacle3Y += gameSpeed * obstacle3Direction;
        
        // Change direction if hitting top or bottom
        if (obstacle3Y >= 300) {
            obstacle3Direction = -1;
        } else if (obstacle3Y <= 50) {
            obstacle3Direction = 1;
        }
    }

    const obstacleWidth1 = obstacle1.offsetWidth || 40;
    const obstacleWidth2 = obstacle2.offsetWidth || 40;

    if (obstacle1X > 400) obstacle1X = -obstacleWidth1;
    if (obstacle2X < -obstacleWidth2) obstacle2X = 400;

    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';
    obstacle3.style.top = obstacle3Y + 'px';

    checkCollision();

    requestAnimationFrame(gameLoop);
}

// Initialize game
updateBackground();
gameLoop();