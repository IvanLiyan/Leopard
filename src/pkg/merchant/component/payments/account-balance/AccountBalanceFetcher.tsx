import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { MerchantAPIRequest } from "@toolkit/api";

type Props<B, D> = {
  readonly children: (arg0: D | undefined) => React.ReactNode;
  readonly request: MerchantAPIRequest<B, D>;
};

const AccountBalanceFetcher = <B, D>(props: Props<B, D>) => {
  const { children, request } = props;
  const { isLoading, response } = request;
  const styles = useStyleSheet(isLoading);

  if (isLoading) {
    return (
      <div className={css(styles.loadingContainer)}>
        <LoadingIndicator
          type={"swinging-bar"}
          className={css(styles.loadingBar)}
        />
      </div>
    );
  }

  return (
    <div className={css(styles.root)}>
      {children(response?.data || undefined)}
    </div>
  );
};

const useStyleSheet = (loading: boolean) => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          transition: "opacity 0.2s linear",
          opacity: loading ? 0.5 : 1,
        },
        loadingContainer: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 40,
        },
        loadingBar: {
          flex: 1,
          maxWidth: 400,
        },
      }),
    [loading]
  );
};

export default observer(AccountBalanceFetcher);
