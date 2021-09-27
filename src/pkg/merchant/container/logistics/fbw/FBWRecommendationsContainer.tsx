// To use functional component with ScrollableAnchor, we need a dummy <div>, thus disabling this rule

/* eslint-disable local-rules/use-fragment */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { params_DEPRECATED } from "@toolkit/url";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import LowInventoryTip from "@merchant/component/logistics/fbw/LowInventoryTip";
import ActionRequiredShippingPlansTip from "@merchant/component/logistics/fbw/ActionRequiredShippingPlansTip";
import FBWStatsSummary from "@merchant/component/logistics/fbw/FBWStatsSummary";
import FBWShippingPriceDrop from "@merchant/component/logistics/recommendations/FBWShippingPriceDrop";
import CreateShippingPlanTip from "@merchant/component/logistics/fbw/CreateShippingPlanTip";
import FBWLowInventory from "@merchant/component/logistics/recommendations/FBWLowInventory";
import WishsPicks from "@merchant/component/logistics/recommendations/wishs-picks/WishsPicks";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { zendeskCategoryURL } from "@toolkit/url";

@observer
class FBWRecommendationsContainer extends Component<{ initialData: {} }> {
  @observable
  accordionOpen = true;

  @params_DEPRECATED.string("from_email")
  fromEmailQueryParam = false;

  @params_DEPRECATED.string("email_id")
  emailId = "";

  @computed
  get pageX(): string | number {
    const { dimenStore } = AppStore.instance();
    return dimenStore.pageGuideXForPageWithTable;
  }

  @computed
  get request() {
    return api.getWarehouses({ express_only: true });
  }

  @computed
  get warehouses() {
    return this.request.response?.data?.warehouses || [];
  }

  @computed
  get merchantCurrencyRequest() {
    return api.getFBWMerchantCurrency({});
  }

  @computed
  get merchantSourceCurrency(): string {
    return (
      this.merchantCurrencyRequest.response?.data?.merchant_currency || "USD"
    );
  }

  componentDidMount() {
    if (this.fromEmailQueryParam) {
      const { userStore } = AppStore.instance();

      logger.log("RECOMMENDATION_EMAIL_METRICS", {
        event: "fbs_fbw_requesting_email_opened",
        merchant_id: userStore.loggedInMerchantUser.merchant_id,
        action: "click",
        email_id: this.emailId,
      });
    }
  }

  @computed
  get styles() {
    const { dimenStore } = AppStore.instance();
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      section: {
        padding: `25px ${dimenStore.pageGuideX} 15px`,
      },
      header: {
        marginBottom: 30,
      },
      table: {
        marginLeft: this.pageX,
        marginRight: this.pageX,
      },
      alert: {
        marginBottom: 8,
      },
      sectionHeader: {
        color: palettes.textColors.Ink,
      },
      itemWithLabel: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        whiteSpace: "normal",
      },
      label: {
        display: "flex",
        flexDirection: "row",
      },
      title: {
        display: "flex",
        flexDirection: "row",
      },
      icon: {
        display: "flex",
        margin: "10px 6px 10px 0",
        borderRadius: "20px",
        background: "#ffe3804c",
        alignItems: "center",
      },
    });
  }

  renderItemWithLabel = () => {
    return (
      <div className={css(this.styles.itemWithLabel)}>
        <Markdown text={i`Wish's Picks`} />
        <Label
          style={{ padding: "2px 4px" }}
          textColor={palettes.textColors.White}
          fontSize={12}
          backgroundColor={palettes.coreColors.WishBlue}
          text={i`New`}
          width={32}
        />
      </div>
    );
  };

  render() {
    const { locale } = LocalizationStore.instance();
    const link = i`Learn more`;
    return (
      <div className={css(this.styles.root)}>
        <WelcomeHeader
          title={i`FBW Insights`}
          body={
            i`You can view recommended FBW top sellers, restock products, and optimize your ` +
            i`business. You can also refresh products that are low in stock and drop shipping ` +
            i`prices to keep your products competitive in the marketplace.` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i` [${link}](${zendeskCategoryURL(
              "360000737454-Fulfillment-by-Wish-FBW-",
              locale
            )})`
          }
          illustration="fbwDashboardHeader"
          openLinksInNewTabForMarkdown
        />
        <div className={css(this.styles.section)}>
          <h3 className={css(this.styles.sectionHeader)}>Things to do</h3>
          <LowInventoryTip className={css(this.styles.alert)} hideViewDetails />
          <ActionRequiredShippingPlansTip className={css(this.styles.alert)} />
          <CreateShippingPlanTip className={css(this.styles.alert)} />
        </div>
        <div className={css(this.styles.section)}>
          <div className={css(this.styles.title)}>
            <Illustration
              className={css(this.styles.icon)}
              name={"recomIcon"}
              alt={i`Recommendation Logo`}
            />
            <h3 className={css(this.styles.sectionHeader)}>Wish's Picks</h3>
          </div>
          <WishsPicks productType="fbw" />
        </div>
        <FBWLowInventory
          className={css(this.styles.section)}
          warehouses={this.warehouses}
        />
        <FBWShippingPriceDrop
          className={css(this.styles.section)}
          warehouses={this.warehouses}
          merchantSourceCurrency={this.merchantSourceCurrency}
        />
        <FBWStatsSummary className={css(this.styles.section)} />
      </div>
    );
  }
}
export default FBWRecommendationsContainer;
