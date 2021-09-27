import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react-lite";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { NavSideMenu as SideMenu } from "@ContextLogic/lego";

/* Merchant Components */
import WishForMerchants from "@merchant/component/nav/WishForMerchants";

/* Merchant Stores */
import { useReleaseNotesStore } from "@merchant/stores/release-notes/ReleaseNotesStore";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

export type ReleaseNotesNavbarProps = {
  hideLogo?: boolean;
};

const ReleaseNotesNavbar = ({ hideLogo }: ReleaseNotesNavbarProps) => {
  const styles = useStylesheet();
  const { apiList, baseUrl } = useReleaseNotesStore();
  const navigationStore = useNavigationStore();

  const forDevelopersText = ci18n(
    "placed beside a 'Wish' logo to display 'Wish Developers'. Developers here means 'Software Developers'",
    "Developers",
  );
  return (
    <SideMenu style={styles.root}>
      {!hideLogo && (
        <div className={css(styles.logo)}>
          <WishForMerchants text={forDevelopersText} mode="ink" />
        </div>
      )}
      <h2 className={css(styles.title)}>API Release Notes</h2>
      {apiList &&
        apiList.map(({ api_dependency: apiName, resource }) => (
          <SideMenu.Item
            title={apiName}
            key={resource}
            onClick={() => {
              navigationStore.pushPath(`${baseUrl}/${resource}`);
            }}
            prefixedPadding={40}
          />
        ))}
    </SideMenu>
  );
};

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "sticky",
          "@media (max-width: 640px)": {
            width: 0,
          },
          "@media (min-width: 640px)": {
            width: 340,
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        logo: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 80,
        },
        title: {
          color: textBlack,
          marginTop: 35,
          marginBottom: 60,
          paddingLeft: 40,
          lineHeight: "28px",
        },
      }),
    [textBlack, pageBackground],
  );
};

export default observer(ReleaseNotesNavbar);
