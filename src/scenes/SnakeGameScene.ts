import { Scene, SceneId } from "../core/SceneManager";

interface Point {
  x: number;
  y: number;
}

export class SnakeGameScene implements Scene {
  id = SceneId.Game;
  private container: HTMLElement;
  private onGameOver: () => void;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  private snake: Point[] = [{ x: 10, y: 10 }];
  private food: Point = { x: 5, y: 5 };
  private direction: Point = { x: 1, y: 0 };
  private nextDirection: Point = { x: 1, y: 0 };
  private gridSize: number = 40;
  private tileCountX: number = 32; // 1280 / 40
  private tileCountY: number = 18; // 720 / 40
  private gameLoop: number | null = null;
  private score: number = 0;

  constructor(container: HTMLElement, onGameOver: () => void) {
    this.container = container;
    this.onGameOver = onGameOver;
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
    this.resetGame();
    this.startGame();
  }

  private resetGame() {
    this.snake = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.spawnFood();
  }

  private spawnFood() {
    this.food = {
      x: Math.floor(Math.random() * this.tileCountX),
      y: Math.floor(Math.random() * this.tileCountY)
    };
  }

  private startGame() {
    this.gameLoop = window.setInterval(() => this.update(), 100);
  }

  private update() {
    this.direction = this.nextDirection;
    const head = { 
      x: (this.snake[0].x + this.direction.x + this.tileCountX) % this.tileCountX, 
      y: (this.snake[0].y + this.direction.y + this.tileCountY) % this.tileCountY 
    };

    // Проверка столкновений с собой
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // Проверка поедания еды
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      const scoreEl = document.getElementById('score-val');
      if (scoreEl) scoreEl.textContent = this.score.toString();
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  private draw() {
    if (!this.ctx || !this.canvas) return;

    // Очистка
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Еда
    this.ctx.fillStyle = '#ff4444';
    this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);

    // Змейка
    this.ctx.fillStyle = '#44ff44';
    this.snake.forEach((segment, index) => {
      if (index === 0) this.ctx!.fillStyle = '#88ff88'; // Голова светлее
      else this.ctx!.fillStyle = '#44ff44';
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
    switch (e.key) {
      case 'ArrowUp':
        if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
        break;
    }
  }
}
