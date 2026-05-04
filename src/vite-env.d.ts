declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare namespace google {
  export namespace ima {
    export class AdDisplayContainer {
      constructor(containerElement: HTMLElement, videoElement: HTMLVideoElement | null);
      initialize(): void;
      destroy(): void;
    }
    export class AdsLoader {
      constructor(containerElement: AdDisplayContainer);
      addEventListener(type: string, callback: (event: any) => void, useCapture?: boolean): void;
      requestAds(adsRequest: AdsRequest): void;
      contentComplete(): void;
    }
    export class AdsManager {
      addEventListener(type: string, callback: (event: any) => void, useCapture?: boolean): void;
      init(width: number, height: number, viewMode: string): void;
      start(): void;
      pause(): void;
      resume(): void;
      destroy(): void;
      resize(width: number, height: number, viewMode: string): void;
    }
    export class AdsRequest {
      adTagUrl: string;
      linearAdSlotWidth: number;
      linearAdSlotHeight: number;
    }
    export class AdsRenderingSettings {
      restoreCustomPlaybackStateOnAdBreakComplete: boolean;
    }
    export class AdsManagerLoadedEvent {
      static Type: {
        ADS_MANAGER_LOADED: string;
      };
      getAdsManager(videoElement: HTMLVideoElement, adsRenderingSettings: AdsRenderingSettings): AdsManager;
    }
    export class AdErrorEvent {
      static Type: {
        AD_ERROR: string;
      };
      getError(): any;
    }
    export class AdEvent {
      static Type: {
        CONTENT_PAUSE_REQUESTED: string;
        CONTENT_RESUME_REQUESTED: string;
        ALL_ADS_COMPLETED: string;
        LOADED: string;
        STARTED: string;
        COMPLETE: string;
        SKIPPED: string;
      };
    }
    export enum ViewMode {
      NORMAL = 'normal',
      FULLSCREEN = 'fullscreen'
    }
  }
}
