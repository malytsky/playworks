import { Scene, SceneId } from "../core/SceneManager";

export abstract class MenuScene implements Scene {
  abstract id: SceneId;
  protected selectedIndex: number = 0;
  protected options: { label: string; action: () => void }[] = [];
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  abstract init(): void;

  destroy(): void {
    this.container.innerHTML = '';
  }

  protected render() {
    this.container.innerHTML = `
      <div class="menu-container">
        <h1 id="menu-question"></h1>
        <div class="menu-options">
          ${this.options.map((opt, index) => `
            <div class="menu-option ${index === this.selectedIndex ? 'selected' : ''}">
              ${opt.label}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    const questionEl = this.container.querySelector('#menu-question');
    if (questionEl) {
      questionEl.textContent = this.getQuestion();
    }
  }

  abstract getQuestion(): string;

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
      this.render();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
      this.render();
    } else if (e.key === 'Enter') {
      this.options[this.selectedIndex].action();
    }
  }
}
