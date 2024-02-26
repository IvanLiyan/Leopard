/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* React, Mobx and Aphrodite */
import { useEffect, useState, useCallback } from "react";

/* eslint-disable local-rules/no-untyped-api-calls */

/* React, Mobx and Aphrodite */
import { computed, observable } from "mobx";

/* External Libraries */
import objectHash from "object-hash";

/* Legacy */
import api from "@legacy/core/api";

/* Merchant Store */
import ToastStore from "@core/stores/ToastStore";

export type APIResponse<ResponseData> = {
  code: number;
  data?: ResponseData;
  msg?: string;
};

export interface Hashable {
  hash(): string;
}

export interface CallableRequest<D> {
  call(): Promise<APIResponse<D>>;
}

export type APIRequest<D> = CallableRequest<D> & Hashable;

export type CallOptions = { failSilently?: boolean; noErrorToast?: boolean };

// eslint-disable-next-line func-style
function runnerHash<B>(args: {
  path: string;
  body: undefined | B;
  method: RESTMethod;
}): string {
  return objectHash(args);
}

class BaseRequestRunner<D> implements CallableRequest<D> {
  @observable
  responseValue: undefined | APIResponse<Readonly<D>>;

  @observable
  isLoading = false;

  @observable
  dispose: null | undefined | (() => void);

  options: CallOptions = {};

  isMounted = false;

  get response(): undefined | Readonly<APIResponse<D>> {
    if (!this.isMounted) {
      /*
       * "Thunk" the mount call. The user has requested the response, but
       * mutation is not allowed during a render pass. `setTimeout(..., 0)`
       * is used to flush the event-loop (and render call stack), before
       * applying the mount.
       */
      setTimeout(() => this.mount(), 0);
    }

    return this.responseValue;
  }

  setOptions(options: CallOptions): BaseRequestRunner<D> {
    this.options = options;
    return this;
  }

  @computed
  get isSuccessful(): boolean {
    const { response } = this;
    return response != null && response.code == 0;
  }

  mount() {
    if (this.isMounted) {
      // Already mounted.
      return;
    }

    this.call();

    this.isMounted = true;
  }

  unmount() {
    const { dispose } = this;
    if (!dispose) {
      return;
    }
    dispose();
    this.dispose = null;
  }

  async call(): Promise<APIResponse<D>> {
    // Reason: string not for the user.
    // eslint-disable-next-line local-rules/unwrapped-i18n
    throw "Not Implemented";
  }
}

class MerchantRequestRunner<B, D> extends BaseRequestRunner<D> {
  path: string;
  body: B | undefined;
  method: RESTMethod;

  // eslint-disable-next-line local-rules/no-large-method-params
  constructor(path: string, body: B | undefined, method: RESTMethod) {
    super();
    this.path = path;
    this.body = body;
    this.method = method;
  }

  async call(): Promise<APIResponse<D>> {
    const { path, body, method, options } = this;

    // if you find this please fix the any types (legacy)
    const bodyToQueryString = (inputBody: any) => {
      if (inputBody) {
        const searchParams = new URLSearchParams(inputBody);
        return `?${searchParams.toString()}`;
      }
      return "";
    };

    this.isLoading = true;
    let resp: undefined | APIResponse<D>;
    try {
      const queryString =
        method && method.toUpperCase() == "GET" ? bodyToQueryString(body) : "";

      resp = await callAsync(`${path}${queryString}`, body, {
        ...options,
        method,
      });
    } catch (e: any) {
      if (!options.failSilently) {
        throw e;
      }
      resp = e;
    } finally {
      this.isLoading = false;
    }

    this.responseValue = resp;

    return resp as APIResponse<D>;
  }
}

type RESTMethod = "GET" | "POST" | "HEAD" | "PUT" | "PATCH";

class ExternalRequestRunner<B, D> extends BaseRequestRunner<D> {
  url: string;
  body: undefined | B;
  method: RESTMethod;

  constructor(args: {
    readonly url: string;
    readonly body: undefined | B;
    readonly method: RESTMethod;
  }) {
    super();
    this.url = args.url;
    this.body = args.body;
    this.method = args.method;
  }

  async call(): Promise<APIResponse<D>> {
    const { url: endpointUrl, options, method } = this;

    this.isLoading = true;
    let resp: undefined | APIResponse<D>;
    try {
      const formData = new FormData();

      const body: any = { ...this.body };
      Object.keys(body).forEach((k) => {
        if (body[k] != null) {
          formData.append(k, body[k]);
        }
      });

      const response = await fetch(endpointUrl, {
        referrerPolicy: "no-referrer-when-downgrade",
        body: method != "GET" && method != "HEAD" ? formData : undefined,
        method,
        mode: "cors",
        credentials: "omit",
      });

      const responseData = await response.json();
      resp = { data: responseData, code: response.status };
    } catch (e: any) {
      if (!options.failSilently) {
        throw e;
      }
      resp = e;
    } finally {
      this.isLoading = false;
    }

    this.responseValue = resp;

    return resp as APIResponse<D>;
  }
}

export class BaseAPIRequest<B, D> implements CallableRequest<D> {
  ["constructor"]: typeof BaseAPIRequest = BaseAPIRequest;
  static runnerRepo: Map<string, BaseRequestRunner<any>> = new Map();

  path: string;
  body: undefined | B;
  method: RESTMethod;

  @observable
  runner: null | undefined | BaseRequestRunner<D>;

  // eslint-disable-next-line local-rules/no-large-method-params
  constructor(path: string, body: undefined | B, method: RESTMethod) {
    this.path = path;
    this.body = body;
    this.method = method;
  }

