import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import Banner from "../Banner";
import { merchFeUrl } from "@core/toolkit/router";

export type ProductListingFeesBannerProps = BaseProps;

const ProductListingFeesBanner: React.FC<ProductListingFeesBannerProps> = ({
  className,
  style,
}) => {
  const { primary } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={i`NEW: Listing Fees`}
      body={
        i`Starting January 1st 2024, your account may be charged a listing fee based on your inventory ` +
        i`and Wish Standards tier status.`
      }
      bannerImg="bannerProductListingFees"
      cta={{
        text: ci18n(
          "Text on a button, go to the product listing fees page",
          "View more",
        ),
        href: merchFeUrl("/md/products/listing-fees"),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(ProductListingFeesBanner);
