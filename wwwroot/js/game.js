// Flappy Bird Oyun JavaScript Kodu
let gameCanvas, ctx;
let bird, pipes, score;
let gameRunning = false;
let gamePaused = false;
let animationId;

// Görseller
let backgroundImg, baseImg, pipeImg, birdImgs = [];
let gameoverImg, messageImg, numberImgs = [];
let imagesLoaded = 0;
const totalImages = 17; // 6 orijinal + 1 gameover + 1 message + 9 sayı

// Sesler
let wingSound, pointSound, hitSound, dieSound, swooshSound;
let soundsLoaded = 0;
const totalSounds = 5;

// Rekor skor
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;

// Oyun nesneleri
const birdObj = {
    x: 100,
    y: 250,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.3,  // Daha yavaş düşme
    jumpPower: -6  // Daha yumuşak zıplama
};

const pipeObj = {
    width: 60,
    gap: 150,  // Biraz daha açık aralık
    speed: 1.5  // Daha yavaş hareket
};

// Oyun başlatma
window.initializeGame = function() {
    gameCanvas = document.getElementById('gameCanvas');
    ctx = gameCanvas.getContext('2d');
    
    // Oyun alanına odaklan
    gameCanvas.focus();
    
    // Görselleri ve sesleri yükle
    loadImages();
    loadSounds();
};

// Görselleri yükle
function loadImages() {
    // Arka plan
    backgroundImg = new Image();
    backgroundImg.onload = imageLoaded;
    backgroundImg.src = 'images/background-day.png';
    
    // Zemin
    baseImg = new Image();
    baseImg.onload = imageLoaded;
    baseImg.src = 'images/base.png';
    
    // Boru
    pipeImg = new Image();
    pipeImg.onload = imageLoaded;
    pipeImg.src = 'images/pipe-green.png';
    
    // Kuş animasyonları
    birdImgs[0] = new Image();
    birdImgs[0].onload = imageLoaded;
    birdImgs[0].src = 'images/yellowbird-upflap.png';
    
    birdImgs[1] = new Image();
    birdImgs[1].onload = imageLoaded;
    birdImgs[1].src = 'images/yellowbird-midflap.png';
    
    birdImgs[2] = new Image();
    birdImgs[2].onload = imageLoaded;
    birdImgs[2].src = 'images/yellowbird-downflap.png';
    
    // UI görselleri
    gameoverImg = new Image();
    gameoverImg.onload = imageLoaded;
    gameoverImg.src = 'images/gameover.png';
    
    messageImg = new Image();
    messageImg.onload = imageLoaded;
    messageImg.src = 'images/message.png';
    
    // Sayı görselleri
    for (let i = 0; i < 10; i++) {
        numberImgs[i] = new Image();
        numberImgs[i].onload = imageLoaded;
        numberImgs[i].src = `images/Numbers/${i}.png`;
    }
}

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages && soundsLoaded === totalSounds) {
        // Tüm görseller ve sesler yüklendi
        resetGame();
        draw();
    }
}

// Sesleri yükle
function loadSounds() {
    wingSound = new Audio('sounds/wing.wav');
    wingSound.volume = 0.3; // Ses seviyesini düşür
    wingSound.oncanplaythrough = soundLoaded;
    
    pointSound = new Audio('sounds/point.wav');
    pointSound.oncanplaythrough = soundLoaded;
    
    hitSound = new Audio('sounds/hit.wav');
    hitSound.oncanplaythrough = soundLoaded;
    
    dieSound = new Audio('sounds/die.wav');
    dieSound.oncanplaythrough = soundLoaded;
    
    swooshSound = new Audio('sounds/swoosh.wav');
    swooshSound.oncanplaythrough = soundLoaded;
}

function soundLoaded() {
    soundsLoaded++;
    if (imagesLoaded === totalImages && soundsLoaded === totalSounds) {
        // Tüm görseller ve sesler yüklendi
        resetGame();
        draw();
    }
}

// Yeni oyun başlat
window.startNewGame = function() {
    resetGame();
    gameRunning = true;
    gamePaused = false;
    gameLoop();
};

// Başlangıç mesajı göster
function drawStartMessage() {
    if (messageImg && messageImg.complete) {
        const imgWidth = 200;
        const imgHeight = 100;
        const x = (gameCanvas.width - imgWidth) / 2;
        const y = (gameCanvas.height - imgHeight) / 2;
        ctx.drawImage(messageImg, x, y, imgWidth, imgHeight);
    } else {
        // Fallback metin
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Başlamak için SPACE tuşuna basın', gameCanvas.width / 2, gameCanvas.height / 2);
    }
}

