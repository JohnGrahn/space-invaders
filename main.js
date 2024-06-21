import './style.css'
import { Game } from "./src/components/Game.js";

document.querySelector('#app').innerHTML = `
  <div id="game-container">
    <canvas id="game-canvas"></canvas>
    <div id="score">Score: <span id="score-value">0</span></div>
    <div id="lives">Lives: <span id="lives-value">3</span></div>
  </div>
`

const game = new Game(document.querySelector('#game-canvas'))
game.start()
