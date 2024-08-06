export class InputHandler {
  constructor(game) {
    this.keys = {};
    this.game = game;
    this.addEventListeners();
  }

  addEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Escape') {
        this.togglePause();
      }
    });
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);
  }

  isKeyPressed(keyCode) {
    return this.keys[keyCode] || false;
  }

  togglePause() {
    this.game.togglePause();
  }
}
