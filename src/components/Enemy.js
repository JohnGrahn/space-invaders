export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 1;
    this.direction = 1;
    this.image = new Image();
    this.image.src = '/assets/enemy.svg';
  }

  update() {
    this.x += this.speed * this.direction;
    if (this.x <= 0 || this.x + this.width >= 800) {
      this.direction *= -1;
      this.y += this.height;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
