import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { checkCollision } from "../utils/collision.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.player = new Player(this.canvas)
    this.enemies = []
    this.bullets = []
    this.score = 0
    this.lives = 3
  }

  start() {
    this.spawnEnemies()
    this.gameLoop()
  }

  spawnEnemies() {
    // Logic to create enemy formation
  }

  update() {
    this.player.update()
    this.enemies.forEach(enemy => enemy.update())
    this.bullets.forEach(bullet => bullet.update())
    this.checkCollisions()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.player.draw(this.ctx)
    this.enemies.forEach(enemy => enemy.draw(this.ctx))
    this.bullets.forEach(bullet => bullet.draw(this.ctx))
  }

  checkCollisions() {
    // Implement collision detection
  }

  gameLoop() {
    this.update()
    this.draw()
    requestAnimationFrame(() => this.gameLoop())
  }
}
