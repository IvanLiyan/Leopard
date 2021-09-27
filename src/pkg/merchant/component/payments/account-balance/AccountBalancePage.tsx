import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Switch } from "@ContextLogic/lego";
import { TopBottomButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import AccountBalancePageHeader from "./AccountBalancePageHeader";
import AccountBalancePager from "./AccountBalancePager";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BalanceData } from "@merchant/api/account-balance";
import { AccountBalanceInitialData } from "@toolkit/account-balance";

type Props = {
  readonly data?: BalanceData;
  readonly initialData: AccountBalanceInitialData;
};

const AccountBalancePage = ({ data, initialData }: Props) => {
  const styles = useStyleSheet();
  const [adminMode, setAdminMode] = React.useState(false);

  const { userStore } = AppStore.instance();
  const isAdmin = userStore.isSuAdmin;

  if (data == null) {
    return <div>No data</div>;
  }

  const {
    funds_frozen: fundsFrozen,
    show_tfa_link: showTFALink,
    show_set_payment_tip: showSetPaymentTip,
    is_main_account: isMainAccount,
    ...pageProps
  } = data;
  return (
    <>
      <div className={css(styles.header)}>
        {isAdmin && (
          <Switch
            className={css(styles.switch)}
            onToggle={() => setAdminMode(!adminMode)}
            isOn={adminMode}
          >
            <div>Admin Mode {adminMode ? "ON" : "OFF"}</div>
          </Switch>
        )}
        <AccountBalancePageHeader
          fundsFrozen={fundsFrozen}
          showTFALink={showTFALink}
          showSetPaymentTip={showSetPaymentTip}
        />
      </div>
      <AccountBalancePager
        {...pageProps}
        adminMode={adminMode}
        initialData={initialData}
      />
      <TopBottomButton
        includedButtons={"top"}
        className={css(styles.topButton)}
      />
    </>
  );
};

const useStyleSheet = () => {
  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = AppStore.instance();
  return React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: "white",
          padding: `0 ${pageX}`,
        },
        switch: {
          paddingRight: 7,
          paddingTop: 10,
        },
        topButton: {
          position: "fixed",
          right: "50px",
          bottom: "100px",
        },
      }),
    [pageX]
  );
};

export default observer(AccountBalancePage);
