import './style.css';
import { SceneManager } from './core/SceneManager';
import { GreetingScene } from './scenes/GreetingScene';
import { AdsScene } from './scenes/AdsScene';
import { SnakeGameScene } from './scenes/SnakeGameScene';
import { ReplayScene } from './scenes/ReplayScene';

class App {
  private sceneManager: SceneManager;
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.querySelector<HTMLDivElement>(containerId)!;
    this.sceneManager = new SceneManager(this.container);
  }

  start() {
    this.showGreeting();
  }

  private showGreeting = () => {
    this.sceneManager.changeScene(new GreetingScene(this.container, this.showAds));
  }

  private showAds = () => {
    this.sceneManager.changeScene(new AdsScene(this.container, this.showGame));
  }

  private showGame = () => {
    this.sceneManager.changeScene(new SnakeGameScene(this.container, this.showReplay));
  }

  private showReplay = () => {
    this.sceneManager.changeScene(new ReplayScene(this.container, this.showAds));
  }
}

const app = new App('#app');
app.start();
