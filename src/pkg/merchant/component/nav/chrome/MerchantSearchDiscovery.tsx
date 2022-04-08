import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useUserStore } from "@stores/UserStore";
import { useNavigationStore } from "@stores/NavigationStore";

import Link from "@next-toolkit/Link";

const MerchantSearchDiscovery = observer((props: BaseProps) => {
  const { className, style } = props;
  const { recentUsers, isMerchant } = useUserStore();
  const { currentPath } = useNavigationStore();
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.sectionTitle)}>Recent Logins</div>
      {recentUsers.map((su) => {
        const redirectPath = isMerchant && su.isMerchant ? currentPath : "/";
        return (
          <Link
            key={su.id}
            href={`/go/${su.id}?next=${encodeURIComponent(
              redirectPath || "/",
            )}`}
            className={css(styles.item)}
          >
            <div className={css(styles.itemTitle)}>{su.displayName}</div>
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
    [],
  );
};
