import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* SVGs */
import bannerImg from "@assets/img/product-boost/seasonal-banner/may_high_demand_banner.svg";

/* Toolkit */
import { RefundAssuranceTooltip } from "@toolkit/product-boost/refund-assurance";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductBoostRefundAssuranceBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const ProductBoostRefundAssuranceBanner = (
  props: ProductBoostRefundAssuranceBannerProps,
) => {
  const { logParams } = props;
  const { textBlack, primary, textWhite } = useTheme();

  return (
    <SimpleBannerItem
      title={i`Getting protected under ProductBoost Refund Assurance`}
      body={RefundAssuranceTooltip.HEADER_DESC}
      bannerImg={bannerImg}
      cta={{
        text: i`View refund assurance`,
        href: "/product-boost/refund-assurance",
        style: {
          color: textWhite,
          backgroundColor: primary,
        },
      }}
      textColor={textBlack}
      logParams={{
        banner_key: "ProductBoostRefundAssuranceBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(ProductBoostRefundAssuranceBanner);
