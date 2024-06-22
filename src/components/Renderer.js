export class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
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
  
    drawUI(score, lives) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        
        // Draw score
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${score}`, 10, 30);
        
        // Draw lives
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Lives: ${lives}`, this.canvas.width - 10, 30);
        
        // Reset text alignment to left (default)
        this.ctx.textAlign = 'left';
      }
  
      drawGameOverMessage(hasWon) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        if (hasWon) {
          this.ctx.fillText('Congratulations!', this.canvas.width / 2, this.canvas.height / 2 - 50);
          this.ctx.fillText('You Won!', this.canvas.width / 2, this.canvas.height / 2 + 10);
        } else {
          this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
          this.ctx.fillText('You Lose', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Click to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        // Reset text alignment to left (default)
        this.ctx.textAlign = 'left';
      }
  }
  