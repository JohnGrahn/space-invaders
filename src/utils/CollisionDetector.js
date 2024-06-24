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
    if (player.isInvincible) return false;
    return this.checkCollision(bullet, player);
  }

  static checkBulletBulletCollisions(playerBullets, enemyBullets) {
    const collisions = [];
    for (let pBulletIndex = 0; pBulletIndex < playerBullets.length; pBulletIndex++) {
      const playerBullet = playerBullets[pBulletIndex];
      for (let eBulletIndex = 0; eBulletIndex < enemyBullets.length; eBulletIndex++) {
        const enemyBullet = enemyBullets[eBulletIndex];
        if (this.checkCollision(playerBullet, enemyBullet)) {
          collisions.push({ playerBulletIndex: pBulletIndex, enemyBulletIndex: eBulletIndex });
          break; // A player bullet can only collide with one enemy bullet
        }
      }
    }
    return collisions;
  }

  // Add this new method for barrier collision detection
  static checkBulletBarrierCollisions(bullets, barriers) {
    const collisions = [];
    for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
      const bullet = bullets[bulletIndex];
      for (let barrierIndex = 0; barrierIndex < barriers.length; barrierIndex++) {
        const barrier = barriers[barrierIndex];
        if (barrier.checkCollision(bullet)) {
          collisions.push({ bulletIndex, barrierIndex });
          break; // A bullet can only collide with one barrier
        }
      }
    }
    return collisions;
  }
}
