import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold } from "@toolkit/fonts";

/* Merchant Components */
import GenericHttpError from "@merchant/component/errors/GenericHttpError";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type BasePageProps = BaseProps & {
  readonly type: "home" | "404";
};

const BasePage = (props: BasePageProps) => {
  const { className, type } = props;
  const styles = useStylesheet();
  const rootStyle = css(className);
  return (
    <div className={css(rootStyle)}>
      {type === "home" ? (
        <div className={css(styles.content)}>
          <h2>Welcome to the Wish API Explorer!</h2>
          <p>API Explorer is a tool to help you learn about the Wish API V3.</p>
          <p>
            For each endpoint, you will be able to submit a request with your
            own parameters and see the response for the request.
          </p>
          <p>Choose an endpoint on the left to get started.</p>
          <p>
            If you don't see the the endpoint you are looking for, it may be
            located in Wish V2 API Explorer.
          </p>
          <Link openInNewTab href="/documentation/api/v2/explorer/">
            Wish V2 API Explorer
          </Link>
        </div>
      ) : (
        <PageGuide>
          <GenericHttpError
            illustration="error404"
            title={i`This page does not exist.`}
            description={i`The page you're looking for doesn't exist. `}
          />
        </PageGuide>
      )}
    </div>
  );
};
export default observer(BasePage);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "28px 60px",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
        },
        header: {
          backgroundColor: palettes.greyScaleColors.Grey,
          height: 84,
          fontSize: 28,
          fontWeight: weightBold,
          padding: "25px 60px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }),
    []
  );
