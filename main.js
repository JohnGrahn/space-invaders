import './style.css'
import { Game } from "./src/components/Game.js";

document.querySelector('#app').innerHTML = `
  <div id="game-container">
    <canvas id="game-canvas" width="800" height="600"></canvas>
    <div id="score">Score: <span id="score-value">0</span></div>
    <div id="lives">Lives: <span id="lives-value">3</span></div>
  </div>
`

const canvas = document.querySelector('#game-canvas');
const game = new Game(canvas);
game.start();
