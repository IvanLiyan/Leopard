/*
 * ProductListingPlanBanner.tsx
 *
 * Created by Jonah Dlin on Tue Aug 31 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { Illustration } from "@merchant/component/core";

export type ProductListingPlanBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string | undefined;
  };
};

const ProductListingPlanBanner = (props: ProductListingPlanBannerProps) => {
  const { logParams } = props;
  const navigationStore = useNavigationStore();

  const onClickCta = async () => {
    await navigationStore.navigate("/product-listing-plan");
  };

  const { primary, textBlack } = useTheme();

  return (
    <SimpleBannerItem
      title={i`Introducing Product Listing Plan`}
      body={
        i`Use the new Product Listing Plan and charge schedules to streamline ` +
        i`your business and prioritize high-quality, top-selling product listings.`
      }
      textColor={textBlack}
      bannerImg={() => (
        <Illustration
          name="productListingPlanHeader"
          alt={i`Product listing plan`}
        />
      )}
      cta={{
        text: i`View All Plans`,
        onClick: onClickCta,
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "ProductListingPlanBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(ProductListingPlanBanner);
