export class Barrier {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.cellSize = 5; // Size of each destructible cell
      this.grid = this.createGrid();
    }
  
    createGrid() {
      const grid = [];
      for (let y = 0; y < this.height; y += this.cellSize) {
        for (let x = 0; x < this.width; x += this.cellSize) {
          grid.push({ x, y, destroyed: false });
        }
      }
      return grid;
    }
  
    checkCollision(entity) {
      if (entity.x + entity.width > this.x && entity.x < this.x + this.width &&
          entity.y + entity.height > this.y && entity.y < this.y + this.height) {
        
        const startX = Math.max(0, Math.floor((entity.x - this.x) / this.cellSize));
        const endX = Math.min(this.width / this.cellSize, Math.ceil((entity.x + entity.width - this.x) / this.cellSize));
        const startY = Math.max(0, Math.floor((entity.y - this.y) / this.cellSize));
        const endY = Math.min(this.height / this.cellSize, Math.ceil((entity.y + entity.height - this.y) / this.cellSize));
  
        let collided = false;
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const index = y * (this.width / this.cellSize) + x;
            if (index >= 0 && index < this.grid.length && !this.grid[index].destroyed) {
              this.grid[index].destroyed = true;
              collided = true;
            }
          }
        }
        return collided;
      }
      return false;
    }
  
    isDestroyed() {
      return this.grid.every(cell => cell.destroyed);
    }
  
    draw(ctx) {
      ctx.fillStyle = 'green';
      this.grid.forEach(cell => {
        if (!cell.destroyed) {
          ctx.fillRect(this.x + cell.x, this.y + cell.y, this.cellSize, this.cellSize);
        }
      });
    }
  }
  