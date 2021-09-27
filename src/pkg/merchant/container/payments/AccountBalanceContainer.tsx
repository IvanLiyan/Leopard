import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import AccountBalancePage from "@merchant/component/payments/account-balance/AccountBalancePage";
import AccountBalanceFetcher from "@merchant/component/payments/account-balance/AccountBalanceFetcher";

/* Merchant API */
import { getAccountBalance } from "@merchant/api/account-balance";

import { AccountBalanceInitialData } from "@toolkit/account-balance";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

type Props = {
  readonly initialData: AccountBalanceInitialData;
};

const AccountBalanceContainer = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = useStore();

  // WelcomeHeader's padding props are added as such:
  // padding: paddingY + " " + paddingX
  // The padding here is a workaround to set paddingBottom = 0.
  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Account Balance`}
        hideBorder
        paddingX={`20px ${pageX} 0 ${pageX}`}
        paddingY=""
      />
      <AccountBalanceFetcher request={getAccountBalance()}>
        {(data) => <AccountBalancePage data={data} initialData={initialData} />}
      </AccountBalanceFetcher>
    </div>
  );
};

const useStylesheet = () => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
          fontFamily: fonts.proxima,
        },
      }),
    []
  );
};

export default observer(AccountBalanceContainer);
