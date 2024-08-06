export class Leaderboard {
  constructor() {
    this.scores = [];
    this.isVisible = false;
  }

  async addScore(name, score, waves) {
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score, waves }),
      });
      if (!response.ok) throw new Error("Failed to add score");
    } catch (error) {
      console.error("Error adding score:", error);
    }
  }

  async getScores() {
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      this.scores = await response.json();
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }

  show(ctx, canvas) {
    if (!this.isVisible) return;

    // Set up the leaderboard background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set up the leaderboard title
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Leaderboard", canvas.width / 2, 50);

    // Display the scores
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    const startX = canvas.width / 2 - 150;
    let startY = 100;

    // Add column headers
    ctx.fillText("Name", startX, startY);
    ctx.fillText("Score", startX + 150, startY);
    ctx.fillText("Waves", startX + 250, startY);
    startY += 30;

    this.scores.forEach((score, index) => {
      ctx.fillText(`${index + 1}. ${score.name}`, startX, startY);
      ctx.fillText(`${score.score}`, startX + 150, startY);
      ctx.fillText(`${score.waves}`, startX + 250, startY);
      startY += 30;
    });

    // Display a "Close" button
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 50, canvas.height - 60, 100, 40);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Close", canvas.width / 2, canvas.height - 35);
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  isCloseButtonClicked(x, y, canvas) {
    return (
      x > canvas.width / 2 - 50 &&
      x < canvas.width / 2 + 50 &&
      y > canvas.height - 60 &&
      y < canvas.height - 20
    );
  }
}
