import React, { useMemo, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import ClientSettingsPrivateApp from "@merchant/component/external/merchant-apps/ClientSettingsPrivateApp";
import ClientSettingsConnectedApps from "@merchant/component/external/merchant-apps/ClientSettingsConnectedApps";
import ClientSettingsAppStoreBanner from "@merchant/component/external/merchant-apps/ClientSettingsAppStoreBanner";

/* Merchant Model */
import {
  MerchantAppPreviewState,
  PrivateAppCreationState,
} from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

const ClientSettingsContainer = () => {
  const styles = useStylesheet();
  const { current: creationState } = useRef(new PrivateAppCreationState());
  const { current: previewState } = useRef(new MerchantAppPreviewState());

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.clientSettingsContainer)}>
        <Text weight="bold" className={css(styles.title)}>
          API Settings
        </Text>
        <ClientSettingsAppStoreBanner style={{ marginBottom: 36 }} />
        <ClientSettingsConnectedApps />
        <ClientSettingsPrivateApp
          creationState={creationState}
          previewState={previewState}
        />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: 24,
          color: palettes.textColors.Ink,
          lineHeight: 1.5,
          marginBottom: 48,
        },
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          minHeight: "100vh",
          flex: 1,
        },
        clientSettingsContainer: {
          width: "calc(100% - 48px)",
          maxWidth: "1000px",
          padding: "48px 48px 150px 48px",
        },
      }),
    []
  );
};

export default observer(ClientSettingsContainer);
