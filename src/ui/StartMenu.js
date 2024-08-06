// src/components/StartMenu.js

export class StartMenu {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.assetTypes = ["crab", "enemy", "squid", "invader"];
    this.loadedAssets = {};
    this.stars = this.createStars(200);
    this.fallingAssets = this.createFallingAssets(40);
    this.loadAssets();
    this.leaderboardButton = {
      x: this.canvas.width / 2 - 100,
      y: this.canvas.height / 2 + 80,
      width: 200,
      height: 50,
    };
    this.instructionsButton = {
      x: this.canvas.width / 2 - 100,
      y: this.canvas.height / 2 + 140,
      width: 200,
      height: 50,
    };
    this.showingInstructions = false;
  }

  createStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
      });
    }
    return stars;
  }

  loadAssets() {
    this.assetTypes.forEach((type) => {
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
        type: this.assetTypes[i % this.assetTypes.length],
      });
    }
    return assets;
  }

  drawStars() {
    this.ctx.fillStyle = "white";
    this.stars.forEach((star) => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawFallingAssets() {
    this.fallingAssets.forEach((asset) => {
      if (this.loadedAssets[asset.type]) {
        this.ctx.drawImage(
          this.loadedAssets[asset.type],
          asset.x,
          asset.y,
          20,
          20
        );
        asset.y += asset.speed;
        if (asset.y > this.canvas.height) {
          asset.y = -20;
          asset.x = Math.random() * this.canvas.width;
        }
      }
    });
  }

  draw() {
    if (this.showingInstructions) {
      this.drawInstructions();
    } else {
      this.drawMenu();
    }
  }

  drawMenu() {
    // Draw background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw stars and falling assets
    this.drawStars();
    this.drawFallingAssets();

    // Clear area for "Space Invaders" text
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(
      this.canvas.width / 2 - 200,
      this.canvas.height / 2 - 100,
      400,
      260
    );

    // Draw menu text
    this.ctx.fillStyle = "white";
    this.ctx.font = "48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Space Invaders",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );

    // Draw start button
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      this.canvas.width / 2 - 60,
      this.canvas.height / 2 + 20,
      120,
      40
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Start",
      this.canvas.width / 2,
      this.canvas.height / 2 + 48
    );

    // Draw leaderboard button
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(
      this.leaderboardButton.x,
      this.leaderboardButton.y,
      this.leaderboardButton.width,
      this.leaderboardButton.height
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Leaderboard",
      this.canvas.width / 2,
      this.leaderboardButton.y + 32
    );

    // Draw instructions button
    this.ctx.fillStyle = "orange";
    this.ctx.fillRect(
      this.instructionsButton.x,
      this.instructionsButton.y,
      this.instructionsButton.width,
      this.instructionsButton.height
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Instructions",
      this.canvas.width / 2,
      this.instructionsButton.y + 32
    );
  }

  drawInstructions() {
    // Clear the screen
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw instructions text
    this.ctx.fillStyle = "white";
    this.ctx.font = "36px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Instructions", this.canvas.width / 2, 100);
    this.ctx.font = "24px Arial";
    this.ctx.fillText("Arrow Left: Move Left", this.canvas.width / 2, 160);
    this.ctx.fillText("Arrow Right: Move Right", this.canvas.width / 2, 200);
    this.ctx.fillText("Space: Shoot", this.canvas.width / 2, 240);
    this.ctx.fillText("ESC: Pause Game", this.canvas.width / 2, 280);

    // Draw back button
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(20, 20, 100, 40);
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Back", 70, 45);
  }

  isLeaderboardButtonClicked(x, y) {
    return (
      x > this.leaderboardButton.x &&
      x < this.leaderboardButton.x + this.leaderboardButton.width &&
      y > this.leaderboardButton.y &&
      y < this.leaderboardButton.y + this.leaderboardButton.height
    );
  }

  isStartButtonClicked(x, y) {
    return (
      x > this.canvas.width / 2 - 60 &&
      x < this.canvas.width / 2 + 60 &&
      y > this.canvas.height / 2 + 20 &&
      y < this.canvas.height / 2 + 60
    );
  }

  isInstructionsButtonClicked(x, y) {
    return (
      x > this.instructionsButton.x &&
      x < this.instructionsButton.x + this.instructionsButton.width &&
      y > this.instructionsButton.y &&
      y < this.instructionsButton.y + this.instructionsButton.height
    );
  }

  isBackButtonClicked(x, y) {
    return x < 120 && y < 60;
  }

  handleClick(x, y) {
    if (this.showingInstructions) {
      if (this.isBackButtonClicked(x, y)) {
        this.showingInstructions = false;
      }
    } else {
      if (this.isInstructionsButtonClicked(x, y)) {
        this.showingInstructions = true;
      }
    }
    this.draw();
  }
}
