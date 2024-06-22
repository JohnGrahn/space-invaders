import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Bullet } from "./Bullet.js";
import { checkCollision } from "../utils/collision.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.groundHeight = 50;
    this.player = new Player(this.canvas, this.groundHeight);
    this.enemies = [];
    this.bullets = [];
    this.score = 0;
    this.lives = 3;
    this.images = {};
    this.keys = {};
    this.lastTime = 0;
    this.loadImages();
    this.addEventListeners();
    this.isGameOver = false;
    this.hasWon = false;
    this.addClickListener();
  }

  loadImages() {
    const imageNames = ['player', 'enemy', 'bullet'];
    imageNames.forEach(name => {
      this.images[name] = new Image();
      this.images[name].src = `./assets/${name}.svg`;
    });
  }

  addEventListeners() {
    window.addEventListener('keydown', (e) => this.keys[e.code] = true);
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    window.addEventListener('keypress', (e) => {
      if (e.code === 'Space') {
        this.shoot();
      }
    this.addClickListener();  
    });
  }
  addClickListener() {
    this.canvas.addEventListener('click', () => {
      if (this.isGameOver) {
        this.restart();
      }
    });
  }

  start() {
    Promise.all(Object.values(this.images).map(img => new Promise(resolve => img.onload = resolve)))
      .then(() => {
        this.spawnEnemies();
        this.gameLoop(performance.now());
      });
  }

  spawnEnemies() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        this.enemies.push(new Enemy(j * 60 + 50, i * 60 + 50));
      }
    }
  }

  update(deltaTime) {
    if (this.keys['ArrowLeft']) this.player.moveLeft(deltaTime);
    if (this.keys['ArrowRight']) this.player.moveRight(deltaTime);

    this.player.update(deltaTime);
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.y > 0 && bullet.y < this.canvas.height;
    });

    this.checkCollisions();
    this.checkEnemyReachedPlayer();
    this.checkAllEnemiesDefeated();  
  }

  checkAllEnemiesDefeated() {
    if (this.enemies.length === 0) {
      this.win();
    }
  }

  checkEnemyReachedPlayer() {
    const playerTop = this.player.y;
    for (const enemy of this.enemies) {
      if (enemy.y + enemy.height >= playerTop) {
        this.gameOver();
        return;
      }
    }
  }
  gameOver(hasWon) {
    this.isGameOver = true;
    this.hasWon = hasWon;
    this.drawGameOverMessage();
  }
  win() {
    this.gameOver(true);
  }
  drawGameOverMessage() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    
    if (this.hasWon) {
      this.ctx.fillText('Congratulations!', this.canvas.width / 2, this.canvas.height / 2 - 50);
      this.ctx.fillText('You Won!', this.canvas.width / 2, this.canvas.height / 2 + 10);
    } else {
      this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50);
      this.ctx.fillText('You Lose', this.canvas.width / 2, this.canvas.height / 2 + 10);
    }
    
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Click to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 60);
  }

  restart() {
    this.isGameOver = false;
    this.hasWon = false;
    this.score = 0;
    this.lives = 3;
    this.enemies = [];
    this.bullets = [];
    this.player = new Player(this.canvas, this.groundHeight);
    this.spawnEnemies();
  }


  drawBackground() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - this.groundHeight);

    this.ctx.fillStyle = '#4a6741';
    this.ctx.fillRect(0, this.canvas.height - this.groundHeight, this.canvas.width, this.groundHeight);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawBackground();

    if (!this.isGameOver) {
      this.player.draw(this.ctx);
      this.enemies.forEach(enemy => enemy.draw(this.ctx));
      this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    this.drawScore();
    this.drawLives();

    if (this.isGameOver) {
      this.drawGameOverMessage();
    }
  }

  drawScore() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
  }

  drawLives() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 10, 30);
  }

  shoot() {
    const bullet = this.player.shoot();
    if (bullet) {
      this.bullets.push(bullet);
    }
  }

  checkCollisions() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (bullet.isPlayerBullet) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (checkCollision(bullet, enemy)) {
            this.bullets.splice(i, 1);
            this.enemies.splice(j, 1);
            this.score += 10;
            break;
          }
        }
      } else {
        if (checkCollision(bullet, this.player)) {
          this.bullets.splice(i, 1);
          this.lives--;
        }
      }
    }
  }

  gameLoop(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    if (this.isGameOver) {
      this.drawGameOverMessage();
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}