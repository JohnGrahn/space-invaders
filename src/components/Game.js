import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Bullet } from "./Bullet.js";
import { checkCollision } from "../utils/collision.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = new Player(this.canvas, this);  // Pass 'this' as the game instance
    this.enemies = [];
    this.bullets = [];
    this.score = 0;
    this.lives = 3;
  }

  start() {
    this.spawnEnemies();
    this.gameLoop();
  }

  spawnEnemies() {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        const enemy = new Enemy(
          30 + col * 60,
          30 + row * 60,
          40,
          40,
          'red'
        );
        this.enemies.push(enemy);
      }
    }
  }

  update() {
    this.player.update();
    this.enemies.forEach(enemy => enemy.update());
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.y < 0 || bullet.y > this.canvas.height) {
        this.bullets.splice(index, 1);
      }
    });
    this.checkCollisions();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.ctx);
    this.enemies.forEach(enemy => enemy.draw(this.ctx));
    this.bullets.forEach(bullet => bullet.draw(this.ctx));
    this.drawScore();
    this.drawLives();
  }

  checkCollisions() {
    this.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach((enemy, enemyIndex) => {
        if (checkCollision(bullet, enemy)) {
          this.bullets.splice(bulletIndex, 1);
          this.enemies.splice(enemyIndex, 1);
          this.score += 10;
        }
      });
    });

    this.enemies.forEach(enemy => {
      if (checkCollision(this.player, enemy) || enemy.y + enemy.height >= this.canvas.height) {
        this.lives--;
        if (this.lives <= 0) {
          alert('Game Over! Your score: ' + this.score);
          this.reset();
        } else {
          this.resetLevel();
        }
      }
    });
  }

  resetLevel() {
    this.enemies = [];
    this.bullets = [];
    this.spawnEnemies();
    this.player.x = this.canvas.width / 2 - this.player.width / 2;
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.resetLevel();
  }

  drawScore() {
    document.getElementById('score-value').textContent = this.score;
  }

  drawLives() {
    document.getElementById('lives-value').textContent = this.lives;
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}
