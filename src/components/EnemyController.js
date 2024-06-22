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
        for (let j = 0; j < 11; j++) {
          let enemyType;
          if (i === 0) {
            enemyType = 'squid';
          } else if (i === 1) {
            enemyType = 'invader';
          } else if (i === 2) {
            enemyType = 'invader';  // Swapped: This row is now invaders
          } else if (i === 3) {
            enemyType = 'enemy';    // Swapped: This row is now the original enemy.svg
          } else {
            enemyType = 'crab';
          }
          this.enemies.push(new Enemy(j * 50 + 30, i * 50 + 30, enemyType));
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

  
  