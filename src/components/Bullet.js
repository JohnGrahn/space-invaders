export class Bullet {
  constructor(x, y, speed, color) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = speed;
    this.color = color;
  }

  update() {
    this.y -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
