//
//  core/data/Fetcher.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 10/31/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable babel/camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { Component, ReactElement } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, reaction, runInAction } from "mobx";

/* External Libraries */
import objectHash from "object-hash";
import { EventEmitter } from "fbemitter";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { call } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Hashable, CallableRequest, APIResponse } from "@toolkit/api";
import { LoadingIndicatorType } from "@ContextLogic/lego";
import ToastStore from "@stores/ToastStore";
import PersistenceStore from "@stores/PersistenceStore";

export type APIRequest<D> = CallableRequest<D> & Hashable;

type DeprecatedRequest = {
  apiPath: string;
  params?: any | null | undefined;
};

export type FetcherProps = BaseProps & {
  request?: APIRequest<unknown>;
  passResponseAsProps: boolean;
  hideSpinner?: boolean;
  loadingStyle?: any;
  loadingIndicatorType?: LoadingIndicatorType;
  refreshEmitter?: EventEmitter;
  cacheTTLInSeconds?: number | null | undefined;

  // deprecated: Please use a typed api request.
  // see @merchant/api/ folder for examples.
  request_DEP?: DeprecatedRequest;
  onResponse_DEP?: (response: any) => unknown | null | undefined;
};

type CachedResponse = {
  response: APIResponse<unknown>;
  requestTime: number;
};

@observer
class Fetcher extends Component<FetcherProps> {
  static demoRender = `
<Fetcher request={api.authentication.getCaptchaToken()} cacheTTLInSeconds={60}>
  <Label>This label shows after api response</Label>
</Fetcher>
`;

  @observable
  isLoading = true;

  @observable
  response: any | null | undefined = null;

  @observable
  bustKey = 0;

  @observable
  initialLoadComplete = false;

  static defaultProps = {
    passResponseAsProps: true,
  };

  disposables: Array<() => void> = [];

  subscription: { remove: () => unknown } | null | undefined;

  componentDidMount() {
    this.disposables.push(
      reaction(
        () => [this.requestHash],
        () => {
          this.onMakeCall();
        },
        { fireImmediately: true }
      )
    );

    this.disposables.push(
      reaction(
        // eslint-disable-next-line react/destructuring-assignment
        () => [this.props.refreshEmitter],
        ([emitter]) => {
          const { subscription } = this;
          if (subscription) {
            subscription.remove();
          }

          if (emitter) {
            this.subscription = emitter.addListener("refresh", () => {
              this.bustKey += 1;
            });
          }
        },
        { fireImmediately: true }
      )
    );
  }

  componentWillUnmount() {
    const { subscription } = this;
    this.disposables.forEach((dispose) => dispose());
    if (subscription) {
      subscription.remove();
    }

    this.subscription = null;
    this.disposables = [];
  }

  @computed
  get canCache(): boolean {
    const { cacheTTLInSeconds, request_DEP } = this.props;
    return cacheTTLInSeconds != null && request_DEP != null;
  }

  async onMakeCall() {
    const { onResponse_DEP } = this.props;
    const {
      canCache,
      requestHash,
      props: { request_DEP, request },
    } = this;
    this.isLoading = true;

    let response: APIResponse<unknown> | null | undefined = null;
    let cachedResponse: CachedResponse | null | undefined = null;
    const requestTime = Date.now() / 1000;

    if (canCache) {
      cachedResponse = await this.checkOnCache();
      if (cachedResponse != null) {
        response = cachedResponse.response;
      }
    }

    if (response == null) {
      if (request_DEP) {
        response = await call(request_DEP.apiPath, request_DEP.params);
      } else if (request) {
        response = await request.call();
      } else {
        throw "expected a request";
      }
    }

    if (requestHash != this.requestHash) {
      // If second request is sent before the first response is handled,
      // ignore the first response, and only handle the second one
      return;
    }

    runInAction(() => {
      const toastStore = ToastStore.instance();

      if (response == null) {
        this.isLoading = false;
        // eslint-disable-next-line local-rules/no-i18n-project-feature
        toastStore.error(i`Something went wrong`);
        return;
      }

      if (response.code === 0) {
        this.isLoading = false;
        this.response = response;
        this.initialLoadComplete = true;
        if (canCache && cachedResponse == null) {
          this.cacheSet(requestHash, {
            response,
            requestTime,
          });
        }
      } else {
        const { msg } = response;
        if (msg != null) {
          toastStore.error(msg);
        }
      }

      if (onResponse_DEP) {
        onResponse_DEP(response);
      }
    });
  }

  async checkOnCache(): Promise<CachedResponse | null | undefined> {
    const {
      requestHash,
      props: { cacheTTLInSeconds },
    } = this;
    if (cacheTTLInSeconds == null) {
      return null;
    }

    const cachedResponse = await this.cacheGet(requestHash);
    const currentTime = Date.now() / 1000;
    if (cachedResponse == null) {
      return null;
    }

    if (cachedResponse.requestTime + cacheTTLInSeconds < currentTime) {
      this.cacheRemove(requestHash);
      return null;
    }

    return cachedResponse;
  }

  async cacheGet(
    requestHash: string
  ): Promise<CachedResponse | null | undefined> {
    const persistenceStore = PersistenceStore.instance();
    const value = await persistenceStore.get<CachedResponse>(requestHash);
    return value;
  }

  async cacheSet(requestHash: string, response: CachedResponse) {
    const persistenceStore = PersistenceStore.instance();
    return persistenceStore.setForDurationOfSession(requestHash, response);
  }

  async cacheRemove(requestHash: string) {
    const persistenceStore = PersistenceStore.instance();
    return persistenceStore.remove(requestHash);
  }

  @computed
  get requestHash(): string {
    const { request_DEP, request } = this.props;
    if (request_DEP) {
      return objectHash({ ...request_DEP, bustKey: this.bustKey });
    }

    if (request) {
      return objectHash({ hash: request.hash(), bustKey: this.bustKey });
    }

    throw "must provide a request";
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        transition: "opacity 0.2s linear",
        opacity: this.isLoading ? 0.5 : 1,
      },
      loadingContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 40,
      },
    });
  }

  renderContent() {
    const { children } = this.props;
    const {
      response,
      props: { passResponseAsProps },
    } = this;
    if (!response) {
      return null;
    }

    const childProps = passResponseAsProps ? response : {};

    if (typeof children === "function") {
      return children(childProps);
    }

    return React.Children.map(children, (child) => {
      return React.cloneElement(child as ReactElement, childProps);
    });
  }

  renderLoading() {
    const { loadingIndicatorType, className, loadingStyle } = this.props;

    return (
      <div
        className={css(this.styles.loadingContainer, className, loadingStyle)}
      >
        <LoadingIndicator
          type={loadingIndicatorType || "swinging-bar"}
          style={{ flex: 1, maxWidth: 400 }}
        />
      </div>
    );
  }

  render() {
    const { className, hideSpinner } = this.props;
    const isLoading =
      this.isLoading && !hideSpinner && !this.initialLoadComplete;
    if (isLoading) {
      return this.renderLoading();
    }

    return (
      <div className={css(this.styles.root, className)}>
        {this.renderContent()}
      </div>
    );
  }
}

export default Fetcher;
