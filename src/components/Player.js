// src/components/Player.js
import { Bullet } from './Bullet.js';

export class Player {
  constructor(canvas, groundHeight) {
    this.canvas = canvas;
    this.width = 50;
    this.height = 50;
    this.x = canvas.width / 2 - this.width / 2;
    this.groundHeight = groundHeight;
    this.y = canvas.height - this.height - this.groundHeight + 10; // Adjust this value as needed
    this.speed = 5;
    this.image = new Image();
    this.image.src = './assets/player.svg';
    this.cooldown = 0;
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
      this.cooldown = 30;
      return new Bullet(this.x + this.width / 2, this.y, -5, true);
    }
    return null;
  }

  reset() {
    this.x = this.canvas.width / 2 - this.width / 2;
    // You might want to add invincibility frames here
  }

  draw(ctx) {
    // Draw the player image
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Uncomment the following lines to debug the player's position
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
