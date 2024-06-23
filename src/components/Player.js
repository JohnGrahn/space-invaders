import { Bullet } from './Bullet.js';

export class Player {
  constructor(canvas, groundHeight) {
    this.canvas = canvas;
    this.width = 50;
    this.height = 50;
    this.groundHeight = groundHeight;
    this.speed = 5;
    this.cooldown = 0;
    this.maxCooldown = 30;
    this.bulletSpeed = -5;

    this.reset();

    this.image = new Image();
    this.image.src = './assets/player.svg';
  }

  moveLeft() {
    this.x = Math.max(0, this.x - this.speed);
  }

  moveRight() {
    this.x = Math.min(this.canvas.width - this.width, this.x + this.speed);
  }

  update() {
    if (this.cooldown > 0) this.cooldown--;
  }

  shoot() {
    if (this.cooldown === 0) {
      this.cooldown = this.maxCooldown;
      return new Bullet(this.x + this.width / 2, this.y, this.bulletSpeed, true);
    }
    return null;
  }

  reset() {
    this.x = this.canvas.width / 2 - this.width / 2;
    this.y = this.canvas.height - this.height - this.groundHeight + 10;
    // You might want to add invincibility frames here
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Uncomment the following lines to debug the player's position
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