  initialize() {
    const {
      constructor: { runnerRepo },
    } = this;
    const runner: undefined | BaseRequestRunner<D> = runnerRepo.get(
      this.hash(),
    );

    if (!runner) {
      this.leaseNewRunner();
    } else {
      this.runner = runner;
    }
  }

  get response(): undefined | Readonly<APIResponse<D>> {
    return this.runner?.response;
  }

  setOptions(options: CallOptions): BaseAPIRequest<B, D> {
    const { runner } = this;
    if (runner) {
      runner.setOptions(options);
    }
    return this;
  }

  hash(): string {
    const { path, body, method } = this;
    return runnerHash({ path, body, method });
  }

  @computed
  get isLoading(): boolean {
    return this.runner?.isLoading == true;
  }

  @computed
  get isSuccessful(): boolean {
    return this.runner?.isSuccessful == true;
  }

  async call(): Promise<APIResponse<D>> {
    const { runner } = this;
    if (!runner) {
      return {
        code: 9999,
      };
    }
    return await runner.call();
  }

  refresh() {
    this.leaseNewRunner();
  }

  leaseNewRunner() {
    // Reason: string not for the user.
    // eslint-disable-next-line local-rules/unwrapped-i18n
    throw "Not Implemented";
  }
}

export class ExternalAPIRequest<B, D> extends BaseAPIRequest<B, D> {
  constructor(args: {
    readonly url: string;
    readonly body?: undefined | B;
    readonly method: RESTMethod;
  }) {
    super(args.url, args.body, args.method);
    this.initialize();
  }

  leaseNewRunner() {
    const {
      constructor: { runnerRepo },
      path: url,
      body,
      method,
    } = this;
    const runner: BaseRequestRunner<D> = new ExternalRequestRunner({
      url,
      body,
      method,
    });
    runnerRepo.set(this.hash(), runner);
    this.runner = runner;
  }
}

export class MerchantAPIRequest<B, D> extends BaseAPIRequest<B, D> {
  // eslint-disable-next-line local-rules/no-large-method-params
  constructor(
    path: string,
    body?: undefined | B,
    method?: undefined | RESTMethod,
  ) {
    super(path, body, method || "POST");
    this.initialize();
  }

  leaseNewRunner() {
    const {
      constructor: { runnerRepo },
      path,
      body,
      method,
    } = this;
    const runner: BaseRequestRunner<D> = new MerchantRequestRunner(
      path,
      body || null,
      method || "POST",
    );
    runnerRepo.set(this.hash(), runner);
    this.runner = runner;
  }
}

export const call = (url: string, body: undefined | any): Promise<any> => {
  return new Promise((resolve) => {
    api.call(
      url,
      body,
      // if you find this please fix the any types (legacy)
      (resp: any) => resolve(resp),
      (errResponse: any) => resolve(errResponse),
    );
  });
};

export const launchErrorToast = (message: string) => {
  ToastStore.instance().error(message);
};

// if you find this please fix the any types (legacy)
const apiCallback = (settings: any, resp: any) => {
  const failSilently = settings?.failSilently;
  const noErrorToast = settings?.noErrorToast;
  if (!failSilently && resp.msg && !noErrorToast) {
    launchErrorToast(resp.msg);
  }
};

// eslint-disable-next-line local-rules/no-large-method-params
export const callAsync = (
  url: string,
  body: undefined | any,
  settings?: {
    failSilently?: boolean;
    noErrorToast?: boolean;
    method?: RESTMethod;
  },
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const method = (settings && settings.method) || "POST";
    // if you find this please fix the any types (legacy)
    const callBack = (resp: any) => {
      apiCallback(settings, resp);
      reject(resp);
    };
    switch (method.toUpperCase()) {
      case "GET":
        api.get(url, resolve, callBack);
        break;
      case "PUT":
        api.put(url, body, resolve, callBack);
        break;
      case "POST":
        api.call(url, body, resolve, callBack);
        break;
      case "PATCH":
        api.patch(url, body, resolve, callBack);
        break;
      default:
        throw "invalid HTTP method";
    }
  });
};

type RequestOptions = {
  readonly cache?: boolean;
  readonly relayError?: boolean;
};

type RefreshFn = () => Promise<void>;

const EmptyRequest: MerchantAPIRequest<any, any> = new MerchantAPIRequest(
  "STUB_REQUEST",
  {},
);

export const useRequest = function <B, D>(
  _req?: BaseAPIRequest<B, D>,
  options: RequestOptions = { cache: true, relayError: true },
): [undefined | APIResponse<D>, RefreshFn] {
  const { cache: cacheResponses, relayError } = options;

  const req = _req || EmptyRequest;
  const requestHash = objectHash({
    body: req.body,
    path: req.path,
  });

  const [responseCache, setResponseCache] = useState<{ [key: string]: any }>(
    {},
  );

  const { [requestHash]: cachedResponse } = responseCache;

  useEffect(() => {
    const run = async () => {
      if (cachedResponse != null || req === EmptyRequest) {
        return;
      }
      try {
        const response: APIResponse<D> = await req.call();
        setResponseCache(
          cacheResponses
            ? { ...responseCache, [requestHash]: response }
            : { [requestHash]: response },
        );
      } catch (err) {
        if (relayError) {
          setResponseCache({ [requestHash]: err });
        }
      }
    };
    run();
    // Reason: Eslint wants us to add `req` to the list of
    // dependencies but that causes the effect to fire too
    // often and trigger API calls. `requestHash` is a stronger
    // change signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestHash, cachedResponse, responseCache, cacheResponses]);

  const onRefresh = useCallback(async () => {
    const response: APIResponse<D> = await req.call();
    setResponseCache({ [requestHash]: response });
    // Reason: requestHash is a uniqueness proxy for req
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setResponseCache, requestHash]);

  return [cachedResponse, onRefresh];
};
