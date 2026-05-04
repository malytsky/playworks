import { Scene, SceneId } from "../core/SceneManager";

export class AdsScene implements Scene {
  id = SceneId.Ads;
  private container: HTMLElement;
  private onComplete: () => void;
  private adDisplayContainer: google.ima.AdDisplayContainer | null = null;
  private adsLoader: google.ima.AdsLoader | null = null;
  private adsManager: google.ima.AdsManager | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private adContainerElement: HTMLElement | null = null;

  constructor(container: HTMLElement, onComplete: () => void) {
    this.container = container;
    this.onComplete = onComplete;
  }

  private getAdTagUrl(): string {
    const pageUrl = encodeURIComponent(window.location.href);
    const descriptionUrl = encodeURIComponent(window.location.origin + '/');
    const correlator = Date.now();

    return `https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&url=${pageUrl}&description_url=${descriptionUrl}&correlator=${correlator}`;
  }

  init(): void {
    this.container.innerHTML = `
      <div class="ads-scene-wrapper" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000;">
        <div id="video-content" style="width: 1280px; height: 720px; position: relative;">
          <video id="content-element" style="width: 100%; height: 100%;">
            <source src="https://storage.googleapis.com/gvabox/responses/static/640x360_vessel.mp4"></source>
          </video>
          <div id="ad-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
        </div>
        <div style="position: absolute; bottom: 40px; color: #fff; text-align: center; z-index: 10;">
            <p>Загрузка рекламы...</p>
        </div>
      </div>
    `;

    this.videoElement = document.getElementById('content-element') as HTMLVideoElement;
    this.adContainerElement = document.getElementById('ad-container');

    if (this.videoElement && this.adContainerElement) {
      this.setupIMA();
    } else {
      this.onComplete();
    }
  }

  private setupIMA(): void {
    if (!this.adContainerElement || !this.videoElement) return;

    this.adDisplayContainer = new google.ima.AdDisplayContainer(
      this.adContainerElement,
      this.videoElement
    );

    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (e: google.ima.AdsManagerLoadedEvent) => this.onAdsManagerLoaded(e),
      false
    );

    this.adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (e: google.ima.AdErrorEvent) => this.onAdError(e),
      false
    );

    this.adDisplayContainer.initialize();

    const adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = this.getAdTagUrl();
    adsRequest.linearAdSlotWidth = 1280;
    adsRequest.linearAdSlotHeight = 720;

    this.adsLoader.requestAds(adsRequest);
  }

  private onAdsManagerLoaded(adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent): void {
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.videoElement!,
      adsRenderingSettings
    );

    this.adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (e: google.ima.AdErrorEvent) => this.onAdError(e)
    );

    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      () => this.onContentPauseRequested()
    );

    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      () => this.onContentResumeRequested()
    );

    this.adsManager.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      () => this.onAdComplete()
    );

    try {
      this.adsManager.init(1280, 720, google.ima.ViewMode.NORMAL);
      this.adsManager.start();
    } catch (adError) {
      console.error('AdsManager error', adError);
      this.onComplete();
    }
  }

  private onAdError(adErrorEvent: google.ima.AdErrorEvent): void {
    console.warn('Ad Error:', adErrorEvent.getError());
    this.onAdComplete();
  }

  private onContentPauseRequested(): void {
    this.videoElement?.pause();
  }

  private onContentResumeRequested(): void {
    this.onAdComplete();
  }

  private onAdComplete(): void {
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
    this.onComplete();
  }

  destroy(): void {
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
    if (this.adsLoader) {
      this.adsLoader.contentComplete();
      this.adsLoader = null;
    }
    this.container.innerHTML = '';
  }

  onKeyDown(_e: KeyboardEvent): void {
    // No controls in AdsScene
  }
}
