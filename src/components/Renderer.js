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
}
