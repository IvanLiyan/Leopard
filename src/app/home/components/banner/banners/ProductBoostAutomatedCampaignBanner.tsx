import React from "react";
import { observer } from "mobx-react";

import numeral from "numeral";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import ProductBoostCampaignBannerImg from "./ProductBoostCampaignBannerImg";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";
import { useTheme } from "@core/stores/ThemeStore";
import { AutomatedCampaign } from "@home/toolkit/product-boost";
import { merchFeURL } from "@core/toolkit/router";

export type ProductBoostAutomatedCampaignBannerProps = BaseProps & {
  readonly campaign: AutomatedCampaign;
};

const defaultPromoTitle: string = i`Enable Automated Campaign`;
const defaultPromoButtonText: string = i`Enable Campaign!`;

const ProductBoostAutomatedCampaignBanner: React.FC<
  ProductBoostAutomatedCampaignBannerProps
> = ({ campaign, className, style }) => {
  const { wishBlue } = useTheme();
  const promoButtonLink = merchFeURL(
    `/product-boost/detail/${campaign.campaign_id}`,
  );
  const discountStr = numeral(campaign.discount).format("0%");
  const defaultValue = formatCurrency(campaign.budget, campaign.currency_code);

  const defaultPromoBody: string =
    i`Boost your sales & traffic! Wish has identified one of your products ` +
    i`as having huge ProductBoost potential and would like to help promote ` +
    i`it! Enable now and get ${discountStr} off! Enjoy up to ` +
    i`${defaultValue} worth of impression at ${discountStr} of the cost!`;

  return (
    <Banner
      className={className}
      style={style}
      title={defaultPromoTitle}
      body={defaultPromoBody}
      bannerImg={() => <ProductBoostCampaignBannerImg campaign={campaign} />}
      cta={{
        text: defaultPromoButtonText,
        href: merchFeURL(promoButtonLink),
        style: {
          backgroundColor: wishBlue,
        },
      }}
    />
  );
};

export default observer(ProductBoostAutomatedCampaignBanner);
