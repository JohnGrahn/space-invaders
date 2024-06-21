import { Bullet } from './Bullet.js'

export class Enemy {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 30
    this.height = 30
    this.speed = 1
    this.direction = 1
  }

  update() {
    this.x += this.speed * this.direction
    if (this.x <= 0 || this.x + this.width >= 800) {
      this.direction *= -1
      this.y += 20
    }
  }

  draw(ctx) {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  shoot() {
    return new Bullet(this.x + this.width / 2, this.y + this.height, 5, false)
  }
}
