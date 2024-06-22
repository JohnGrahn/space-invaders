// src/components/Enemy.js
export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.image = new Image();
    this.image.src = '/assets/enemy.svg';
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
