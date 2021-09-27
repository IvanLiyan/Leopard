import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FetchResponse } from "@merchant/model/external/v3-api-explorer/ApiMethodPageState";

export type ApiMethodResponseProps = BaseProps & {
  readonly response: FetchResponse;
};

const buildResponseString = (response: FetchResponse) => {
  const { status, statusText, data, contentType } = response;
  return (
    `${status} ${statusText}\n` +
    `content-type: ${contentType || ""}\n\n` +
    `${data}`
  );
};

const ApiMethodResponse = (props: ApiMethodResponseProps) => {
  const styles = useStylesheet();
  const { response, className } = props;

  const responseString = useMemo(() => buildResponseString(response), [
    response,
  ]);

  if (!response) return null;
  return (
    <div className={css(className)}>
      <h2>Response</h2>
      <SyntaxHighlighter
        language="http"
        style={github}
        className={css(styles.responseContent)}
      >
        {responseString}
      </SyntaxHighlighter>
    </div>
  );
};
export default observer(ApiMethodResponse);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        responseContent: {
          padding: 20,
          boxSizing: "border-box",
        },
      }),
    []
  );
