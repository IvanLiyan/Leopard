import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import ProductBoostCampaignBannerImg from "@merchant/component/widget/home-banner/banners/ProductBoostCampaignBannerImg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductBoostAutomatedCampaignBannerProps = BaseProps & {
  readonly campaign: any;
  readonly logParams: {
    [field: string]: string;
  };
};

const defaultPromoTitle: string = i`Enable Automated Campaign`;
const defaultPromoButtonText: string = i`Enable Campaign!`;

const ProductBoostAutomatedCampaignBanner = (
  props: ProductBoostAutomatedCampaignBannerProps
) => {
  const { campaign, logParams } = props;
  const promoButtonLink = `/product-boost/detail/${campaign.campaign_id}`;
  const discountStr = numeral(campaign.discount).format("0%");
  const defaultValue = formatCurrency(campaign.budget, campaign.currency_code);

  const defaultPromoBody: string =
    i`Boost your sales & traffic! Wish has identified one of your products ` +
    i`as having huge ProductBoost potential and would like to help promote ` +
    i`it! Enable now and get ${discountStr} off! Enjoy up to ` +
    i`${defaultValue} worth of impression at ${discountStr} of the cost!`;

  return (
    <SimpleBannerItem
      title={defaultPromoTitle}
      body={defaultPromoBody}
      bannerImg={() => <ProductBoostCampaignBannerImg campaign={campaign} />}
      cta={{
        text: defaultPromoButtonText,
        href: promoButtonLink,
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      logParams={{
        banner_key: "ProductBoostAutomatedCampaignBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(ProductBoostAutomatedCampaignBanner);
