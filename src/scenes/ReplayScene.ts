import { MenuScene } from "./MenuScene";
import { SceneId } from "../core/SceneManager";

export class ReplayScene extends MenuScene {
  id = SceneId.Replay;
  private onReplay: () => void;

  constructor(container: HTMLElement, onReplay: () => void) {
    super(container);
    this.onReplay = onReplay;
    this.options = [
      { label: 'Да', action: () => this.onReplay() },
      { label: 'Нет', action: () => window.location.href = '/' }
    ];
    this.selectedIndex = 0;
  }

  init(): void {
    this.render();
  }

  getQuestion(): string {
    return `
      <h2 style="font-size: 2.5em; margin: 10px 0;">Игра окончена!</h2>
      <h3 style="font-size: 1.8em; color: #44ff44; margin: 20px 0;">Хотите сыграть заново?</h3>
    `;
  }
}
