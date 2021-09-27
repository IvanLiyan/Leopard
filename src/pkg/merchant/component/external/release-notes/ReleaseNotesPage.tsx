import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react-lite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Stores */
import { useReleaseNotesStore } from "@merchant/stores/release-notes/ReleaseNotesStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { usePathParams } from "@toolkit/url";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Type Imports */

import ReleaseNotesContentPage from "./ReleaseNotesContentPage";

const ReleaseNotesPage = () => {
  const styles = useStylesheet();
  const { baseUrl } = useReleaseNotesStore();
  const { resource } = usePathParams(`${baseUrl}/:resource`);
  const navigationStore = useNavigationStore();

  if (!resource) {
    navigationStore.pushPath(`${baseUrl}/oauth`);
  }

  return (
    <div className={css(styles.root)}>
      <ReleaseNotesContentPage resource={resource} />
    </div>
  );
};

export default observer(ReleaseNotesPage);

const useStylesheet = () => {
  const { primaryDark, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflowY: "auto",
          flex: 1,
          backgroundColor: surfaceLightest,
        },
        header: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          minHeight: 80,
          paddingRight: 120,
        },
        headerWrapper: {
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
        },
        headerItem: {
          "@media (max-width: 1000px)": {
            fontSize: 14,
          },
          fontSize: 18,
          height: 28,
          marginRight: 20,
        },
        link: {
          color: primaryDark,
        },
      }),
    [primaryDark, surfaceLightest]
  );
};
