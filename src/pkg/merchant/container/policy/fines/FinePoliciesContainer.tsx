import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant Components */
import FinePolicies from "@merchant/component/policy/fines/policies/FinePolicies";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const FinePoliciesContainer = () => {
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  const styles = useStylesheet();
  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={() => {
          return (
            <Text weight="bold" className={css(styles.title)}>
              Penalty policies
            </Text>
          );
        }}
        body={
          i`Penalties are issued when your products, orders or your ` +
          i`store violated Wish policies. This page presents ` +
          i`a list of Wish penalties.`
        }
        paddingX={pageX}
        illustration="finesPolicyHeader"
      />
      <FinePolicies
        style={{ padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}` }}
      />
    </div>
  );
};

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: colors.pageBackground,
    },
    title: {
      backgroundColor: "#ffffff",
      marginTop: 25,
    },
  });

export default observer(FinePoliciesContainer);
