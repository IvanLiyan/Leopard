import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator, JSONValidator } from "@toolkit/validators";

/* Merchant Components */
import ApiMethodResponse from "@merchant/component/external/api-explorer-v3/ApiMethodResponse";
import AuthTokenButton from "@merchant/component/external/api-explorer-v3/AuthTokenButton";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ApiMethodPageState, {
  FetchResponse,
} from "@merchant/model/external/v3-api-explorer/ApiMethodPageState";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type ApiMethodRequestFormProps = BaseProps & {
  readonly pageState: ApiMethodPageState;
  readonly isStoreOrMerchantUser: boolean | undefined;
};

export type SubmitButtonProps = BaseProps & {
  readonly onReceivedResp: (token: string) => unknown;
};

const ApiMethodRequestForm = (props: ApiMethodRequestFormProps) => {
  const styles = useStylesheet();
  const { pageState, className, isStoreOrMerchantUser } = props;
  const {
    methodData: { httpVerb },
    params,
    hideAccessToken,
    canSubmit,
    requestBody,
    needReqBody,
    setReqBody,
  } = pageState;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [response, setResponse] = useState<FetchResponse | null>(null);

  useEffect(() => {
    pageState.hasAccessToken = !!accessToken;
  }, [accessToken, pageState]);

  const requiredValidator = new RequiredValidator();
  const jsonValidator = new JSONValidator({
    customMessage: i`Error: Request body is not a valid JSON object.`,
  });

  const renderRequestBody = () => {
    if (!needReqBody) return null;
    return (
      <>
        <h2>Request Body</h2>
        <TextInput
          isTextArea
          height={200}
          className={css(styles.requestBody)}
          value={requestBody}
          onChange={({ text }) => setReqBody(text)}
          validators={[jsonValidator]}
        />
      </>
    );
  };

  const callApiMethod = async () => {
    const { url, queryParams } = pageState;
    const { env } = AppStore.instance();

    let options: RequestInit = {
      method: httpVerb.toUpperCase(),
      body: needReqBody ? requestBody : null,
    };
    let params = { ...queryParams };
    // put access token in url param for testing and staging env
    // Context of the error if we don't do this https://jira.wish.site/browse/CORE-199
    if (env.includes("qa_staging") || env.includes("testing")) {
      params = {
        ...params,
        access_token: accessToken || "",
      };
    } else {
      options = {
        ...options,
        headers: { Authorization: `Bearer ${accessToken || ""}` },
      };
    }
    const urlWithQuery = `${url}?${(window as any).$.param(params)}`;

    const resp = await fetch(urlWithQuery, options);
    const contentType = resp.headers.get("content-type");
    let data = "";
    if (contentType && contentType.includes("application/json")) {
      data = await resp.json();
      data = JSON.stringify(data, null, 2);
    } else {
      data = await resp.text();
    }
    setResponse({
      status: resp.status,
      statusText: resp.statusText,
      data,
      contentType,
    });
  };

  return (
    <div className={css(className)}>
      <HorizontalField
        className={css(styles.paramField)}
        title={i`HTTP method`}
        titleWidth={150}
      >
        <TextInput
          className={css(styles.textInput)}
          value={httpVerb}
          disabled
        />
      </HorizontalField>
      {!hideAccessToken && (
        <HorizontalField
          className={css(styles.paramField)}
          title={i`Access token`}
          titleWidth={150}
          required
        >
          <div className={css(styles.accessTokenContentWrapper)}>
            <TextInput
              className={css(styles.textInput)}
              value={accessToken}
              onChange={({ text }) => {
                setAccessToken(text);
              }}
              validators={[requiredValidator]}
            />
            <AuthTokenButton
              isStoreOrMerchantUser={isStoreOrMerchantUser}
              className={css(styles.accessTokenBtn)}
              onTokenGet={(token) => {
                setAccessToken(token);
              }}
            >
              Get temporary token
            </AuthTokenButton>
          </div>
          <Link href="/documentation/api/v3/oauth" openInNewTab>
            Learn how to obtain an access token
          </Link>
        </HorizontalField>
      )}
      {params &&
        Object.keys(params).map((name) => {
          const param = params[name];
          if (param == null) {
            return null;
          }

          const { required, description } = param;
          return (
            <HorizontalField
              className={css(styles.paramField)}
              key={name}
              title={name}
              titleWidth={150}
              required={required}
              popoverContent={description}
            >
              <TextInput
                className={css(styles.textInput)}
                key={name}
                value={params[name] ? params[name].value : undefined}
                onChange={({ text }) => {
                  params[name].value = text;
                }}
                validators={required ? [requiredValidator] : undefined}
              />
            </HorizontalField>
          );
        })}
      {renderRequestBody()}
      <PrimaryButton
        className={css(styles.submitBtn)}
        isDisabled={(!hideAccessToken && !accessToken) || !canSubmit}
        onClick={callApiMethod}
      >
        Submit
      </PrimaryButton>
      {response && (
        <ApiMethodResponse
          className={css(styles.response)}
          response={response}
        />
      )}
    </div>
  );
};

export default observer(ApiMethodRequestForm);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        methodField: {
          maxWidth: 380,
          marginBottom: 60,
        },
        accessTokenField: {
          marginBottom: 35,
        },
        accessTokenContentWrapper: {
          display: "flex",
          alignItems: "center",
        },
        textInput: {
          maxWidth: 488,
          flex: 1,
        },
        accessTokenBtn: {
          margin: "1px 0px 1px 24px",
        },
        paramField: {
          marginBottom: 20,
        },
        submitBtn: {
          maxWidth: 180,
          marginLeft: 190,
        },
        response: {
          maxWidth: 678,
        },
        requestBody: {
          maxWidth: 678,
          paddingBottom: 20,
        },
      }),
    []
  );
