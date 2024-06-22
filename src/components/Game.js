import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { Bullet } from "./Bullet.js";
import { GameState } from "./GameState.js";
import { Renderer } from "./Renderer.js";
import { InputHandler } from "./InputHandler.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.gameState = new GameState();
    this.renderer = new Renderer(canvas);
    this.inputHandler = new InputHandler();
    this.groundHeight = 50;
    this.player = new Player(canvas, this.groundHeight);
    this.enemies = [];
    this.bullets = [];
    this.lastTime = 0;
    this.spawnEnemies();
    this.addClickListener();
  }

  addClickListener() {
    this.canvas.addEventListener('click', () => {
      if (this.gameState.isGameOver) {
        this.restart();
      }
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
    if (this.gameState.isGameOver) return;

    this.updatePlayer(deltaTime);
    this.updateEnemies(deltaTime);
    this.updateBullets(deltaTime);
    this.handleCollisions();
    this.checkWinCondition();
  }

  updatePlayer(deltaTime) {
    if (this.inputHandler.isKeyPressed('ArrowLeft')) this.player.moveLeft(deltaTime);
    if (this.inputHandler.isKeyPressed('ArrowRight')) this.player.moveRight(deltaTime);
    if (this.inputHandler.isKeyPressed('Space')) this.shoot();
    this.player.update(deltaTime);
  }

  updateEnemies(deltaTime) {
    this.enemies.forEach(enemy => enemy.update(deltaTime));
  }

  updateBullets(deltaTime) {
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.y > 0 && bullet.y < this.canvas.height;
    });
  }

  handleCollisions() {
    const bulletEnemyCollisions = CollisionDetector.checkBulletEnemyCollisions(this.bullets, this.enemies);
    bulletEnemyCollisions.forEach(({ bullet, enemy }) => {
      this.bullets.splice(bullet, 1);
      this.enemies.splice(enemy, 1);
      this.gameState.increaseScore(10);
    });

    if (CollisionDetector.checkEnemyPlayerCollision(this.enemies, this.player)) {
      this.gameState.decreaseLives();
    }
  }

  checkWinCondition() {
    if (this.enemies.length === 0) {
      this.gameState.hasWon = true;
      this.gameState.isGameOver = true;
    }
  }

  shoot() {
    const bullet = this.player.shoot();
    if (bullet) {
      this.bullets.push(bullet);
    }
  }

  draw() {
    this.renderer.drawBackground(this.groundHeight);
    this.renderer.drawEntities(this.player, this.enemies, this.bullets);
    this.renderer.drawUI(this.gameState.score, this.gameState.lives);
    if (this.gameState.isGameOver) {
      this.renderer.drawGameOverMessage(this.gameState.hasWon);
    }
  }

  gameLoop(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  restart() {
    this.gameState.reset();
    this.player = new Player(this.canvas, this.groundHeight);
    this.enemies = [];
    this.bullets = [];
    this.spawnEnemies();
  }

  start() {
    this.gameLoop(performance.now());
  }
}