// Oyunu sıfırla
function resetGame() {
    bird = { ...birdObj };
    pipes = [];
    score = 0;
    gameRunning = false;
    gamePaused = false;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // İlk boruyu hemen ekle
    addPipe();
    
    draw();
}

// Kuş zıplama
window.jumpBird = function() {
    if (gameRunning && !gamePaused) {
        bird.velocity = bird.jumpPower;
        // Kanat sesi
        if (wingSound) {
            wingSound.currentTime = 0;
            wingSound.play().catch(e => console.log('Ses çalınamadı:', e));
        }
    }
};

// Duraklat/Devam
window.togglePause = function(paused) {
    gamePaused = paused;
    if (gameRunning && !gamePaused) {
        gameLoop();
    }
};

// Ana oyun döngüsü
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    update();
    draw();
    
    if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Oyun güncelleme
function update() {
    if (!gameRunning || gamePaused) return;
    
    // Kuş fiziği
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Yeni boru ekleme
    if (pipes.length === 0 || pipes[pipes.length - 1].x < gameCanvas.width - 200) {
        addPipe();
    }
    
    // Boruları güncelle
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeObj.speed;
        
        // Skor artırma
        if (pipes[i].x + pipeObj.width < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
            // Puan sesi
            if (pointSound) {
                pointSound.currentTime = 0;
                pointSound.play().catch(e => console.log('Ses çalınamadı:', e));
            }
            DotNet.invokeMethodAsync('FlappyBird', 'UpdateScore', score);
        }
        
        // Ekrandan çıkan boruları sil
        if (pipes[i].x + pipeObj.width < 0) {
            pipes.splice(i, 1);
        }
    }
    
    // Çarpışma kontrolü
    if (checkCollision()) {
        gameOver();
    }
}

// Yeni boru ekle
function addPipe() {
    const minHeight = 80;  // Daha yüksek minimum yükseklik
    const maxHeight = gameCanvas.height - pipeObj.gap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: gameCanvas.width,
        topHeight: topHeight,
        bottomY: topHeight + pipeObj.gap,
        scored: false
    });
}

// Çarpışma kontrolü
function checkCollision() {
    // Zemin kontrolü - sadece zemin görseline değdiğinde
    const baseHeight = 112; // base.png yüksekliği
    const groundY = gameCanvas.height - baseHeight;
    if (bird.y + bird.height > groundY) {
        return true;
    }
    
    // Tavan kontrolü
    if (bird.y < 0) {
        return true;
    }
    
    // Boru çarpışma kontrolü - daha toleranslı
    for (let pipe of pipes) {
        if (bird.x + 5 < pipe.x + pipeObj.width - 5 &&
            bird.x + bird.width - 5 > pipe.x + 5 &&
            (bird.y + 5 < pipe.topHeight - 5 || bird.y + bird.height - 5 > pipe.bottomY + 5)) {
            return true;
        }
    }
    
    return false;
}

// Oyun bitişi
function gameOver() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Çarpışma sesi
    if (hitSound) {
        hitSound.currentTime = 0;
        hitSound.play().catch(e => console.log('Ses çalınamadı:', e));
    }
    
    // Ölüm sesi (biraz gecikmeli)
    setTimeout(() => {
        if (dieSound) {
            dieSound.currentTime = 0;
            dieSound.play().catch(e => console.log('Ses çalınamadı:', e));
        }
    }, 100);
    
    // Rekor kontrolü
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyBirdHighScore', highScore);
    }
    
    // Game over ekranını çiz
    drawGameOverScreen();
    
    DotNet.invokeMethodAsync('FlappyBird', 'GameEnded', highScore);
}

// Game over ekranı
function drawGameOverScreen() {
    // Arka plan
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Game over görseli
    if (gameoverImg && gameoverImg.complete) {
        const imgWidth = 200;
        const imgHeight = 50;
        const x = (gameCanvas.width - imgWidth) / 2;
        const y = (gameCanvas.height - imgHeight) / 2 - 50;
        ctx.drawImage(gameoverImg, x, y, imgWidth, imgHeight);
    } else {
        // Fallback metin
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('OYUN BİTTİ', gameCanvas.width / 2, gameCanvas.height / 2 - 50);
    }
    
    // Skor gösterimi
    if (numberImgs[0] && numberImgs[0].complete) {
        drawNumberScore(score, gameCanvas.width / 2, gameCanvas.height / 2 + 20);
    } else {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Skor: ${score}`, gameCanvas.width / 2, gameCanvas.height / 2 + 20);
    }
    
    // Rekor gösterimi
    if (highScore > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Rekor: ${highScore}`, gameCanvas.width / 2, gameCanvas.height / 2 + 60);
    }
}

