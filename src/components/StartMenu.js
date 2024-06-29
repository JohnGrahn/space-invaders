// src/components/StartMenu.js

export class StartMenu {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assetTypes = ['crab', 'enemy', 'squid', 'invader'];
    this.loadedAssets = {};
    this.stars = this.createStars(200); // Create 200 stars
    this.fallingAssets = this.createFallingAssets(40); // Create 40 falling assets (10 of each type)
    this.loadAssets();
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

  loadAssets() {
    this.assetTypes.forEach(type => {
      const img = new Image();
      img.src = `/assets/${type}.svg`;
      img.onload = () => {
        this.loadedAssets[type] = img;
      };
    });
  }

  createFallingAssets(count) {
    const assets = [];
    for (let i = 0; i < count; i++) {
      assets.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: Math.random() * 0.5 + 0.2,
        type: this.assetTypes[i % this.assetTypes.length]
      });
    }
    return assets;
  }

  drawStars() {
    this.ctx.fillStyle = 'white';
    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawFallingAssets() {
    this.fallingAssets.forEach(asset => {
      if (this.loadedAssets[asset.type]) {
        this.ctx.drawImage(this.loadedAssets[asset.type], asset.x, asset.y, 20, 20);
        asset.y += asset.speed;
        if (asset.y > this.canvas.height) {
          asset.y = -20;
          asset.x = Math.random() * this.canvas.width;
        }
      }
    });
  }

  draw() {
    // Draw background
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw stars
    this.drawStars();

    // Draw falling assets
    this.drawFallingAssets();

    // Clear area for "Space Invaders" text
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
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
