import { Player } from "./Player.js";
import { GameState } from "./GameState.js";
import { Renderer } from "./Renderer.js";
import { InputHandler } from "./InputHandler.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";
import { EnemyController } from "./EnemyController.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.gameState = new GameState();
    this.renderer = new Renderer(canvas);
    this.inputHandler = new InputHandler();
    this.groundHeight = 50;
    this.player = new Player(canvas, this.groundHeight);
    this.bullets = [];
    this.lastTime = 0;
    this.enemyController = new EnemyController(canvas.width);
    this.enemyShootProbability = 0.02;
    this.addClickListener();
  }

  addClickListener() {
    this.canvas.addEventListener('click', () => {
      if (this.gameState.isGameOver) this.restart();
    });
  }

  update(deltaTime) {
    if (this.gameState.isGameOver) return;

    this.updatePlayer(deltaTime);
    this.enemyController.update(deltaTime);
    this.updateBullets(deltaTime);
    this.handleCollisions();
    this.checkWinCondition();
    this.handleEnemyShooting();
  }

  updatePlayer(deltaTime) {
    if (this.inputHandler.isKeyPressed('ArrowLeft')) this.player.moveLeft(deltaTime);
    if (this.inputHandler.isKeyPressed('ArrowRight')) this.player.moveRight(deltaTime);
    if (this.inputHandler.isKeyPressed('Space')) this.shoot();
    this.player.update(deltaTime);
  }

  updateBullets(deltaTime) {
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      if (!bullet.isPlayerBullet && CollisionDetector.checkBulletPlayerCollision(bullet, this.player)) {
        this.playerHit();
        return false;
      }
      return bullet.y > 0 && bullet.y < this.canvas.height;
    });
  }

  handleCollisions() {
    const bulletEnemyCollisions = CollisionDetector.checkBulletEnemyCollisions(this.bullets, this.enemyController.getEnemies());
    bulletEnemyCollisions.forEach(({ bulletIndex, enemyIndex }) => {
      this.bullets.splice(bulletIndex, 1);
      this.enemyController.removeEnemy(enemyIndex);
      this.gameState.increaseScore(10);
    });

    if (CollisionDetector.checkEnemyPlayerCollision(this.enemyController.getEnemies(), this.player)) {
      this.playerHit();
    }
  }

  playerHit() {
    this.gameState.decreaseLives();
    if (this.gameState.lives <= 0) {
      this.gameState.isGameOver = true;
    } else {
      this.player.reset();
    }
  }

  checkWinCondition() {
    if (this.enemyController.getEnemies().length === 0) {
      this.gameState.hasWon = true;
      this.gameState.isGameOver = true;
    }
  }

  handleEnemyShooting() {
    if (Math.random() < this.enemyShootProbability) {
      const enemyBullet = this.enemyController.shoot();
      if (enemyBullet) this.bullets.push(enemyBullet);
    }
  }

  shoot() {
    const bullet = this.player.shoot();
    if (bullet) this.bullets.push(bullet);
  }

  draw() {
    this.renderer.drawBackground(this.groundHeight);
    this.renderer.drawEntities(this.player, this.enemyController, this.bullets);
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
    this.enemyController = new EnemyController(this.canvas.width);
    this.bullets = [];
  }

  start() {
    this.gameLoop(performance.now());
  }
}
