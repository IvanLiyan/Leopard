import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { NavigationNode } from "@toolkit/chrome";
import { useNodeCount } from "@toolkit/chrome";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import NotificationCountBadge from "@merchant/component/nav/chrome/badges/NotificationCountBadge";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly node: NavigationNode;
};

export default observer((props: Props) => {
  const { className, style, node } = props;
  const {
    navigationStore: { pageSearchResult },
  } = useStore();
  const styles = useStylesheet();
  const { primary, textLight } = useTheme();

  const isCurrentPage = node.url == pageSearchResult?.url;
  const notificationCount = useNodeCount(node.show_in_side_menu ? node : null);

  return (
    <Link
      className={css(styles.root, className, style)}
      href={node.url}
      key={node.label}
      style={{
        color: isCurrentPage ? primary : textLight,
      }}
    >
      {node.label}

      {/* Weird rendering issue with && conditional */}
      {/* eslint-disable-next-line local-rules/no-verbose-conditional */}
      {notificationCount && notificationCount > 0 ? (
        <NotificationCountBadge
          count={notificationCount}
          className={css(styles.badge)}
        />
      ) : null}
    </Link>
  );
});

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        badge: {
          marginLeft: 10,
        },
      }),
    [],
  );
};
