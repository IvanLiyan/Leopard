/* External Libraries */
import { computed, action } from "mobx";
import { RouterStore } from "mobx-react-router";

import { createBrowserHistory } from "history";
import { SynchronizedHistory, syncHistoryWithStore } from "mobx-react-router";

/* Relative Imports */
import NavigationStore from "@stores/NavigationStore";

export default class RouteStore {
  routing: RouterStore;
  history: SynchronizedHistory;
  constructor() {
    this.routing = new RouterStore();
    this.history = syncHistoryWithStore(createBrowserHistory(), this.routing);
  }

  pathParams(pattern: string): { [key: string]: string } {
    return NavigationStore.instance().pathParams(pattern);
  }

  @computed
  get currentPath(): string | null {
    return NavigationStore.instance().currentPath;
  }

  @action
  push(path: string, queryParams?: any | null | undefined) {
    NavigationStore.instance().pushPath(path, queryParams);
  }

  @computed
  get queryParams(): Readonly<{
    [key: string]: string;
  }> {
    return NavigationStore.instance().queryParams;
  }

  @action
  pushPath(path: string) {
    this.push(path);
  }

  static instance(): RouteStore {
    let { routeStore } = window as any;
    if (routeStore == null) {
      routeStore = new RouteStore();
      (window as any).routeStore = routeStore;
    }
    return routeStore;
  }
}

export const useRouteStore = (): RouteStore => {
  return RouteStore.instance();
};
