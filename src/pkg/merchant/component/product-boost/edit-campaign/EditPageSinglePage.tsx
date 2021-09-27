import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { weightMedium } from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { CurrencyCode } from "@toolkit/currency";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Merchant API */
import { BannerLocation, BannerType } from "@merchant/api/product-boost";

/* Merchant Components */
import Header from "@merchant/component/product-boost/ProductBoostHeader";
import Products from "@merchant/component/product-boost/edit-campaign/Products";
import KeywordsBids from "@merchant/component/product-boost/edit-campaign/KeywordsBids";
import CampaignBasics from "@merchant/component/product-boost/edit-campaign/CampaignBasics";
import Budget from "@merchant/component/product-boost/edit-campaign/Budget";
import ProductBoostBanner from "@merchant/component/product-boost/ProductBoostBanner";
import { StatsColumnItem } from "@merchant/component/product-boost/ProductBoostHeader";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Merchant Store */
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import DimenStore from "@merchant/stores/DimenStore";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { RefundAssurancePromo } from "@merchant/stores/product-boost/ProductBoostContextStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Section = "basics" | "products" | "keywords" | "budget";

const SectionNames: {
  readonly [T in Section]: string;
} = {
  basics: i`Campaign basics`,
  products: i`Products`,
  keywords: i`Keywords`,
  budget: i`Set a budget`,
};

const Sections: ReadonlyArray<Section> = [
  "basics",
  "products",
  "keywords",
  "budget",
];

type EditPageSinglePageProps = BaseProps & {
  readonly minBudget: number;
  readonly suggestedBudget: number;
  readonly minSpend: number;
  readonly onClickCancel: () => unknown;
  readonly onClickSave: () => unknown;
  readonly refundAssurancePromo: RefundAssurancePromo;
};

@observer
class EditPageSinglePage extends Component<EditPageSinglePageProps> {
  @observable
  hiddenSections: Set<Section> = new Set();

  dispose: (() => void) | null | undefined;

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
      this.dispose = null;
    }
  }

  @computed
  get isDuplicateFlow(): boolean {
    const { routeStore } = AppStore.instance();
    const action = routeStore.queryParams.action;
    return action === "duplicate";
  }

  @computed
  get campaign(): Campaign | null | undefined {
    const { currentCampaign } = ProductBoostStore.instance();
    return currentCampaign;
  }

  @computed
  get localizedCurrencyCode(): CurrencyCode {
    const { campaign } = this;
    return campaign ? campaign.localizedCurrency : "USD";
  }

  @computed
  get statsColumns(): ReadonlyArray<StatsColumnItem> {
    const { campaignRestrictions } = ProductBoostStore.instance();
    return campaignRestrictions.maxAllowedSpending
      ? [
          {
            columnTitle: i`Your maximum budget available`,
            columnStats: formatCurrency(
              campaignRestrictions.maxAllowedSpending,
              this.localizedCurrencyCode,
            ),
          },
        ]
      : [];
  }

  @computed
  get styles() {
    const { pageGuideX } = DimenStore.instance();

    return StyleSheet.create({
      sections: {
        padding: `25px ${pageGuideX} 100px`,
      },
      sectionHeader: {
        fontSize: 16,
        color: palettes.textColors.Ink,
      },
      sectionContent: {
        padding: 24,
      },
      buttons: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 24,
      },
      horizontalMargin: {
        marginTop: 20,
        marginBottom: 20,
      },
      text: {
        color: palettes.textColors.Ink,
        fontSize: 16,
        fontWeight: weightMedium,
      },
      greyColor: {
        color: palettes.textColors.LightInk,
      },
      banner: {
        margin: `20px ${pageGuideX} 10px ${pageGuideX}`,
      },
    });
  }

  @computed
  get campaignBasics() {
    return <CampaignBasics />;
  }

  @computed
  get products() {
    return <Products />;
  }

  @computed
  get keywordsAndBids() {
    return <KeywordsBids notFocusOnMount />;
  }

  @computed
  get budget() {
    const { minBudget, suggestedBudget, minSpend } = this.props;
    return (
      <Budget
        notFocusOnMount
        minBudget={minBudget}
        suggestedBudget={suggestedBudget}
        minSpend={minSpend}
      />
    );
  }

  sectionContent = (section: Section): (() => JSX.Element) => {
    const SectionContent: {
      readonly [T in Section]: () => JSX.Element;
    } = {
      basics: () => this.campaignBasics,
      products: () => this.products,
      keywords: () => this.keywordsAndBids,
      budget: () => this.budget,
    };
    return SectionContent[section];
  };

  render() {
    const { campaign } = this;
    if (!campaign) {
      return null;
    }
    const { className, onClickSave, onClickCancel, refundAssurancePromo } =
      this.props;
    const { enabled } = refundAssurancePromo;

    return (
      <div className={css(className)}>
        {enabled && (
          <ProductBoostBanner
            type={BannerType.refundAssurance}
            fromPage={BannerLocation.createCampaignPage}
            className={css(this.styles.banner)}
          />
        )}
        <Header
          title={i`Create a campaign`}
          body={() => (
            <Markdown
              className={css(this.styles.text)}
              openLinksInNewTab
              text={
                i`Create campaigns and boost the impressions of your ` +
                i`products! [Learn more](${zendeskURL("360018910253")})`
              }
            />
          )}
          illustration="productBoostPhone"
          statsColumns={this.statsColumns}
        />
        <div className={css(this.styles.sections)}>
          {Sections.map((section) => {
            return (
              <Card showOverflow style={{ border: "none " }} key={section}>
                <Accordion
                  header={() => (
                    <Text
                      className={css(this.styles.sectionHeader)}
                      weight="semibold"
                    >
                      {SectionNames[section]}
                    </Text>
                  )}
                  isOpen={!this.hiddenSections.has(section)}
                  onOpenToggled={(isOpen) => {
                    if (isOpen) {
                      this.hiddenSections.delete(section);
                    } else {
                      this.hiddenSections.add(section);
                    }
                  }}
                  backgroundColor={palettes.greyScaleColors.LighterGrey}
                >
                  <div className={css(this.styles.sectionContent)}>
                    {this.sectionContent(section)()}
                  </div>
                </Accordion>
              </Card>
            );
          })}
          <Card style={{ border: "none " }}>
            <div className={css(this.styles.buttons)}>
              <SecondaryButton
                type="default"
                text={i`Cancel`}
                onClick={onClickCancel}
              />
              <PrimaryButton onClick={async () => await onClickSave()}>
                Save campaign
              </PrimaryButton>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
export default EditPageSinglePage;
