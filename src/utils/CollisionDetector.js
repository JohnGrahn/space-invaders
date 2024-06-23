export class CollisionDetector {
  static checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  static checkBulletEnemyCollisions(bullets, enemies) {
    const collisions = [];
    for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
      const bullet = bullets[bulletIndex];
      for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
        const enemy = enemies[enemyIndex];
        if (this.checkCollision(bullet, enemy)) {
          collisions.push({ bulletIndex, enemyIndex });
          break; // A bullet can only collide with one enemy
        }
      }
    }
    return collisions;
  }

  static checkEnemyPlayerCollision(enemies, player) {
    return enemies.some(enemy => this.checkCollision(enemy, player));
  }

  static checkBulletPlayerCollision(bullet, player) {
    return this.checkCollision(bullet, player);
  }
}
