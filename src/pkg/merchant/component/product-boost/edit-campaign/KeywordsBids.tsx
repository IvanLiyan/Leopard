import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightNormal, weightMedium } from "@toolkit/fonts";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import EditKeywordsCell from "@merchant/component/product-boost/edit-campaign/EditKeywordsCell";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Merchant Store */
import { ProductBoostPropertyContext } from "@merchant/stores/product-boost/ProductBoostContextStore";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";

/* Toolkit */
import KeywordsValidator from "@toolkit/product-boost/validators/KeywordsValidator";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type KeywordsBidsProps = BaseProps & {
  readonly notFocusOnMount?: boolean;
};

@observer
class KeywordsBids extends Component<KeywordsBidsProps> {
  static contextType = ProductBoostPropertyContext;
  context!: React.ContextType<typeof ProductBoostPropertyContext>;

  @computed
  get campaign(): Campaign | null | undefined {
    const { currentCampaign } = ProductBoostStore.instance();
    return currentCampaign;
  }

  @computed
  get keywordsValidator() {
    const {
      campaignProperty: { maxKeywords, maxKeywordLen },
    } = this.context;
    return new KeywordsValidator({
      maxNumOfKeywords: maxKeywords,
      maxKeywordLength: maxKeywordLen,
    });
  }

  @computed
  get styles() {
    return StyleSheet.create({
      text: {
        color: palettes.textColors.Ink,
        fontSize: 16,
        fontWeight: weightMedium,
      },
      smallText: {
        color: palettes.textColors.Ink,
        fontSize: 14,
        fontWeight: weightNormal,
        lineHeight: 0.8,
      },
      topMargin: {
        marginTop: 20,
      },
      input: {
        width: "100%",
      },
    });
  }

  @computed
  get sectionContent() {
    const text =
      i`For your selected products, you can set up optional ` +
      i`keywords so that your products can be shown to as many targeted ` +
      i`potential customers as possible.`;
    return (
      <div className={css(this.styles.text, this.styles.topMargin)}>
        {text}
        <Link
          href="/product-boost/keywords-tool"
          openInNewTab
          style={{ marginLeft: 5 }}
        >
          Try our Keyword Tool
        </Link>
      </div>
    );
  }

  renderKeywords(index: number, value: string) {
    const { notFocusOnMount } = this.props;
    const { campaign } = this;
    if (!campaign) {
      return;
    }

    const {
      campaignProperty: { maxKeywords, maxKeywordLen },
    } = this.context;
    return (
      <EditKeywordsCell
        value={value}
        index={index}
        className={css(this.styles.input)}
        maxKeywords={maxKeywords}
        maxKeywordLen={maxKeywordLen}
        onKeywordsChange={(value: string, index: number) => {
          if (campaign.products) {
            campaign.products[index].keywords = value;
          }
        }}
        focusOnMount={index === 0 && !notFocusOnMount}
        lastItem={campaign.products && index === campaign.products.length - 1}
      />
    );
  }

  render() {
    const { className } = this.props;
    const { campaign } = this;
    if (!campaign) {
      return null;
    }
    const keywordsDescription =
      i`List of keywords associated with your product. ` +
      i`Please include 1 to 30 relevant keywords. ` +
      i`Each keyword can have up to 50 characters.`;

    return (
      <div className={css(className)}>
        {this.sectionContent}
        <Table
          data={campaign.products || []}
          className={css(this.styles.topMargin)}
          overflowY="scroll"
          noDataMessage={i`You haven't selected any products yet.`}
        >
          <ProductColumn title={i`Product`} columnKey={"id"} width={300} />
          <Table.Column
            columnKey={"keywords"}
            title={i`Optional Keywords (use comma to separate keywords)`}
            description={keywordsDescription}
            multiline
            minWidth={400}
          >
            {({ index, value }) => this.renderKeywords(index, value)}
          </Table.Column>
        </Table>
      </div>
    );
  }
}
export default KeywordsBids;
