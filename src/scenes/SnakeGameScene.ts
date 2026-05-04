import { Scene, SceneId } from "../core/SceneManager";
import { GameEngine } from "../game/GameEngine";

export class SnakeGameScene implements Scene {
  id = SceneId.Game;
  private container: HTMLElement;
  private onGameOver: () => void;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  private engine: GameEngine;
  private gridSize: number = 40;
  private gameLoop: number | null = null;

  constructor(container: HTMLElement, onGameOver: () => void) {
    this.container = container;
    this.onGameOver = onGameOver;
    this.engine = new GameEngine(32, 18); // 1280/40, 720/40
  }

  init(): void {
    this.container.innerHTML = `
      <div class="game-container">
        <div class="score">Счет: <span id="score-val">0</span></div>
        <canvas id="gameCanvas" width="1280" height="720"></canvas>
      </div>
    `;
    this.canvas = this.container.querySelector('#gameCanvas');
    this.ctx = this.canvas!.getContext('2d');
    this.startGame();
  }

  private startGame() {
    this.gameLoop = window.setInterval(() => this.update(), 100);
  }

  private update() {
    this.engine.update();
    const state = this.engine.getGameState();

    if (state.isGameOver) {
      this.gameOver();
      return;
    }

    const scoreEl = document.getElementById('score-val');
    if (scoreEl) scoreEl.textContent = state.score.toString();

    this.draw();
  }

  private draw() {
    if (!this.ctx || !this.canvas) return;
    const state = this.engine.getGameState();

    // Очистка
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Еда
    this.ctx.fillStyle = '#ff4444';
    this.ctx.fillRect(state.food.x * this.gridSize, state.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);

    // Змейка
    state.snakeBody.forEach((segment, index) => {
      this.ctx!.fillStyle = index === 0 ? '#88ff88' : '#44ff44';
      this.ctx!.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    });
  }

  private gameOver() {
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.onGameOver();
  }

  destroy(): void {
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.container.innerHTML = '';
  }

  onKeyDown(e: KeyboardEvent): void {
    this.engine.handleInput(e.key);
  }
}
