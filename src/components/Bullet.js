// src/components/Bullet.js
export class Bullet {
  constructor(x, y, speed, isPlayerBullet) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = speed;
    this.isPlayerBullet = isPlayerBullet;
    this.image = new Image();
    this.image.src = './assets/bullet.svg';
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
  }
}
