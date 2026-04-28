import { Scene, SceneId } from "../core/SceneManager";

export class AdsScene implements Scene {
  id = SceneId.Ads;
  private container: HTMLElement;
  private onComplete: () => void;
  private timer: number | null = null;

  constructor(container: HTMLElement, onComplete: () => void) {
    this.container = container;
    this.onComplete = onComplete;
  }

  init(): void {
    this.container.innerHTML = `
      <div class="ads-container">
        <h2>Реклама от Google SDK</h2>
        <p>Пожалуйста, подождите...</p>
        <div class="loader"></div>
      </div>
    `;
    
    // Симуляция рекламы на 3 секунды
    this.timer = window.setTimeout(() => {
      this.onComplete();
    }, 3000);
  }

  destroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.container.innerHTML = '';
  }

  onKeyDown(_e: KeyboardEvent): void {
    // В сцене рекламы управление не требуется или заблокировано
  }
}
