export class AudioManager {
    constructor() {
        this.isMuted = false;
        this.volume = this.loadVolume();
        this.shootSound = new Audio('./assets/shoot.wav');
        this.invaderKilledSound = new Audio('./assets/invaderkilled.wav');
        this.explosionSound = new Audio('./assets/explosion.wav');
        this.loadSounds();
    }

    loadSounds() {
        // Pre-load sounds
        this.shootSound.load();
        this.invaderKilledSound.load();
        this.explosionSound.load();
        this.shootSound.volume = this.volume;
        this.invaderKilledSound.volume = this.volume;
        this.explosionSound.volume = this.volume;
    }

    loadVolume() {
        const savedVolume = localStorage.getItem('gameVolume');
        return savedVolume !== null ? parseFloat(savedVolume) : 0.7; // Default to 70% volume
    }

    saveVolume() {
        localStorage.setItem('gameVolume', this.volume.toString());
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value)); // Clamp between 0 and 1
        this.shootSound.volume = this.volume;
        this.invaderKilledSound.volume = this.volume;
        this.explosionSound.volume = this.volume;
        this.saveVolume();
    }

    playShootSound() {
        if (!this.isMuted) {
            // Clone the audio to allow multiple simultaneous plays
            const sound = this.shootSound.cloneNode();
            sound.volume = this.volume;
            sound.play();
        }
    }

    playInvaderKilledSound() {
        if (!this.isMuted) {
            // Clone the audio to allow multiple simultaneous plays
            const sound = this.invaderKilledSound.cloneNode();
            sound.volume = this.volume;
            sound.play();
        }
    }

    playExplosionSound() {
        if (!this.isMuted) {
            // Clone the audio to allow multiple simultaneous plays
            const sound = this.explosionSound.cloneNode();
            sound.volume = this.volume;
            sound.play();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }

    drawMuteButton(ctx, x, y) {
        const size = 30;
        ctx.save();
        
        // Draw button background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.fill();

        // Draw speaker icon
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        
        // Speaker body (filled triangle and rectangle)
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 11);  // Top of speaker
        ctx.lineTo(x + 14, y + 11); // Top of rectangle
        ctx.lineTo(x + 14, y + 19); // Bottom of rectangle
        ctx.lineTo(x + 8, y + 19);  // Bottom of speaker
        ctx.lineTo(x + 8, y + 11);  // Back to top
        ctx.fill();
        
        // Speaker cone (triangle)
        ctx.beginPath();
        ctx.moveTo(x + 14, y + 15);  // Center point
        ctx.lineTo(x + 14, y + 11);  // Top point
        ctx.lineTo(x + 20, y + 8);   // Top right
        ctx.lineTo(x + 20, y + 22);  // Bottom right
        ctx.lineTo(x + 14, y + 19);  // Bottom point
        ctx.closePath();
        ctx.fill();
        
        if (!this.isMuted) {
            // Sound waves
            ctx.beginPath();
            // First wave
            ctx.moveTo(x + 22, y + 11);
            ctx.quadraticCurveTo(x + 24, y + 15, x + 22, y + 19);
            // Second wave
            ctx.moveTo(x + 24, y + 9);
            ctx.quadraticCurveTo(x + 27, y + 15, x + 24, y + 21);
            ctx.stroke();
        } else {
            // X mark
            ctx.beginPath();
            ctx.moveTo(x + 22, y + 11);
            ctx.lineTo(x + 28, y + 19);
            ctx.moveTo(x + 28, y + 11);
            ctx.lineTo(x + 22, y + 19);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    isMuteButtonClicked(clickX, clickY, buttonX, buttonY) {
        const size = 30;
        const distance = Math.sqrt(
            Math.pow(clickX - (buttonX + size/2), 2) + 
            Math.pow(clickY - (buttonY + size/2), 2)
        );
        return distance <= size/2;
    }
} 