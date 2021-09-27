import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { weightMedium } from "@toolkit/fonts";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant Components */
// TODO: decouple from the Campaigns component
import Campaigns from "@merchant/component/product-boost/list-campaign/Campaigns";

/* Merchant API */
// TODO: move this to GQL
import * as productBoostApi from "@merchant/api/product-boost";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { useTheme } from "@merchant/stores/ThemeStore";
import { zendeskCategoryURL } from "@toolkit/url";

type Props = {
  readonly initialData: {};
};

const PlusAllCampaignsContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();

  const actions = <PrimaryButton minWidth>Create Campaign</PrimaryButton>;

  const learnMoreLink = ` [${ci18n(
    "link allowing the user to go to the FAQs for product boost",
    "Learn more"
  )}](${zendeskCategoryURL("360000760934")})`;
  const headerText =
    i`Create campaigns and boost the impressions of your products!` +
    learnMoreLink;
  const totalCampaignsText = ci18n(
    "referring to the total number of ProductBoost campaigns a merchant is currently running",
    "Total campaigns"
  );
  const maximumBudgetText = ci18n(
    "referring to the maximum budget in a merchant's ProductBoost account",
    "Your maximum budget"
  );

  // TODO: move this logic to GQL
  const [campaignCountResponse, refreshCampaignCountRequest] = useRequest(
    productBoostApi.getProductBoostCampaignCount({})
  );
  const [statsResponse, refreshStatsRequest] = useRequest(
    productBoostApi.getMerchantSpendingStats({})
  );

  const campaignCount = campaignCountResponse?.data?.campaign_count || 0;
  const maxAllowedSpending = statsResponse?.data?.max_allowed_spending || 0;

  const PLACEHOLDER = "-";

  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`ProductBoost Campaigns`} actions={actions}>
        <Markdown
          className={css(styles.headerText)}
          text={headerText}
          openLinksInNewTab
        />
        <div className={css(styles.headerRow)}>
          <div className={css(styles.headerCell)}>
            {totalCampaignsText}
            <div className={css(styles.headerNumber)}>
              {campaignCountResponse ? campaignCount : PLACEHOLDER}
            </div>
          </div>
          <div className={css(styles.headerCell)}>
            {maximumBudgetText}
            <div className={css(styles.headerNumber)}>
              {statsResponse ? formatCurrency(maxAllowedSpending) : PLACEHOLDER}
            </div>
          </div>
        </div>
      </PlusWelcomeHeader>
      <PageGuide>
        <Campaigns
          onUpdateCampaignCount={refreshCampaignCountRequest}
          onUpdateAllowedSpending={refreshStatsRequest}
          maxAllowedSpending={maxAllowedSpending}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerText: {
          marginTop: 8,
        },
        headerRow: {
          display: "flex",
          margin: "24px 0px 4px 0px",
        },
        headerCell: {
          marginRight: 114,
        },
        headerNumber: {
          color: textBlack,
          fontWeight: weightMedium,
        },
      }),
    [textBlack]
  );
};

export default observer(PlusAllCampaignsContainer);
