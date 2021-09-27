import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FbsTermsOfService from "@merchant/component/policy/terms/FbsTermsOfService";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const FBSTermsOfServiceContainer = () => {
  const styles = useStylesheet();

  return <FbsTermsOfService className={css(styles.terms)} />;
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        terms: {
          marginTop: 20,
          marginLeft: dimenStore.pageGuideX,
          marginRight: dimenStore.pageGuideX,
          color: textBlack,
          marginBottom: 80,
          /* Extra bottom margin to take care of footer hiding the line */
        },
      }),
    [dimenStore.pageGuideX, textBlack]
  );
};

export default observer(FBSTermsOfServiceContainer);
