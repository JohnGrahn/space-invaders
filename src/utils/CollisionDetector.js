// src/utils/CollisionDetector.js
export class CollisionDetector {
  static checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  static checkBulletEnemyCollisions(bullets, enemyController) {
    let collisions = [];
    bullets.forEach((bullet, bulletIndex) => {
      enemyController.getEnemies().forEach((enemy, enemyIndex) => {
        if (this.checkCollision(bullet, enemy)) {
          collisions.push({ bulletIndex, enemyIndex });
        }
      });
    });
    return collisions;
  }

  static checkEnemyPlayerCollision(enemyController, player) {
    return enemyController.getEnemies().some(enemy => this.checkCollision(enemy, player));
  }
}
