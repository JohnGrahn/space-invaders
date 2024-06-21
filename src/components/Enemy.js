export class Enemy {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 1;
    this.direction = 1;
  }

  update() {
    this.x += this.speed * this.direction;
    if (this.x <= 0 || this.x + this.width >= 800) {
      this.direction *= -1;
      this.y += this.height;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
