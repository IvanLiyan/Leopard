import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Legacy */
import { shortenWithEllipsis } from "@legacy/core/string_utils";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Checkmark } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import FeedbackLabel from "@merchant/component/product-boost/FeedbackLabel";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Toolkit */
import { ProductBoostCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { TableAction } from "@ContextLogic/lego";
import { CampaignProductStatsEntry } from "@merchant/api/product-boost";
import { CurrencyCode } from "@toolkit/currency";

export type ProductsTableProps = BaseProps & {
  readonly aggregateData: ReadonlyArray<CampaignProductStatsEntry>;
  readonly campaignId: string;
  readonly isV2: boolean;
  readonly noDataMessage: string | null | undefined;
  readonly handleViewProductPerformance?: (
    campaignId: string,
    productId: string
  ) => void;
  readonly currency: CurrencyCode | null | undefined;
};

@observer
class ProductsTable extends Component<ProductsTableProps> {
  static defaultProps = {
    aggregateData: [],
    campaignId: "",
    isV2: false,
  };

  @computed
  get campaignProductsTableRows() {
    const { aggregateData } = this.props;
    const rows: ReadonlyArray<CampaignProductStatsEntry> = [...aggregateData]
      .reverse()
      .map((row) => ({
        ...row,
        product_name: shortenWithEllipsis(row.product_name, 30),
      }));

    return rows;
  }

  @computed
  get hasFeedback() {
    const { aggregateData } = this.props;
    const rows = aggregateData;
    return rows.filter((row) => row.feedback_type !== null).length > 0;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      button: {
        marginLeft: 8,
        fontSize: 14,
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
      productName: {
        fontSize: 14,
        color: palettes.coreColors.WishBlue,
        fontWeight: fonts.weightSemibold,
        lineHeight: 1.43,
        cursor: "pointer",
      },
    });
  }

  @computed
  get currency(): CurrencyCode {
    const { currency } = this.props;
    return currency || "USD";
  }

  @computed
  get allowMaxboost(): boolean {
    const { productBoostStore, userStore } = AppStore.instance();
    const { loggedInMerchantUser } = userStore;
    if (loggedInMerchantUser?.is_admin || loggedInMerchantUser?.is_bd) {
      return true;
    }
    const { merchant } = productBoostStore;
    return merchant.allow_maxboost;
  }

  handleViewProductPerformance(campaignId: string, productId: string) {
    const url = `/product-boost/detail/${campaignId}?tab=performance&products=${productId}`;
    window.open(url, "_blank");
  }

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    const { campaignId, handleViewProductPerformance } = this.props;
    return [
      {
        key: "performance",
        name: i`View Performance`,
        canApplyToRow: () => true,
        apply: ([row]) => {
          if (
            handleViewProductPerformance &&
            typeof handleViewProductPerformance === "function"
          ) {
            handleViewProductPerformance(campaignId, row.product_id);
          } else {
            this.handleViewProductPerformance(campaignId, row.product_id);
          }
        },
      },
    ];
  }

  renderMaxBoostField(row: CampaignProductStatsEntry) {
    return <Checkmark checked={row.is_maxboost} size={20} />;
  }

  renderBrandBoostField(row: CampaignProductStatsEntry) {
    return <Checkmark checked={row.is_brandboost} size={20} />;
  }

  renderFeedbackLabel(row: any) {
    return <FeedbackLabel feedbackType={row.feedback_type} />;
  }

  render() {
    const { campaignId, isV2, noDataMessage, style, className } = this.props;
    const { currency, allowMaxboost } = this;
    return (
      <Table
        className={css(style, className, this.styles.root)}
        data={this.campaignProductsTableRows}
        actions={this.tableActions}
        fixLayout
        rowHeight={68}
        noDataMessage={
          noDataMessage ||
          (() => (
            <>
              <span>No product is added to your campaign yet.</span>
              <Link
                className={css(this.styles.button)}
                openInNewTab
                href={`/product-boost/edit/${campaignId}`}
              >
                Edit campaign
              </Link>
            </>
          ))
        }
        maxVisibleColumns={12}
      >
        {allowMaxboost && (
          <Table.Column
            title={i`MaxBoost`}
            columnKey="is_maxboost"
            align="left"
            description={ProductBoostCampaignExplanations.MAX_BOOST}
          >
            {({ row }) => this.renderMaxBoostField(row)}
          </Table.Column>
        )}
        <Table.Column
          title={i`BrandBoost`}
          columnKey="is_brandboost"
          align="left"
          description={ProductBoostCampaignExplanations.BRAND_BOOST}
        >
          {({ row }) => this.renderBrandBoostField(row)}
        </Table.Column>
        <ProductColumn
          title={i`Product Name`}
          columnKey="product_id"
          align="left"
          width={300}
        />
        <Table.ObjectIdColumn
          title={i`Product Id`}
          columnKey="product_id"
          align="left"
          showFull={false}
          copyOnBodyClick
        />
        {!isV2 && (
          <Table.CurrencyColumn
            title={i`Average CPM `}
            columnKey="cpm"
            align="left"
            currencyCode={currency}
            description={ProductBoostCampaignExplanations.CPM}
          />
        )}
        <Table.CurrencyColumn
          title={i`Total Spend`}
          columnKey="spend"
          align="left"
          currencyCode={currency}
          description={ProductBoostCampaignExplanations.SPEND}
        />
        {!isV2 && (
          <Table.NumeralColumn
            title={i`Total Paid Impressions`}
            columnKey="impressions"
            align="left"
            description={ProductBoostCampaignExplanations.PAID_IMPRESSIONS}
          />
        )}
        {allowMaxboost && (
          <Table.CurrencyColumn
            title={i`MaxBoost Spend`}
            columnKey="external_spend"
            align="left"
            currencyCode={currency}
            description={ProductBoostCampaignExplanations.EXTERNAL_SPEND}
          />
        )}
        {allowMaxboost && !isV2 && (
          <Table.NumeralColumn
            title={i`MaxBoost Paid Impressions`}
            columnKey="external_impressions"
            align="left"
            description={ProductBoostCampaignExplanations.EXTERNAL_IMPRESSIONS}
          />
        )}
        <Table.NumeralColumn title={i`Orders`} columnKey="sales" align="left" />
        <Table.CurrencyColumn
          title={i`GMV`}
          columnKey="gmv"
          align="left"
          currencyCode={currency}
        />
        {this.hasFeedback && (
          <Table.Column title={i`Feedback`} columnKey="product_id" align="left">
            {({ row }) => this.renderFeedbackLabel(row)}
          </Table.Column>
        )}
      </Table>
    );
  }
}
export default ProductsTable;
