import './style.css';
import { SceneManager } from './core/SceneManager';
import { GreetingScene } from './scenes/GreetingScene';
import { AdsScene } from './scenes/AdsScene';
import { SnakeGameScene } from './scenes/SnakeGameScene';
import { ReplayScene } from './scenes/ReplayScene';

const appContainer = document.querySelector<HTMLDivElement>('#app')!;
const sceneManager = new SceneManager(appContainer);

function showGreeting() {
  sceneManager.changeScene(new GreetingScene(appContainer, showAds));
}

function showAds() {
  sceneManager.changeScene(new AdsScene(appContainer, showGame));
}

function showGame() {
  sceneManager.changeScene(new SnakeGameScene(appContainer, showReplay));
}

function showReplay() {
  sceneManager.changeScene(new ReplayScene(appContainer, showAds));
}

// Запуск первой сцены
showGreeting();
