import { Enemy } from "./Enemy.js";
import { Bullet } from "./Bullet.js";

export class EnemyController {
  constructor(canvasWidth) {
    this.enemies = [];
    this.canvasWidth = canvasWidth;
    this.direction = 1;
    this.baseSpeed = 250; // Base speed in pixels per second
    this.speed = this.baseSpeed;
    this.moveDownDistance = 20;
    this.timeSinceLastMove = 0;
    this.moveInterval = 1; // Move every second
    this.enemyTypes = ["squid", "invader", "invader", "enemy", "crab"];
  }

  spawnEnemies(wave) {
    this.enemies = [];
    this.speed = this.baseSpeed + (wave - 1) * 5; // Increase speed with each wave
    const rows = Math.min(5, 3 + Math.floor(wave / 2)); // Increase rows with waves, max 5
    const cols = Math.min(11, 7 + Math.floor(wave / 3)); // Increase columns with waves, max 11

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const enemyType = this.enemyTypes[i % this.enemyTypes.length];
        const x = j * 50 + (this.canvasWidth - cols * 50) / 2;
        const y = i * 50 + 30;
        this.enemies.push(new Enemy(x, y, enemyType, this.speed / 30)); // Pass speed to Enemy constructor
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
        this.speed * this.direction * (1 / 60), // Adjust for 60 FPS
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
      (this.direction === 1 && rightmostEnemy.x + rightmostEnemy.width + this.speed / 60 > this.canvasWidth) ||
      (this.direction === -1 && leftmostEnemy.x - this.speed / 60 < 0)
    );
  }

  draw(ctx) {
    this.enemies.forEach((enemy) => enemy.draw(ctx));
  }

  removeEnemy(index) {
    this.enemies.splice(index, 1);
  }
}
