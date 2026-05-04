export interface Point {
  x: number;
  y: number;
}

export class Snake {
  private segments: Point[];
  private direction: Point;
  private nextDirection: Point;
  private tileCountX: number;
  private tileCountY: number;

  constructor(tileCountX: number, tileCountY: number) {
    this.tileCountX = tileCountX;
    this.tileCountY = tileCountY;
    this.segments = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
  }

  get body(): Point[] {
    return [...this.segments];
  }

  get head(): Point {
    return { ...this.segments[0] };
  }

  setDirection(dir: Point): void {
    // Prevent 180 degree turns
    if (dir.x !== 0 && this.direction.x === 0) {
      this.nextDirection = dir;
    } else if (dir.y !== 0 && this.direction.y === 0) {
      this.nextDirection = dir;
    }
  }

  move(): void {
    this.direction = this.nextDirection;
    const head = this.segments[0];
    const newHead = {
      x: (head.x + this.direction.x + this.tileCountX) % this.tileCountX,
      y: (head.y + this.direction.y + this.tileCountY) % this.tileCountY
    };
    this.segments.unshift(newHead);
  }

  popTail(): void {
    this.segments.pop();
  }

  checkCollision(point: Point): boolean {
    return this.segments.some(segment => segment.x === point.x && segment.y === point.y);
  }

  checkSelfCollision(): boolean {
    const head = this.head;
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].x === head.x && this.segments[i].y === head.y) {
        return true;
      }
    }
    return false;
  }
}
