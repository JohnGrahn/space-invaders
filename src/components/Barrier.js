export class Barrier {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
    }

    createGrid() {
        const grid = [];
        const cellSize = 5; // Size of each destructible cell
        for (let y = 0; y < this.height; y += cellSize) {
            for (let x = 0; x < this.width; x += cellSize) {
                grid.push({ x, y, destroyed: false });
            }
        }
        return grid;
    }

    checkCollision(bullet) {
        if (bullet.x >= this.x && bullet.x <= this.x + this.width &&
            bullet.y >= this.y && bullet.y <= this.y + this.height) {
            const cellX = Math.floor((bullet.x - this.x) / 5);
            const cellY = Math.floor((bullet.y - this.y) / 5);
            const index = cellY * (this.width / 5) + cellX;
            if (index >= 0 && index < this.grid.length && !this.grid[index].destroyed) {
                this.grid[index].destroyed = true;
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        this.grid.forEach(cell => {
            if (!cell.destroyed) {
                ctx.fillRect(this.x + cell.x, this.y + cell.y, 5, 5);
            }
        });
    }
}
