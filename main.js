import './style.css'
import { Game } from "./src/game/Game.js";

document.querySelector('#app').innerHTML = `
  <div id="game-container">
    <canvas id="game-canvas" width="800" height="600"></canvas>
  </div>
`;

const canvas = document.querySelector('#game-canvas');
const game = new Game(canvas);
game.start();
