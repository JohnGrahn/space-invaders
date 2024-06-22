export class InputHandler {
    constructor() {
      this.keys = {};
      this.addEventListeners();
    }
  
    addEventListeners() {
      window.addEventListener('keydown', (e) => this.keys[e.code] = true);
      window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }
  
    isKeyPressed(keyCode) {
      return this.keys[keyCode] || false;
    }
  }
  