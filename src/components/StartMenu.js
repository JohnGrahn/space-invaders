// src/components/StartMenu.js

export class StartMenu {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = this.createStars(200); // Create 200 stars
  }

  createStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5
      });
    }
    return stars;
  }

  drawStars() {
    this.ctx.fillStyle = 'white';
    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  draw() {
    // Draw background
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw stars
    this.drawStars();

    // Clear area for "Space Invaders" text
this.ctx.fillStyle = 'black';
this.ctx.fillRect(this.canvas.width / 2 - 200, this.canvas.height / 2 - 100, 400, 100);


    // Draw menu text
    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Space Invaders', this.canvas.width / 2, this.canvas.height / 2 - 50);

    // Draw start button
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(this.canvas.width / 2 - 60, this.canvas.height / 2 + 20, 120, 40);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Start', this.canvas.width / 2, this.canvas.height / 2 + 48);
  }

  isStartButtonClicked(x, y) {
    return (
      x > this.canvas.width / 2 - 60 &&
      x < this.canvas.width / 2 + 60 &&
      y > this.canvas.height / 2 + 20 &&
      y < this.canvas.height / 2 + 60
    );
  }
}
