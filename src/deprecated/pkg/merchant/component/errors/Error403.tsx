import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import PageGuide from "@merchant/component/core/PageGuide";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import GenericHttpError from "@merchant/component/errors/GenericHttpError";

const Error403 = () => {
  const styles = useStylesheet();
  return (
    <PageGuide className={css(styles.root)}>
      <GenericHttpError
        illustration="error403"
        title={i`You don’t have access to this page.`}
        description={i`Please contact the admin for authorization.`}
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

export default Error403;
