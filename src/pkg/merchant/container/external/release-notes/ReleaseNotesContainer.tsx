import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Merchant Components */
import ReleaseNotesNavbar from "@merchant/component/external/release-notes/ReleaseNotesNavbar";
import ReleaseNotesPage from "@merchant/component/external/release-notes/ReleaseNotesPage";
import PartnerDeveloperSiteNavbar from "@merchant/component/nav/chrome/partner-developer/PartnerDeveloperSiteNavbar";
import SiteFooter from "@merchant/component/nav/SiteFooter";

/* Merchant API */
import { getApiList } from "@merchant/api/release-notes";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import {
  ReleaseNotesStoreProvider,
  useReleaseNotesStore,
} from "@merchant/stores/release-notes/ReleaseNotesStore";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

const ReleaseNotesContainer = () => {
  const styles = useStylesheet();
  const { loading } = useReleaseNotesStore();
  const { surfaceLightest } = useTheme();

  useRequest(getApiList({}));

  return loading ? (
    <LoadingIndicator className={css(styles.loading)} />
  ) : (
    <div className={css(styles.root)}>
      <PartnerDeveloperSiteNavbar background={surfaceLightest} />
      <div className={css(styles.content)}>
        <ReleaseNotesNavbar hideLogo />
        <ReleaseNotesPage />
      </div>
      <SiteFooter className={css(styles.footer)} />
    </div>
  );
};

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "absolute",
          backgroundColor: surfaceLightest,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        content: {
          display: "flex",
          marginTop: 80,
          flex: "1 0 auto",
        },
        loading: {
          margin: "300px 50%",
        },
        footer: {
          flexShrink: 0,
        },
      }),
    [surfaceLightest]
  );
};

export default observer(() => (
  <ReleaseNotesStoreProvider>
    <ReleaseNotesContainer />
  </ReleaseNotesStoreProvider>
));
