/*eslint-disable filenames/match-regex*/
import React from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import EmptyState from "@merchant/component/logistics/recommendations/wishs-picks/EmptyState";
import FBSTopVariations from "@merchant/component/logistics/recommendations/wishs-picks/FBSTopVariations";

import { FBSTopVariation } from "@merchant/api/fbs";

export type FBSPagerProps = {
  readonly fbsTopVariations: ReadonlyArray<FBSTopVariation>;
  readonly combinedVariationsQuantityMap: Map<string, number>;
};

const FBSPager = (props: FBSPagerProps) => {
  const { fbsTopVariations, combinedVariationsQuantityMap } = props;

  return (
    <>
      {fbsTopVariations.length > 0 ? (
        <FBSTopVariations
          data={fbsTopVariations}
          combinedVariationsQuantityMap={combinedVariationsQuantityMap}
        />
      ) : (
        <EmptyState
          text={
            i`Check back soon! You will see high-potential FBS products` +
            i` here specifically picked for you by Wish when they become available.`
          }
        />
      )}
    </>
  );
};

export default observer(FBSPager);
