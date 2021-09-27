import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import FBSPager from "@merchant/component/logistics/recommendations/wishs-picks/FBSPager";
import FBWPager from "@merchant/component/logistics/recommendations/wishs-picks/FBWPager";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";
import * as fbsApi from "@merchant/api/fbs";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WishsPicksProps = BaseProps & {
  readonly productType: "fbw" | "fbs";
};

const WishsPicks = (props: WishsPicksProps) => {
  const styles = useStylesheet();
  const { className, productType } = props;

  const [fbsTopVariationsResponse] = useRequest(fbsApi.getFBSTopVariations());
  const [fbwTopVariationsResponse] = useRequest(fbwApi.getFBWTopVariations({}));

  const fbsTopVariations = fbsTopVariationsResponse?.data?.results;
  const fbwTopVariations = fbwTopVariationsResponse?.data?.results;
  if (fbsTopVariations == null || fbwTopVariations == null) {
    return <LoadingIndicator />;
  }

  // Combine the same variation that goes to different warehouses
  const combinedVariationsQuantityMap = new Map();
  for (const variation of fbsTopVariations) {
    combinedVariationsQuantityMap.set(
      variation.variation_id,
      (combinedVariationsQuantityMap.get(variation.variation_id) || 0) +
        variation.quantity
    );
  }
  const combinedVariationsMap = new Map();
  for (const variation of fbsTopVariations) {
    if (!combinedVariationsMap.has(variation.variation_id)) {
      combinedVariationsMap.set(variation.variation_id, variation);
    }
  }

  const combinedVariations = Array.from(combinedVariationsMap.values());
  return (
    <div className={css(styles.root, className)}>
      <Card>
        {productType === "fbw" ? (
          <FBWPager fbwTopVariations={fbwTopVariations} />
        ) : (
          <FBSPager
            fbsTopVariations={combinedVariations}
            combinedVariationsQuantityMap={combinedVariationsQuantityMap}
          />
        )}
      </Card>
    </div>
  );
};

export default observer(WishsPicks);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 25,
        },
      }),
    []
  );
};
