export enum SceneId {
  Greeting = 'greeting',
  Ads = 'ads',
  Game = 'game',
  Replay = 'replay'
}

export interface Scene {
  id: SceneId;
  init(): void;
  destroy(): void;
  onKeyDown(e: KeyboardEvent): void;
}

export class SceneManager {
  private currentScene: Scene | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  changeScene(scene: Scene) {
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.container.innerHTML = '';
    this.currentScene = scene;
    this.currentScene.init();
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.currentScene) {
      this.currentScene.onKeyDown(e);
    }
  }
}
