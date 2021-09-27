/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as merchantAppsApi from "@merchant/api/merchant-apps";

/* Merchant Model */
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

/* Relative Imports */
import MerchantAppForm from "./form/MerchantAppForm";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

export type MerchantAppUpdateProps = BaseProps & {
  readonly fromRejectedChange?: boolean;
};

const MerchantAppUpdate = (props: MerchantAppUpdateProps) => {
  const styles = useStylesheet();
  const { fromRejectedChange } = props;
  const [clientId, setClientId] = useState("");
  const [updateState, setUpdateState] = useState(new MerchantAppGlobalState());
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await merchantAppsApi.getMerchantApp({}).call();
      let merchantApp = resp.data?.merchant_app;

      if (merchantApp) {
        if (
          fromRejectedChange ||
          merchantApp.listing_state_name == "UPDATED_PENDING"
        ) {
          const changedData = merchantApp.changed_data || {};
          merchantApp = { ...merchantApp, ...changedData };
        }

        setUpdateState(new MerchantAppGlobalState({ props: merchantApp }));
        setClientId(merchantApp.client_id);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fromRejectedChange]);

  if (isLoading) {
    return <LoadingIndicator className={css(styles.loading)} />;
  }

  return (
    <div className={css(styles.root)}>
      <StaggeredFadeIn className={css(styles.body)} animationDurationMs={800}>
        <div className={css(styles.headerRoot)}>
          <div className={css(styles.headerMain)}>Make changes to your app</div>
          <div className={css(styles.headerBody)}>
            Edit details for your app listing
          </div>
        </div>

        <div className={css(styles.form)}>
          <MerchantAppForm
            submitAction="update"
            clientId={clientId}
            globalFormState={updateState}
          />
        </div>
      </StaggeredFadeIn>
    </div>
  );
};

export default observer(MerchantAppUpdate);

const useStylesheet = () => {
  const { dimenStore } = useStore();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        headerRoot: {
          fontFamily: fonts.proxima,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          padding: `20px ${dimenStore.pageGuideX}`,
          userSelect: "none",
          backgroundColor: "#f8fafb",
        },
        headerMain: {
          fontSize: 24,
          fontWeight: fonts.weightBold,
          lineHeight: 1.25,
          color: palettes.textColors.Ink,
        },
        headerBody: {
          fontSize: 20,
          lineHeight: 1.4,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
        },
        body: {
          padding: `0px ${dimenStore.pageGuideX} 20px ${dimenStore.pageGuideX}`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: palettes.textColors.White,
        },
        title: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          marginBottom: 25,
          fontSize: 25,
          lineHeight: 1.33,
        },
        form: {
          backgroundColor: "#f8fafb",
        },
        loading: {
          margin: "300px 50%",
        },
      }),
    [dimenStore.pageGuideX]
  );
};
