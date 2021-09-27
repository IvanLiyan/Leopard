import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { WelcomeHeader } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import WishExpressTermsOfService from "@merchant/component/wish-express/terms/WishExpressTermsOfService";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const WishExpressTermsOfServiceContainer = () => {
  const styles = useStylesheet();
  const { dimenStore } = AppStore.instance();

  /* eslint-disable local-rules/no-unnecessary-i-tag */
  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        className={css(styles.header)}
        title={() => {
          return (
            <div className={css(styles.headerTitle)}>
              <Illustration
                name="wishExpressWithText"
                alt={i`Wish Express Logo`}
                style={{ marginBottom: 10 }}
              />
              <Text weight="bold">{i`Qualifications and Terms`}</Text>
            </div>
          );
        }}
        paddingX={dimenStore.pageGuideX}
        illustration="thirdPartyBrandedGoodsDeclaration"
      />
      <WishExpressTermsOfService
        className={css(styles.p)}
        style={{
          marginLeft: dimenStore.pageGuideX,
          marginRight: dimenStore.pageGuideX,
        }}
      />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        header: {
          marginBottom: 40,
        },
        headerTitle: {
          flex: 1,
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          fontSize: 32,
          lineHeight: "40px",
          color: palettes.textColors.Ink,
        },
        p: {
          color: palettes.textColors.Ink,
          marginBottom: 80,
          /* Extra bottom margin to take care of footer hiding the line */
        },
      }),
    []
  );
};

export default observer(WishExpressTermsOfServiceContainer);
