import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import GenericHttpError from "@merchant/component/errors/GenericHttpError";

const Error500 = () => {
  const styles = useStylesheet();
  return (
    <PageGuide className={css(styles.root)}>
      <GenericHttpError
        illustration="error500"
        title={i`Sorry! This page isn’t working`}
        description={
          i`An internal server problem may have occurred. ` +
          i`Check back later, or head back to the Dashboard`
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

export default Error500;
