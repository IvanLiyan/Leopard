import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import ThirdPartyEthicsHotline from "@merchant/component/policy/ethics-hotline/ThirdPartyEthicsHotline";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const ThirdPartyEthicsHotlineContainer = () => {
  const styles = useStylesheet();
  const { dimenStore } = useStore();

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        className={css(styles.header)}
        title={i`Third Party Ethics Hotline`}
        paddingX={dimenStore.pageGuideX}
      />
      <ThirdPartyEthicsHotline
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
        p: {
          color: palettes.textColors.Ink,
          marginBottom: 80,
        },
      }),
    []
  );
};

export default observer(ThirdPartyEthicsHotlineContainer);
