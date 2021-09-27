import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { weightBold, weightMedium } from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import { getProductBoostCampaignDetailInvoice } from "@merchant/api/product-boost";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CampaignInvoice } from "@merchant/api/product-boost";

import { CurrencyCode } from "@toolkit/currency";
import { formatDatetimeLocalized } from "@toolkit/datetime";
import CampaignDiscountIndicator from "@merchant/component/product-boost/CampaignDiscountIndicator";

type InvoiceSectionProps = BaseProps & {};

type InvoiceTableData = {
  date: number | null | undefined;
  id: ReactNode | null | undefined;
  desc: string;
  charge: number | null | undefined;
  adjustment: number | null | undefined;
};

@observer
class InvoiceSection extends Component<InvoiceSectionProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      metricsCard: {
        marginBottom: 20,
      },
      metricsSection: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      },
      invoiceMetric: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        margin: "20px 30px 20px 30px",
      },
      invoiceMetricTitle: {
        fontSize: 14,
        fontWeight: weightBold,
        color: palettes.textColors.Ink,
      },
      invoiceMetricValue: {
        fontSize: 14,
        fontWeight: weightMedium,
        color: palettes.textColors.Ink,
      },
      tableSection: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: palettes.textColors.White,
      },
    });
  }

  @computed
  get campaign(): CampaignModel | null | undefined {
    const { productBoostStore } = AppStore.instance();
    return productBoostStore.currentCampaign;
  }

  @computed
  get paidStatus(): string {
    const { campaign } = this;
    const hasBeenPaid = campaign?.hasBeenPaid;
    if (hasBeenPaid === true) {
      if (!this.finishedLoadingAPI) {
        return i`Loading...`;
      }
      return this.hasPaymentIds ? i`Paid` : i`Billed`;
    }
    return i`Not Paid Yet`;
  }

  @computed
  get maxBudget(): string {
    const { campaign, localizedCurrency } = this;
    const oldBudget = campaign?.oldBudget;
    if (oldBudget != null) {
      return formatCurrency(oldBudget, localizedCurrency);
    }
    return i`No Data`;
  }

  @computed
  get maxSpend(): string {
    const { campaign, localizedCurrency } = this;
    const cappedSpend = campaign?.cappedSpend;
    if (cappedSpend != null) {
      return formatCurrency(cappedSpend, localizedCurrency);
    }
    return i`No Data`;
  }

  @computed
  get localizedCurrency(): CurrencyCode {
    const { campaign } = this;
    return campaign?.localizedCurrency || "USD";
  }

  @computed
  get request() {
    const { campaign } = this;
    if (campaign != null) {
      return getProductBoostCampaignDetailInvoice({
        campaign_id: campaign.id,
      });
    }
  }

  @computed
  get invoices() {
    return this.request?.response?.data?.campaign_invoice_data || [];
  }

  @computed
  get hasPaymentIds(): boolean {
    return this.invoices.some((invoice) => invoice.type === "payment");
  }

  @computed
  get tableData(): ReadonlyArray<InvoiceTableData> {
    return this.invoices.map((invoice) => this.processInvoiceData(invoice));
  }

  renderIdCell(invoice: CampaignInvoice) {
    const id = invoice.id;
    if (id != null) {
      const shortenedId = `...${id.slice(-4)}`;
      if (invoice.type === "payment") {
        return (
          <Popover popoverContent={id}>
            <Link href={`/payment-detail/${id}`} openInNewTab>
              {shortenedId}
            </Link>
          </Popover>
        );
      } else if (invoice.type === "account_balance") {
        return (
          <Popover popoverContent={id}>
            <Link href={`/fee/${id}`} openInNewTab>
              {shortenedId}
            </Link>
          </Popover>
        );
      }
      return <Popover popoverContent={id}>{shortenedId}</Popover>;
    }
    return null;
  }

  processInvoiceData(invoice: CampaignInvoice): InvoiceTableData {
    let invoiceDate: number | null = null;
    if (invoice.date_str != null) {
      invoiceDate = moment(invoice.date_str, "YYYY_MM_DD").unix();
    }

    let invoiceAdjustment = invoice.adjustment;
    if (invoiceAdjustment != null) {
      invoiceAdjustment = invoiceAdjustment * -1;
    }

    const invoiceId = this.renderIdCell(invoice);

    let invoiceDescription = "";
    switch (invoice.type) {
      case "account_balance":
        invoiceDescription = i`Account Balance Withdrawal`;
        break;
      case "charge":
        if (invoice.start_date != null && invoice.end_date != null) {
          const startDate = moment(invoice.start_date, "YYYY_MM_DD");
          const endDate = moment(invoice.end_date, "YYYY_MM_DD");
          let startDateStr = formatDatetimeLocalized(startDate, "M/D/YYYY");
          const endDateStr = formatDatetimeLocalized(endDate, "M/D/YYYY");
          if (startDate.year() === endDate.year()) {
            startDateStr = formatDatetimeLocalized(startDate, "M/D");
          }
          invoiceDescription = i`Impressions from ${startDateStr}-${endDateStr}`;
        }

        break;
      case "discount":
        invoiceDescription = i`Promotional Discount`;
        break;
      case "enrollment":
        invoiceDescription = i`Enrollment Fee`;
        break;
      case "pb_balance":
        invoiceDescription = i`ProductBoost Wallet Withdrawal`;
        break;
      case "pb_credit":
        invoiceDescription = i`ProductBoost Credits`;
        break;
      case "payment":
        invoiceDescription = i`Account Balance Payment Processed`;
        break;
    }

    return {
      date: invoiceDate,
      id: invoiceId,
      desc: invoiceDescription,
      charge: invoice.charge,
      adjustment: invoiceAdjustment,
    };
  }

  @computed
  get finishedLoadingAPI(): boolean {
    const { request } = this;
    return request?.isSuccessful === true;
  }

  render() {
    const { campaign, finishedLoadingAPI, localizedCurrency } = this;
    if (!campaign) {
      return null;
    }
    const discountFactor = campaign.discountFactor || 0;
    const showDiscountFactor = discountFactor != 0;
    return (
      <div className={css(this.styles.root)}>
        {showDiscountFactor && (
          <CampaignDiscountIndicator
            style={{ borderRadius: 16, marginBottom: 20 }}
            discount={discountFactor}
            fontSize={16}
          />
        )}
        <Card className={css(this.styles.metricsCard)}>
          <div className={css(this.styles.metricsSection)}>
            <div className={css(this.styles.invoiceMetric)}>
              <div className={css(this.styles.invoiceMetricTitle)}>Status</div>
              <div className={css(this.styles.invoiceMetricValue)}>
                {this.paidStatus}
              </div>
            </div>
            <div className={css(this.styles.invoiceMetric)}>
              <div className={css(this.styles.invoiceMetricTitle)}>
                Total Budget
              </div>
              <div className={css(this.styles.invoiceMetricValue)}>
                {this.maxBudget}
              </div>
            </div>
            <div className={css(this.styles.invoiceMetric)}>
              <div className={css(this.styles.invoiceMetricTitle)}>
                Total Spend
              </div>
              <div className={css(this.styles.invoiceMetricValue)}>
                {this.maxSpend}
              </div>
            </div>
          </div>
        </Card>

        {!finishedLoadingAPI ? (
          <LoadingIndicator />
        ) : (
          <Table noDataMessage={i`No Invoices`}>
            <Table.DatetimeColumn
              title={i`Date`}
              columnKey="date"
              format="M/D/YYYY"
              noDataMessage=""
            />
            <Table.Column title={i`ID`} columnKey="id" noDataMessage="" />
            <Table.Column
              title={i`Description`}
              columnKey="desc"
              noDataMessage=""
            />
            <Table.CurrencyColumn
              title={i`Charge`}
              columnKey="charge"
              noDataMessage=""
              currencyCode={localizedCurrency}
            />
            <Table.CurrencyColumn
              title={i`Adjustment`}
              columnKey="adjustment"
              noDataMessage=""
              currencyCode={localizedCurrency}
            />
            <Table.Section data={this.tableData} sectionKey="invoices" />
          </Table>
        )}
      </div>
    );
  }
}
export default InvoiceSection;
