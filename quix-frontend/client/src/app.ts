import './lib/ui/bootstrap';
import './app.scss';
import create from './lib/app';
import * as components from './components';
import * as stateComponents from './state-components';
import {branches, initCache} from './store';
import UrlPattern from 'url-pattern';
import {config as runnerConfig} from './lib/runner';
import './lib/file-explorer';
import {setupNotifications} from './bootstrap';
import {setBasePath} from './services/resources';

(window as any).UrlPattern = UrlPattern;  // expose for e2e tests

const {googleClientId, ...config} = window.quixConfig;
setBasePath(config.basePath);

create<{
  quixBackendUrl?: string;
  staticsBaseUrl?: string;
  basePath?: string;
}>({
  id: 'quix',
  title: 'Quix',
  basePath: config.basePath,
}, {
    auth: {googleClientId},
    statePrefix: 'base',
    defaultUrl: '/home',
    homeState: 'home',
    logoUrl: `${config.staticsBaseUrl}assets/logo.png`
  }, ['bi.app', 'bi.runner', 'bi.fileExplorer'])
  .config(config)
  .plugin('app', plugin => {
    plugin.components(components);
    plugin.stateComponents(stateComponents);
    plugin.store(branches, config.basePath + '/api/events', 'Node');

    plugin.menuItem({name: 'Notebooks', icon: 'description', template: '<quix-files-sidebar class="bi-c bi-grow"></quix-files-sidebar>'});
    plugin.menuItem({name: 'DB Explorer', icon: 'storage', template: '<quix-db-sidebar class="bi-c bi-grow"></quix-db-sidebar>'});

    plugin.onPluginReady((app, store) => {
      initCache(store);

      runnerConfig.set({prestoUrl: app.getConfig().quixBackendUrl, basePath: app.getConfig().basePath});

      app.getModule().controller('app', ['$scope', scope => scope.app = app] as any);
      setupNotifications();
    });
  })
  .build();
