import { Bullet } from './Bullet.js'

export class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 30
    this.height = 30
    this.speed = 5
  }

  update() {
    if (keys.ArrowLeft && this.x > 0) this.x -= this.speed
    if (keys.ArrowRight && this.x < 800 - this.width) this.x += this.speed
  }

  draw(ctx) {
    ctx.fillStyle = 'green'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  shoot() {
    return new Bullet(this.x + this.width / 2, this.y, -10, true)
  }
}

const keys = {}
window.addEventListener('keydown', e => keys[e.code] = true)
window.addEventListener('keyup', e => keys[e.code] = false)
window.addEventListener('keydown', e => {
  if (e.code === 'Space') game.bullets.push(game.player.shoot())
})
