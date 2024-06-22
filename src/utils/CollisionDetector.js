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
    let collisions = [];
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (this.checkCollision(bullet, enemy)) {
          collisions.push({ bullet: i, enemy: j });
        }
      }
    }
    return collisions;
  }

  static checkEnemyPlayerCollision(enemies, player) {
    return enemies.some(enemy => this.checkCollision(enemy, player));
  }
}
