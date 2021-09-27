import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const MerchantSearchDiscovery = observer((props: BaseProps) => {
  const { className, style } = props;
  const {
    userStore: { recentSu, isMerchant },
    routeStore: { currentPath },
  } = useStore();
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.sectionTitle)}>Recent Logins</div>
      {recentSu.map((su) => {
        const redirectPath = isMerchant && su.is_merchant ? currentPath : "/";
        return (
          <Link
            key={su.id}
            href={`/go/${su.id}?next=${encodeURIComponent(
              redirectPath || "/"
            )}`}
            className={css(styles.item)}
          >
            <div className={css(styles.itemTitle)}>{su.display_name}</div>
          </Link>
        );
      })}
    </div>
  );
});

export default MerchantSearchDiscovery;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: palettes.textColors.White,
        },
        sectionTitle: {
          fontSize: 15,
          padding: "10px 5px",
          fontWeight: fonts.weightSemibold,
        },
        item: {
          padding: "10px 5px",
        },
        itemTitle: {
          fontSize: 17,
          margin: "2px 0px",
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.Ink,
        },
      }),
    []
  );
};
