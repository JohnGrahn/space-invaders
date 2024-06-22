// src/components/EnemyController.js
import { Enemy } from './Enemy.js';

export class EnemyController {
    constructor(canvasWidth) {
      this.enemies = [];
      this.canvasWidth = canvasWidth;
      this.direction = 1;
      this.speed = 30; // pixels per second
      this.moveDownDistance = 20;
      this.timeSinceLastMove = 0;
      this.moveInterval = 1; // Move every second
      this.spawnEnemies();
    }
  
    spawnEnemies() {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
          this.enemies.push(new Enemy(j * 60 + 50, i * 60 + 50));
        }
      }
    }

    getEnemies() {
        return this.enemies;
      }
  
    update(deltaTime) {
      this.timeSinceLastMove += deltaTime;
      if (this.timeSinceLastMove >= this.moveInterval) {
        this.moveEnemies();
        this.timeSinceLastMove = 0;
      }
    }
  
    moveEnemies() {
      let moveDown = false;
      const leftmostEnemy = this.enemies.reduce((min, e) => e.x < min.x ? e : min, this.enemies[0]);
      const rightmostEnemy = this.enemies.reduce((max, e) => e.x > max.x ? e : max, this.enemies[0]);
  
      if (
        (this.direction === 1 && rightmostEnemy.x + rightmostEnemy.width + this.speed > this.canvasWidth) ||
        (this.direction === -1 && leftmostEnemy.x - this.speed < 0)
      ) {
        this.direction *= -1;
        moveDown = true;
      }
  
      this.enemies.forEach(enemy => {
        enemy.move(this.speed * this.direction, moveDown ? this.moveDownDistance : 0);
      });
    }
    
    handleCollisions() {
    const bulletEnemyCollisions = CollisionDetector.checkBulletEnemyCollisions(this.bullets, this.enemyController);
    bulletEnemyCollisions.forEach(({ bulletIndex, enemyIndex }) => {
      this.bullets.splice(bulletIndex, 1);
      this.enemyController.getEnemies().splice(enemyIndex, 1);
      this.gameState.increaseScore(10);
    });

    if (CollisionDetector.checkEnemyPlayerCollision(this.enemyController, this.player)) {
      this.gameState.decreaseLives();
      if (this.gameState.lives <= 0) {
        this.gameState.isGameOver = true;
      }
    }
  }

    
  
    
    draw(ctx) {
      this.enemies.forEach(enemy => enemy.draw(ctx));
    }
    removeEnemy(index) {
        this.enemies.splice(index, 1);
      }


  }

  
  