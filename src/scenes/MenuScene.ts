import { Scene, SceneId } from "../core/SceneManager";

export interface MenuOption {
  label: string;
  action: () => void;
}

export abstract class MenuScene implements Scene {
  abstract id: SceneId;
  protected selectedIndex: number = 0;
  protected options: MenuOption[] = [];
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
        <div id="menu-question-container"></div>
        <div class="menu-options">
          ${this.options.map((opt, index) => `
            <div class="menu-option ${index === this.selectedIndex ? 'selected' : ''}">
              ${opt.label}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    const questionEl = this.container.querySelector('#menu-question-container');
    if (questionEl) {
      questionEl.innerHTML = this.getQuestion();
    }
  }

  abstract getQuestion(): string;

  onKeyDown(e: KeyboardEvent): void {
    const totalItems = this.options.length;
    if (totalItems === 0) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + totalItems) % totalItems;
      this.render();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % totalItems;
      this.render();
    } else if (e.key === 'Enter') {
      if (this.options[this.selectedIndex]) {
        this.options[this.selectedIndex].action();
      }
    }
  }
}
