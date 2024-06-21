import { Bullet } from './Bullet.js';

export class Player {
  constructor(canvas, game) {  // Added 'game' parameter
    this.canvas = canvas;
    this.game = game;  // Store the game instance
    this.width = 50;
    this.height = 50;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.speed = 5;
    this.color = 'blue';

    this.moveLeft = false;
    this.moveRight = false;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowLeft') this.moveLeft = true;
    if (e.key === 'ArrowRight') this.moveRight = true;
    if (e.key === ' ') this.shoot();  // Added shooting on spacebar
  }

  handleKeyUp(e) {
    if (e.key === 'ArrowLeft') this.moveLeft = false;
    if (e.key === 'ArrowRight') this.moveRight = false;
  }

  update() {
    if (this.moveLeft && this.x > 0) this.x -= this.speed;
    if (this.moveRight && this.x < this.canvas.width - this.width) this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  shoot() {  // New method for shooting
    const bullet = new Bullet(
      this.x + this.width / 2 - 2.5,
      this.y,
      10,
      'yellow'
    );
    this.game.bullets.push(bullet);
  }
}
