export class Bullet {
  constructor(x, y, speed, isPlayerBullet) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = speed;
    this.isPlayerBullet = isPlayerBullet;

    if (isPlayerBullet) {
      this.image = new Image();
      this.image.src = './assets/bullet.svg';
    }
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    if (this.isPlayerBullet) {
      ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
    } else {
      // Draw lightning bolt for enemy bullet
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - 3, this.y + 5);
      ctx.lineTo(this.x + 2, this.y + 8);
      ctx.lineTo(this.x - 1, this.y + 15);
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