// Çizim fonksiyonu
function draw() {
    // Arka plan görseli
    if (backgroundImg && backgroundImg.complete) {
        ctx.drawImage(backgroundImg, 0, 0, gameCanvas.width, gameCanvas.height);
    } else {
        // Fallback gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, gameCanvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#87CEEB');
        gradient.addColorStop(0.7, '#90EE90');
        gradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
    
    // Borular
    drawPipes();
    
    // Kuş
    drawBird();
    
    // Zemin
    drawBase();
    
    // Skor
    drawScore();
    
    // Duraklat mesajı
    if (gamePaused) {
        drawPauseMessage();
    }
    
    // Başlangıç mesajı (oyun başlamadan önce)
    if (!gameRunning && !gamePaused) {
        drawStartMessage();
    }
}

// Bulut çizimi
function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
        const x = (i * 200 + Date.now() * 0.01) % (gameCanvas.width + 100);
        const y = 50 + i * 30;
        drawCloud(x, y);
    }
}

// Bulut şekli
function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Boru çizimi
function drawPipes() {
    if (pipeImg && pipeImg.complete) {
        for (let pipe of pipes) {
            // Üst boru (ters çevrilmiş)
            ctx.save();
            ctx.translate(pipe.x + pipeObj.width/2, pipe.topHeight);
            ctx.scale(1, -1);
            ctx.drawImage(pipeImg, -pipeObj.width/2, 0, pipeObj.width, pipe.topHeight);
            ctx.restore();
            
            // Alt boru
            ctx.drawImage(pipeImg, pipe.x, pipe.bottomY, pipeObj.width, gameCanvas.height - pipe.bottomY);
        }
    } else {
        // Fallback çizim
        ctx.fillStyle = '#228B22';
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 3;
        
        for (let pipe of pipes) {
            // Üst boru
            ctx.fillRect(pipe.x, 0, pipeObj.width, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, pipeObj.width, pipe.topHeight);
            
            // Alt boru
            ctx.fillRect(pipe.x, pipe.bottomY, pipeObj.width, gameCanvas.height - pipe.bottomY);
            ctx.strokeRect(pipe.x, pipe.bottomY, pipeObj.width, gameCanvas.height - pipe.bottomY);
        }
    }
}

// Kuş çizimi
function drawBird() {
    if (birdImgs[0] && birdImgs[0].complete) {
        // Animasyon frame'i seç
        let frame = 0;
        if (bird.velocity < -2) frame = 0; // Yukarı
        else if (bird.velocity > 2) frame = 2; // Aşağı
        else frame = 1; // Orta
        
        ctx.drawImage(birdImgs[frame], bird.x, bird.y, bird.width, bird.height);
    } else {
        // Fallback çizim
        ctx.save();
        ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
        
        // Kuş gövdesi
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(0, 0, bird.width/2, bird.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Kuş kanatları
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.ellipse(-5, -5, 8, 12, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Kuş gözü
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(5, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Kuş gagası
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(18, -2);
        ctx.lineTo(18, 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

// Zemin çizimi
function drawBase() {
    if (baseImg && baseImg.complete) {
        // Zemin görselini tekrarla
        const baseHeight = 112; // base.png yüksekliği
        const baseY = gameCanvas.height - baseHeight;
        
        // Zemin görselini yatay olarak tekrarla
        for (let x = 0; x < gameCanvas.width; x += baseImg.width) {
            ctx.drawImage(baseImg, x, baseY);
        }
    } else {
        // Fallback zemin
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 50);
    }
}

// Skor çizimi
function drawScore() {
    // Sayı görselleri ile skor çizimi
    if (numberImgs[0] && numberImgs[0].complete) {
        drawNumberScore(score, gameCanvas.width / 2, 60);
    } else {
        // Fallback metin skor
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(score.toString(), gameCanvas.width / 2, 60);
    }
    
    // Rekor skor
    if (highScore > 0) {
        ctx.fillStyle = '#7f8c8d';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Rekor: ${highScore}`, 20, 30);
    }
}

// Sayı görselleri ile skor çizimi
function drawNumberScore(num, x, y) {
    const numStr = num.toString();
    const digitWidth = 24;
    const totalWidth = numStr.length * digitWidth;
    const startX = x - totalWidth / 2;
    
    for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i]);
        if (numberImgs[digit] && numberImgs[digit].complete) {
            ctx.drawImage(numberImgs[digit], startX + i * digitWidth, y - 20, digitWidth, 40);
        }
    }
}

// Duraklat mesajı
function drawPauseMessage() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DURAKLADI', gameCanvas.width / 2, gameCanvas.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('Devam etmek için SPACE tuşuna basın', gameCanvas.width / 2, gameCanvas.height / 2 + 50);
}

// Klavye olayları
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        window.jumpBird();
    }
});
