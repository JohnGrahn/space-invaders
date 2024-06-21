export class Bullet {
    constructor(x, y, speed, isPlayerBullet) {
      this.x = x
      this.y = y
      this.width = 5
      this.height = 10
      this.speed = speed
      this.isPlayerBullet = isPlayerBullet
    }
  
    update() {
      this.y += this.speed
    }
  
    draw(ctx) {
      ctx.fillStyle = this.isPlayerBullet ? 'yellow' : 'white'
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  