export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  drawBackground(groundHeight) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - groundHeight);
    this.ctx.fillStyle = '#4a6741';
    this.ctx.fillRect(0, this.canvas.height - groundHeight, this.canvas.width, groundHeight);
  }

  drawEntities(player, enemyController, bullets) {
    player.draw(this.ctx);
    enemyController.enemies.forEach(enemy => enemy.draw(this.ctx));
    bullets.forEach(bullet => bullet.draw(this.ctx));
  }

  drawUI(score, lives, currentWave) {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${score}`, 10, 30);
    this.ctx.fillText(`Wave: ${currentWave}`, 10, 60);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${lives}`, this.canvas.width - 10, 30);
  }

  drawGameOverMessage(hasWon) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.font = '48px Arial';
    if (hasWon) {
      this.ctx.fillText('Congratulations!', this.centerX, this.centerY - 50);
      this.ctx.fillText('You Won!', this.centerX, this.centerY + 10);
    } else {
      this.ctx.fillText('Game Over', this.centerX, this.centerY - 50);
      this.ctx.fillText('You Lose', this.centerX, this.centerY + 10);
    }
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Click to Play Again', this.centerX, this.centerY + 60);
  }

  drawWaveClearedMessage(nextWave) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.font = '48px Arial';
    this.ctx.fillText(`Wave ${nextWave - 1} Cleared!`, this.centerX, this.centerY - 50);
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Prepare for Wave ${nextWave}`, this.centerX, this.centerY + 10);
    this.ctx.fillText('Next wave starting soon...', this.centerX, this.centerY + 50);
  }

  drawPauseOverlay(audioManager) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.centerX, this.centerY - 50);

    // Draw volume control
    this.drawVolumeControl(this.centerX - 100, this.centerY - 10, 200, audioManager);
    
    this.drawButton('Restart', this.centerX - 100, this.centerY + 50, 200, 50);
    this.drawButton('End Game', this.centerX - 100, this.centerY + 120, 200, 50);
  }

  drawVolumeControl(x, y, width, audioManager) {
    // Draw volume label
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Volume:', x, y + 15);

    // Draw slider background
    const sliderX = x + 80;
    const sliderWidth = width - 80;
    const sliderHeight = 4;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(sliderX, y + 10, sliderWidth, sliderHeight);

    // Draw slider fill
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(sliderX, y + 10, sliderWidth * audioManager.volume, sliderHeight);

    // Draw slider handle
    const handleX = sliderX + (sliderWidth * audioManager.volume);
    const handleY = y + 12;
    const handleRadius = 8;
    
    this.ctx.beginPath();
    this.ctx.arc(handleX, handleY, handleRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
  }

  isVolumeSliderClicked(x, y, mouseX, mouseY) {
    const sliderX = x + 80;
    const sliderWidth = 120;
    const sliderY = y + 2;
    const sliderHeight = 20;

    return mouseX >= sliderX && mouseX <= sliderX + sliderWidth &&
           mouseY >= sliderY && mouseY <= sliderY + sliderHeight;
  }

  getVolumeFromClick(x, mouseX) {
    const sliderX = x + 80;
    const sliderWidth = 120;
    return Math.max(0, Math.min(1, (mouseX - sliderX) / sliderWidth));
  }

  drawButton(text, x, y, width, height) {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(x, y, width, height);
    this.ctx.fillStyle = 'black';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x + width / 2, y + height / 2 + 8);
  }
}
