import { Enemy } from "./Enemy.js";
import { Bullet } from "./Bullet.js";

export class EnemyController {
  constructor(canvasWidth) {
    this.enemies = [];
    this.canvasWidth = canvasWidth;
    this.direction = 1;
    this.speed = 30; // pixels per second
    this.moveDownDistance = 20;
    this.timeSinceLastMove = 0;
    this.moveInterval = 1; // Move every second
    this.enemyTypes = ["squid", "invader", "invader", "enemy", "crab"];
    this.spawnEnemies();
  }

  spawnEnemies() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 11; j++) {
        const enemyType = this.enemyTypes[i];
        this.enemies.push(new Enemy(j * 50 + 30, i * 50 + 30, enemyType));
      }
    }
  }

  getLowestEnemiesInColumns() {
    const columnEnemies = {};
    this.enemies.forEach(enemy => {
      const column = Math.floor(enemy.x / enemy.width);
      if (!columnEnemies[column] || enemy.y > columnEnemies[column].y) {
        columnEnemies[column] = enemy;
      }
    });
    return Object.values(columnEnemies);
  }

  shoot() {
    const lowestEnemies = this.getLowestEnemiesInColumns();
    if (lowestEnemies.length === 0) return null;
    
    const shootingEnemy = lowestEnemies[Math.floor(Math.random() * lowestEnemies.length)];
    return new Bullet(
      shootingEnemy.x + shootingEnemy.width / 2,
      shootingEnemy.y + shootingEnemy.height,
      5,
      false
    );
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
    if (this.enemies.length === 0) return;

    const [leftmostEnemy, rightmostEnemy] = this.findEdgeEnemies();
    const moveDown = this.shouldMoveDown(leftmostEnemy, rightmostEnemy);

    if (moveDown) {
      this.direction *= -1;
    }

    this.enemies.forEach((enemy) => {
      enemy.move(
        this.speed * this.direction,
        moveDown ? this.moveDownDistance : 0
      );
    });
  }

  findEdgeEnemies() {
    return this.enemies.reduce(
      ([min, max], e) => [
        e.x < min.x ? e : min,
        e.x > max.x ? e : max
      ],
      [this.enemies[0], this.enemies[0]]
    );
  }

  shouldMoveDown(leftmostEnemy, rightmostEnemy) {
    return (
      (this.direction === 1 && rightmostEnemy.x + rightmostEnemy.width + this.speed > this.canvasWidth) ||
      (this.direction === -1 && leftmostEnemy.x - this.speed < 0)
    );
  }

  draw(ctx) {
    this.enemies.forEach((enemy) => enemy.draw(ctx));
  }

  removeEnemy(index) {
    this.enemies.splice(index, 1);
  }
}
