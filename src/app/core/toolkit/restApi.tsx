import React, { useMemo } from "react";
import useSWR, { Fetcher, SWRConfiguration, SWRResponse } from "swr";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import axios, { Method } from "axios";
import Cookies from "js-cookie";

import { isProd } from "@core/stores/EnvironmentStore";
import { useToastStore } from "@core/stores/ToastStore";
import { merchFeURL, useRouter } from "@core/toolkit/router";

const REST_ERROR_CODES = {
  SESSION_EXPIRED: 2,
  SECURE_SESSION_EXPIRED: 3,
};

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

const useFetcher = <TResponse, TRequest>() => {
  const toastStore = useToastStore();
  const router = useRouter();

  const fetcher: Fetcher<
    TResponse | undefined,
    RestApiConfig<TRequest>
  > = async (
    key: RestApiConfig<TRequest>,
    arg?: { readonly arg: TRequest },
  ) => {
    const { url, method, body: bodyFromKey } = key;

    const body = arg ? arg.arg : bodyFromKey; // prioritize args if they exist
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
        const currentPath = window.location.pathname;
        // session expired
        if (
          error.response?.data?.code == REST_ERROR_CODES.SESSION_EXPIRED &&
          error.response?.data?.data?.session_expired == true
        ) {
          const loginUrl = `/login?next=${encodeURI(currentPath)}`;
          toastStore.error(
            error.response.data.msg
              ? String(error.response.data.msg)
              : i`Something went wrong`,
          );
          // shli TODO: remove merchFeURL after login page live
          void router.push(merchFeURL(loginUrl));

          return undefined;
        }

        // secure session expired
        if (
          error.response?.data?.code ==
            REST_ERROR_CODES.SECURE_SESSION_EXPIRED &&
          error.response?.data?.data?.secure_session_expired == true
        ) {
          const reloginUrl = `/relogin-secure?next=${encodeURI(currentPath)}`;
          toastStore.error(
            error.response.data.msg
              ? String(error.response.data.msg)
              : i`Something went wrong`,
          );
          void router.push(merchFeURL(reloginUrl));

          return undefined;
        }

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
          toastStore.error(errorMessage, {
            timeoutMs: 30 * 1000,
          });
        } else {
          toastStore.error(i`Something went wrong`);
        }

        return undefined;
      });
  };

  return fetcher;
};

/**
 * Hook for handling REST API call
 * - Example: const { data, isLoading } = useRequest<GetCaptchaResponse>({ url: "/api/captcha_token" });
 *
 * @param restApiConfig configuration for the Axios API call; contains:
 *  - url: server url for the request
 *  - method (optional): request method, default to POST
 *  - body (optional): request body (object type)
 *
 * pass null to skip the query
 *
 * @param options options for SWR hook (see https://swr.vercel.app/docs/api#options for more details)
 *
 * @returns an SWR object (see https://swr.vercel.app/docs/api#return-values for more details)
 */
export const useRequest = <TResponse, TRequest = RestApiBody>(
  restApiConfig: RestApiConfig<TRequest> | null,
  options?: SWRConfiguration,
): SWRResponse<TResponse | undefined> => {
  const fetcher = useFetcher<TResponse, TRequest>();
  return useSWR(restApiConfig, fetcher, options);
};

// TODO [lliepert]: proper docs
export const useMutation = <TResponse, TRequest = RestApiBody>(
  restApiConfig: RestApiConfig<TRequest> | null,
  // options?: SWRMutationConfiguration,
): SWRMutationResponse<TResponse | undefined, unknown, TRequest> => {
  const fetcher = useFetcher<TResponse, TRequest>();
  return useSWRMutation(restApiConfig, fetcher);
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
