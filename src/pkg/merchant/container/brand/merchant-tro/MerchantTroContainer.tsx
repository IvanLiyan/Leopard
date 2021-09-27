import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant Components */
import MerchantTroCards from "@merchant/component/brand/merchant-tro/MerchantTroCards";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

const MerchantTroContainer = () => {
  const styles = useStylesheet();

  const dimenStore = useDimenStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Legal Injunctions & Temporary Restraining Orders`}
        paddingX={pageX}
        body={
          i`Injunctions are issued by court against merchants ` +
          i`allegedly infringing on a plaintiff's intellectual property. ` +
          i`This page presents the injunctions issued against your store.`
        }
      >
        <Alert
          className={css(styles.alert)}
          text={
            i`To expedite the reopening of your store, consider hiring ` +
            i`a lawyer to represent your business.`
          }
          sentiment="info"
          link={{
            text: i`Learn more`,
            url: zendeskURL("360008058353"),
          }}
        />
      </WelcomeHeader>
      <MerchantTroCards style={css(styles.cards)} />
    </div>
  );
};

const useStylesheet = () => {
  const dimenStore = useDimenStore();
  const { pageBackground } = useTheme();

  const pageX = dimenStore.pageGuideXForPageWithTable;
  return useMemo(
    () =>
      StyleSheet.create({
        alert: {
          marginTop: 30,
        },
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        cards: {
          padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
        },
      }),
    [pageX, pageBackground]
  );
};

export default observer(MerchantTroContainer);
