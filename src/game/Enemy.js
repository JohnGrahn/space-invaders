// src/components/Enemy.js
export class Enemy {
  constructor(x, y, type, speed = 1) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.type = type;
    this.speed = speed;
    this.image = new Image();
    this.image.src = `/assets/${type}.svg`;
  }

  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
  }
}
