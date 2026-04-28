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
      { label: 'Нет', action: () => window.location.href = 'https://google.com' }
    ];
  }

  init(): void {
    this.render();
  }

  getQuestion(): string {
    return 'Хотите сыграть заново?';
  }
}
