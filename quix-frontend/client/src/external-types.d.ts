declare module '*.scss';
declare module '*.json';
declare module '*.html';
declare var browser: any;

declare module NodeJS {
  interface Global {
    browser: any;
  }
}

interface DedicatedWorkerGlobalScope {}

interface Window {
  quixConfig: {
    googleClientId: string;
    staticsBaseUrl: string;
    quixBackendUrl: string;
    basePath: string;
  }
}
