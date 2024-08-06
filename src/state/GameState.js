export class GameState {
    constructor() {
      this.score = 0;
      this.lives = 3;
      this.isGameOver = false;
      this.hasWon = false;
    }
  
    reset() {
      this.score = 0;
      this.lives = 3;
      this.isGameOver = false;
      this.hasWon = false;
    }
  
    increaseScore(points) {
      this.score += points;
    }
  
    decreaseLives() {
      this.lives--;
      if (this.lives <= 0) {
        this.isGameOver = true;
      }
    }
  }
  