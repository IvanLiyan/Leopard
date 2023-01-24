import React, { useMemo } from "react";
import useSWR, { Fetcher, SWRResponse } from "swr";
import axios, { Method } from "axios";
import Cookies from "js-cookie";

import { isProd } from "@core/stores/EnvironmentStore";
import { ToastStoreRef } from "@core/stores/ToastStore";

export type RestApiResponse<TResponse> = {
  readonly code: number;
  readonly data?: TResponse;
  readonly msg?: string;
};

export type RestApiBody = Record<string, unknown>;

export type RestApiConfig<TRequest = RestApiBody> = {
  readonly url: string;
  readonly method?: Method;
  readonly body?: TRequest;
};

export type addSuffixToObject<T, S extends string> = {
  [K in keyof T as K extends string ? `${K}${S}` : never]: T[K];
};

export type SWRResponseWithSuffix<
  TResponse,
  TSuffix extends string,
> = addSuffixToObject<SWRResponse<TResponse>, TSuffix>;

/**
 * Hook for handling REST API call
 * - Example: const { data, isLoading } = useRequest<GetCaptchaResponse>({ url: "captcha_token" });
 * @param queryParams api query params containing
 *  - url: server url for the request
 *  - method (optional): request method, default to POST
 *  - body (optional): request body (object type)
 * @param options options for SWR hook
 * @returns
 *  - data: response data
 *  - error: error
 *  - isLoading: if there's an ongoing request and no "loaded data"
 *  - isValidating: if there's a request or revalidation loading
 *  - mutate: function to mutate the cached data
 */
export const useRequest = <TResponse, TRequest = RestApiBody>(
  queryParams: RestApiConfig<TRequest>,
  options?: {
    revalidateOnFocus?: boolean;
  },
): SWRResponse<TResponse | undefined> => {
  const { url, method, body } = queryParams;
  const { revalidateOnFocus = false } = options ?? {};

  const formattedUrl = useMemo(() => {
    if (!url.startsWith("/api/")) {
      return "/api/" + url;
    }
    return url;
  }, [url]);

  const fetcher: Fetcher<
    TResponse | undefined,
    RestApiConfig<TRequest>
  > = async (params: RestApiConfig<TRequest>) => {
    const { url, method, body } = params;

    const bodyFormData = new FormData();
    if (body != null) {
      Object.keys(body).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        bodyFormData.append(key, (body as any)[key]);
      });
    }

    return axios<RestApiResponse<TResponse>>({
      url,
      method: method || "POST",
      data: bodyFormData,
      headers: {
        "X-XSRFToken": Cookies.get("_xsrf"),
      },
    })
      .then(({ data }) => {
        return data.data;
      })
      .catch((error) => {
        if (!isProd) {
          let errorMessage = i`Unknown API Error`;
          if (error.response && error.response.data) {
            errorMessage = `[API Error] Message: ${error.response.data.msg}, Status Code: ${error.response.status}`;
          } else if (error.message) {
            errorMessage = `[API Error] Message: ${error.message}`;
          }

          // Want a console log here for debugging in development
          // eslint-disable-next-line no-console
          console.log(errorMessage);
          ToastStoreRef.current?.error(errorMessage, {
            timeoutMs: 30 * 1000,
          });
        } else {
          ToastStoreRef.current?.error(i`Something went wrong`);
        }
        return undefined;
      });
  };

  const { data, error, isValidating, isLoading, mutate } = useSWR(
    { url: formattedUrl, method, body },
    fetcher,
    { revalidateOnFocus },
  );

  return {
    data,
    error,
    isValidating,
    isLoading,
    mutate,
  };
};

export type WithRestApiProps<
  TResponse,
  TSuffix extends string,
  TRequest = RestApiBody,
> = SWRResponseWithSuffix<TResponse | undefined, TSuffix> &
  RestApiConfig<TRequest>;

/**
 * A HOC that wraps the given component with useRequest hook.
 * You can use it for wrapping class component that contains rest api call.
 * - Usage: withResApi<ApiResponseType, ComponentInputPropsType, PropNameSuffix, ApiRequestType(optional)>(Component)
 * - ComponentInputPropsType = OriginalInputType & WithRestApiProps
 *     - The input of useRequest needs to be passed as props to the resulting component
 *     - The response of useRequest will be automatically available as props in the resulting component
 * - Please see CaptchaInput.tsx as an example
 */
export const withRestApi = <
  TResponse,
  TProps extends WithRestApiProps<TResponse, TSuffix, TRequest>,
  TSuffix extends string,
  TRequest = RestApiBody,
>(
  WrappedComponent: React.ComponentType<TProps>,
  suffix: TSuffix,
) => {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithRestApi = (
    props: Omit<
      TProps,
      keyof SWRResponseWithSuffix<TResponse | undefined, string>
    >,
  ) => {
    const { url, method, body } = props;
    const responseData = useRequest<TResponse, TRequest>({
      url,
      method,
      body,
    });

    const formattedResponseData = useMemo(() => {
      return Object.fromEntries(
        Object.entries(responseData).map(([k, v]) => [`${k}${suffix}`, v]),
      ) as SWRResponseWithSuffix<TResponse | undefined, TSuffix>;
    }, [responseData]);

    return (
      <WrappedComponent {...formattedResponseData} {...(props as TProps)} />
    );
  };

  ComponentWithRestApi.displayName = `withRestApi(${displayName})`;

  return ComponentWithRestApi;
};
