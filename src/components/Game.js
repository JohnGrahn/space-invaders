import { Player } from "./Player.js";
import { GameState } from "./GameState.js";
import { Renderer } from "./Renderer.js";
import { InputHandler } from "./InputHandler.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";
import { EnemyController } from "./EnemyController.js";
import { Barrier } from "./Barrier.js";

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
    this.barriers = this.createBarriers();
    this.addClickListener();
  }

  createBarriers() {
    const barrierWidth = 100;
    const barrierHeight = 60;
    const gap = (this.canvas.width - barrierWidth * 4) / 5;
    return [
      new Barrier(gap, this.canvas.height - 180, barrierWidth, barrierHeight),
      new Barrier(gap * 2 + barrierWidth, this.canvas.height - 180, barrierWidth, barrierHeight),
      new Barrier(gap * 3 + barrierWidth * 2, this.canvas.height - 180, barrierWidth, barrierHeight),
      new Barrier(gap * 4 + barrierWidth * 3, this.canvas.height - 180, barrierWidth, barrierHeight)
    ];
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
    this.handleEnemyBarrierCollisions();
  }

  updatePlayer(deltaTime) {
    if (this.inputHandler.isKeyPressed('ArrowLeft')) this.player.moveLeft(deltaTime);
    if (this.inputHandler.isKeyPressed('ArrowRight')) this.player.moveRight(deltaTime);
    if (this.inputHandler.isKeyPressed('Space')) this.shoot();
    this.player.update(deltaTime);
    this.player.updateInvincibility(deltaTime);
  }

  updateBullets(deltaTime) {
    const playerBullets = this.bullets.filter(bullet => bullet.isPlayerBullet);
    const enemyBullets = this.bullets.filter(bullet => !bullet.isPlayerBullet);

    // Update all bullets
    this.bullets.forEach(bullet => bullet.update(deltaTime));

    // Check for player-enemy bullet collisions
    const bulletCollisions = CollisionDetector.checkBulletBulletCollisions(playerBullets, enemyBullets);
    bulletCollisions.forEach(({ playerBulletIndex, enemyBulletIndex }) => {
      this.bullets.splice(this.bullets.indexOf(playerBullets[playerBulletIndex]), 1);
      this.bullets.splice(this.bullets.indexOf(enemyBullets[enemyBulletIndex]), 1);
    });

    // Check for enemy bullets hitting the player
    enemyBullets.forEach(bullet => {
      if (CollisionDetector.checkBulletPlayerCollision(bullet, this.player)) {
        this.playerHit();
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }
    });

    // Check for bullet collisions with barriers
    this.bullets = this.bullets.filter(bullet => {
      for (let barrier of this.barriers) {
        if (barrier.checkCollision(bullet)) {
          return false; // Remove the bullet
        }
      }
      return true; // Keep the bullet
    });

    // Remove bullets that are off-screen
    this.bullets = this.bullets.filter(bullet => bullet.y > 0 && bullet.y < this.canvas.height);
  }

  handleCollisions() {
    const bulletEnemyCollisions = CollisionDetector.checkBulletEnemyCollisions(
      this.bullets.filter(bullet => bullet.isPlayerBullet),
      this.enemyController.getEnemies()
    );
    bulletEnemyCollisions.forEach(({ bulletIndex, enemyIndex }) => {
      this.bullets.splice(this.bullets.findIndex(b => b.isPlayerBullet), 1);
      this.enemyController.removeEnemy(enemyIndex);
      this.gameState.increaseScore(10);
    });

    if (CollisionDetector.checkEnemyPlayerCollision(this.enemyController.getEnemies(), this.player)) {
      this.playerHit();
    }
  }

  handleEnemyBarrierCollisions() {
    const enemies = this.enemyController.getEnemies();
    for (let enemy of enemies) {
      for (let barrier of this.barriers) {
        barrier.checkCollision(enemy);
      }
    }
    // Remove completely destroyed barriers
    this.barriers = this.barriers.filter(barrier => !barrier.isDestroyed());
  }

  playerHit() {
    if (!this.player.isInvincible) {
      this.gameState.decreaseLives();
      if (this.gameState.lives <= 0) {
        this.gameState.isGameOver = true;
      } else {
        this.player.reset();
        this.player.makeInvincible(); // Apply invincibility after hit
      }
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
    this.barriers.forEach(barrier => barrier.draw(this.renderer.ctx));
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
    this.barriers = this.createBarriers();
  }

  start() {
    this.gameLoop(performance.now());
  }
}
