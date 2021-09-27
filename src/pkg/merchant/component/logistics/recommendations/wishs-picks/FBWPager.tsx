/*eslint-disable filenames/match-regex*/
import React from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import EmptyState from "@merchant/component/logistics/recommendations/wishs-picks/EmptyState";
import FBWTopVariations from "@merchant/component/logistics/recommendations/wishs-picks/FBWTopVariations";

import { FBWTopVariation } from "@merchant/api/fbw";

export type FBWPagerProps = {
  readonly fbwTopVariations: ReadonlyArray<FBWTopVariation>;
};

const FBWPager = (props: FBWPagerProps) => {
  const { fbwTopVariations } = props;

  return (
    <>
      {fbwTopVariations.length > 0 ? (
        <FBWTopVariations data={fbwTopVariations} />
      ) : (
        <EmptyState
          text={
            i`Check back soon! You will see high-potential FBW products` +
            i` here specifically picked for you by Wish when they become available.`
          }
        />
      )}
    </>
  );
};

export default observer(FBWPager);
