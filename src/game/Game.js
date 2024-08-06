import { Player } from "./Player.js";
import { GameState } from "../state/GameState.js";
import { Renderer } from "../ui/Renderer.js";
import { InputHandler } from "../utils/InputHandler.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";
import { EnemyController } from "./EnemyController.js";
import { Barrier } from "./Barrier.js";
import { StartMenu } from '../ui/StartMenu.js';
import { Leaderboard } from '../ui/LeaderBoard.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.gameState = new GameState();
    this.renderer = new Renderer(canvas);
    this.inputHandler = new InputHandler(this);
    this.groundHeight = 50;
    this.player = new Player(canvas, this.groundHeight);
    this.bullets = [];
    this.lastTime = 0;
    this.enemyController = new EnemyController(canvas.width);
    this.enemyShootProbability = 0.02;
    this.barriers = this.createBarriers();
    this.isGameStarted = false;
    this.startMenu = new StartMenu(canvas);
    this.currentWave = 1;
    this.isWaveCleared = false;
    this.waveClearDelay = 3000;
    this.waveClearTimer = 0;
    this.leaderboard = new Leaderboard();
    this.playerName = '';
    this.isPaused = false;
    this.addClickListener();
  }

  async gameOver() {
    if (this.gameState.score > 0) {
      this.playerName = await this.promptPlayerName();
      await this.leaderboard.addScore(this.playerName, this.gameState.score, this.currentWave);
    }
    this.draw(); // Redraw to show the game over screen
  }

  async promptPlayerName() {
    return new Promise((resolve) => {
      const name = prompt('Enter your name for the leaderboard:');
      resolve(name || 'Anonymous');
    });
  }

  createBarriers() {
    const barrierWidth = 80;
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
    this.canvas.addEventListener('click', async (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (this.leaderboard.isVisible) {
        if (this.leaderboard.isCloseButtonClicked(x, y, this.canvas)) {
          this.leaderboard.toggleVisibility();
        }
      } else if (!this.isGameStarted) {
        if (this.startMenu.isStartButtonClicked(x, y)) {
          this.isGameStarted = true;
          this.startWave();
        } else if (this.startMenu.isLeaderboardButtonClicked(x, y)) {
          await this.leaderboard.getScores();
          this.leaderboard.toggleVisibility();
        } else if (this.startMenu.isInstructionsButtonClicked(x, y)) {
          this.startMenu.showingInstructions = true;
        } else if (this.startMenu.isBackButtonClicked(x, y)) {
          this.startMenu.showingInstructions = false;
        }
        this.startMenu.handleClick(x, y);
      } else if (this.gameState.isGameOver) {
        this.restart();
      } else if (this.isPaused) {
        if (this.isButtonClicked(x, y, this.canvas.width / 2 - 100, this.canvas.height / 2 + 50, 200, 50)) {
          this.restart();
          this.togglePause();
        } else if (this.isButtonClicked(x, y, this.canvas.width / 2 - 100, this.canvas.height / 2 + 120, 200, 50)) {
          await this.endGame();
        }
      }
    });
  }

  isButtonClicked(clickX, clickY, buttonX, buttonY, buttonWidth, buttonHeight) {
    return clickX >= buttonX && clickX <= buttonX + buttonWidth &&
           clickY >= buttonY && clickY <= buttonY + buttonHeight;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  async endGame() {
    await this.gameOver();
    this.isGameStarted = false;
    this.isPaused = false;
    this.currentWave = 1;
    this.isWaveCleared = false;
    this.enemyShootProbability = 0.02;
    this.waveClearTimer = 0;
    this.gameState.reset();
    this.player = new Player(this.canvas, this.groundHeight);
    this.enemyController = new EnemyController(this.canvas.width);
    this.bullets = [];
    this.barriers = this.createBarriers();
    this.draw(); // Redraw to show the start menu
  }

  update(deltaTime) {
    if (!this.isGameStarted || this.isPaused) {
      return;
    }

    if (this.gameState.isGameOver) return;

    if (this.isWaveCleared) {
      this.waveClearTimer += deltaTime * 1000;
      if (this.waveClearTimer >= this.waveClearDelay) {
        this.startNextWave();
      }
      return;
    }

    this.updatePlayer(deltaTime);
    this.enemyController.update(deltaTime);
    this.updateBullets(deltaTime);
    this.handleCollisions();
    this.checkWaveCompletion();
    this.handleEnemyShooting();
    this.handleEnemyBarrierCollisions();
  }

  showStartMenu() {
    this.startMenu.draw();
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

    this.bullets.forEach(bullet => bullet.update(deltaTime));

    const bulletCollisions = CollisionDetector.checkBulletBulletCollisions(playerBullets, enemyBullets);
    bulletCollisions.forEach(({ playerBulletIndex, enemyBulletIndex }) => {
      this.bullets.splice(this.bullets.indexOf(playerBullets[playerBulletIndex]), 1);
      this.bullets.splice(this.bullets.indexOf(enemyBullets[enemyBulletIndex]), 1);
    });

    enemyBullets.forEach(bullet => {
      if (CollisionDetector.checkBulletPlayerCollision(bullet, this.player)) {
        this.playerHit();
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }
    });

    this.bullets = this.bullets.filter(bullet => {
      for (let barrier of this.barriers) {
        if (barrier.checkCollision(bullet)) {
          return false;
        }
      }
      return true;
    });

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
    this.barriers = this.barriers.filter(barrier => !barrier.isDestroyed());
  }

  playerHit() {
    if (!this.player.isInvincible) {
      this.gameState.decreaseLives();
      if (this.gameState.lives <= 0) {
        this.gameOver();
      } else {
        this.player.reset();
        this.player.makeInvincible();
      }
    }
  }

  checkWaveCompletion() {
    if (this.enemyController.getEnemies().length === 0) {
      this.isWaveCleared = true;
      this.waveClearTimer = 0;
    }
  }

  startWave() {
    this.isWaveCleared = false;
    this.enemyController.spawnEnemies(this.currentWave);
    this.enemyShootProbability = Math.min(0.02 + (this.currentWave - 1) * 0.005, 0.05);
  }

  startNextWave() {
    this.currentWave++;
    this.startWave();
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
    if (!this.isGameStarted) {
      this.showStartMenu();
    } else {
      this.renderer.drawBackground(this.groundHeight);
      this.renderer.drawEntities(this.player, this.enemyController, this.bullets);
      this.barriers.forEach(barrier => barrier.draw(this.renderer.ctx));
      this.renderer.drawUI(this.gameState.score, this.gameState.lives, this.currentWave);
      if (this.gameState.isGameOver) {
        this.renderer.drawGameOverMessage(this.gameState.hasWon);
      } else if (this.isWaveCleared) {
        this.renderer.drawWaveClearedMessage(this.currentWave + 1);
      }
      if (this.isPaused) {
        this.renderer.drawPauseOverlay();
      }
    }
    this.leaderboard.show(this.renderer.ctx, this.canvas);
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
    this.currentWave = 1;
    this.isWaveCleared = false;
    this.enemyShootProbability = 0.02;
    this.isPaused = false;
    this.isGameStarted = true;
    this.waveClearTimer = 0;
    this.startWave();
  }
  
  start() {
    this.gameLoop(performance.now());
  }
}