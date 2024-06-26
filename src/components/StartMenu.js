export class StartMenu {
    constructor(canvas) {
      this.canvas = canvas;
      this.buttonWidth = 200;
      this.buttonHeight = 50;
      this.buttonX = (canvas.width - this.buttonWidth) / 2;
      this.buttonY = (canvas.height - this.buttonHeight) / 2;
    }
  
    draw(ctx) {
      // Draw background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Draw title
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Space Invaders', this.canvas.width / 2, this.canvas.height / 3);
  
      // Draw start button
      ctx.fillStyle = 'green';
      ctx.fillRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
  
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Start Game', this.canvas.width / 2, this.canvas.height / 2);
    }
  
    isStartButtonClicked(x, y) {
      return (
        x >= this.buttonX &&
        x <= this.buttonX + this.buttonWidth &&
        y >= this.buttonY &&
        y <= this.buttonY + this.buttonHeight
      );
    }
  }
  