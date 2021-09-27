import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import GenericHttpError from "@merchant/component/errors/GenericHttpError";

const Error404 = () => {
  const styles = useStylesheet();
  return (
    <PageGuide className={css(styles.root)}>
      <GenericHttpError
        illustration="error404"
        title={i`This page does not exist.`}
        description={
          i`The page you're looking for doesn't exist. ` +
          i`Double-check the URL you typed in, or head back to the Dashboard.`
        }
      />
    </PageGuide>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5% 0px",
        },
      }),
    []
  );
};

export default Error404;
