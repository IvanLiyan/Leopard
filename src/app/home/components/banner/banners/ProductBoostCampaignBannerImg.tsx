import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import numeral from "numeral";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@core/components/Illustration";
import { css } from "@core/toolkit/styling";
import { Heading } from "@ContextLogic/atlas-ui";
import { AutomatedCampaign } from "@home/toolkit/product-boost";
import ProductImage from "@core/components/products/ProductImage";

export type ProductBoostCampaignBannerImgProps = BaseProps & {
  readonly campaign: AutomatedCampaign;
};

const ProductBoostCampaignBannerImg: React.FC<
  ProductBoostCampaignBannerImgProps
> = ({ className, style, campaign }) => {
  const styles = useStylesheet();
  const discountStr = numeral(campaign.discount).format("0%");

  return (
    <div className={css(styles.root, className, style)}>
      <ProductImage
        className={css(styles.productImage)}
        productId={campaign.product_id}
      />

      <Illustration
        className={css(styles.bannerImage)}
        draggable={false}
        name="bannerProductBoostAutomatedCampaign"
        alt="bannerImg"
      />
      <Heading
        className={css(styles.discountStr)}
        component="span"
        variant="d2"
      >
        {discountStr}
      </Heading>
    </div>
  );
};
export default observer(ProductBoostCampaignBannerImg);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
          height: "112px",
          // eslint-disable-next-line local-rules/validate-root
          minWidth: "400px",
          boxShadow: "0 4px 12px 0 rgba(47, 183, 236, 0.32)",
        },
        productImage: {
          zIndex: 2,
          position: "relative",
          height: "112px",
          width: "112px",
          borderRadius: "4px",
        },
        bannerImage: {
          zIndex: 1,
          position: "absolute",
          height: "112px",
          backgroundColor: "white",
          left: "0px",
          borderRadius: "4px",
        },
        discountStr: {
          zIndex: 2,
          position: "relative",
          left: "20px",
          top: "17px",
        },
      }),
    [],
  );
};
