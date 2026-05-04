import { Snake, Point } from "./Snake";

export class GameEngine {
  private snake: Snake;
  private food: Point;
  private tileCountX: number;
  private tileCountY: number;
  private score: number = 0;
  private isGameOver: boolean = false;

  constructor(tileCountX: number, tileCountY: number) {
    this.tileCountX = tileCountX;
    this.tileCountY = tileCountY;
    this.snake = new Snake(tileCountX, tileCountY);
    this.food = { x: 0, y: 0 };
    this.spawnFood();
  }

  private spawnFood(): void {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.tileCountX),
        y: Math.floor(Math.random() * this.tileCountY)
      };
    } while (this.snake.checkCollision(newFood));
    this.food = newFood;
  }

  update(): void {
    if (this.isGameOver) return;

    this.snake.move();

    if (this.snake.checkSelfCollision()) {
      this.isGameOver = true;
      return;
    }

    const head = this.snake.head;
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.spawnFood();
    } else {
      this.snake.popTail();
    }
  }

  getGameState() {
    return {
      snakeBody: this.snake.body,
      food: this.food,
      score: this.score,
      isGameOver: this.isGameOver
    };
  }

  handleInput(key: string): void {
    switch (key) {
      case 'ArrowUp':
        this.snake.setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        this.snake.setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        this.snake.setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        this.snake.setDirection({ x: 1, y: 0 });
        break;
    }
  }
}
