///

/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Model */
import MerchantAppGlobalState from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

/* Relative Imports */
import MerchantAppForm from "./form/MerchantAppForm";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const MerchantAppCreate = () => {
  const styles = useStylesheet();
  const [creationState] = useState(new MerchantAppGlobalState());

  return (
    <div className={css(styles.root)}>
      <StaggeredFadeIn className={css(styles.body)} animationDurationMs={800}>
        <div className={css(styles.headerRoot)}>
          <div className={css(styles.headerMain)}>Publish an app</div>
          <div className={css(styles.headerBody)}>
            Built a great app for Wish and want to share it with other
            merchants? Submit it here.
          </div>
        </div>

        <div className={css(styles.form)}>
          <MerchantAppForm
            submitAction="create"
            globalFormState={creationState}
          />
        </div>
      </StaggeredFadeIn>
    </div>
  );
};

export default observer(MerchantAppCreate);

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
