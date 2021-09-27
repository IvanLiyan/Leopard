import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import MerchantPayoutServiceTerms from "@merchant/component/policy/terms/MerchantPayoutServiceTerms";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const MerchantPayoutServiceTermsContainer = () => {
  const styles = useStylesheet();

  return <MerchantPayoutServiceTerms className={css(styles.terms)} />;
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  return useMemo(
    () =>
      StyleSheet.create({
        terms: {
          marginTop: 20,
          marginLeft: dimenStore.pageGuideX,
          marginRight: dimenStore.pageGuideX,
          color: palettes.textColors.Ink,
          marginBottom: 80,
          /* Extra bottom margin to take care of footer hiding the line */
        },
      }),
    [dimenStore.pageGuideX]
  );
};

export default observer(MerchantPayoutServiceTermsContainer);
