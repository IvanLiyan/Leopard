import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { DownloadButton } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { ObjectId } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBWWarehouseTitle from "@merchant/component/logistics/shipping-plan/FBWWarehouseTitle";
import ShippingPlanSKUsTable from "@merchant/component/logistics/shipping-plan/ShippingPlanSKUsTable";
import WarehouseShippingAddress from "@merchant/component/logistics/shipping-plan/WarehouseShippingAddress";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { ShippingPlan } from "@merchant/api/fbw";

const RowHeight = 50;

export type FBWShippingPlanDetailProps = BaseProps & {
  readonly shipping_plan: ShippingPlan;
  readonly showDownload: boolean;
  readonly isFBSShippingPlan: boolean;
};

@observer
class FBWShippingPlanDetail extends Component<FBWShippingPlanDetailProps> {
  @observable
  isViewProductsOpen = true;

  @computed
  get styles() {
    const { dimenStore } = AppStore.instance();

    return StyleSheet.create({
      card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      content: {
        padding: "24px",
      },
      titleSection: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        whiteSpace: "nowrap",
      },
      buttonGroup: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        flexWrap: "wrap",
      },
      downloadButton: {
        alignSelf: "stretch",
        marginLeft: "8px",
      },
      textStatsTitle: {
        paddingTop: "10px",
        fontSize: 20,
        color: palettes.textColors.DarkInk,
      },
      button: {
        width: 100,
      },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      sheet: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: palettes.greyScaleColors.LightGrey,
      },
      fixedHeightSheetItem: {
        height: dimenStore.isSmallScreen ? RowHeight * 1.2 : RowHeight,
        padding: "0px 20px",
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
      },
      buttonContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      icon: {
        height: 15,
        marginRight: 6,
      },
      shippingAddressRow: {
        padding: "15px 20px",
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
      },
      sideBySide: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        ":nth-child(1n) > div": {
          flexGrow: 1,
          flexBasis: 0,
          flexShrink: 1,
          ":first-child": {
            borderRight: `1px solid ${palettes.greyScaleColors.Grey}`,
          },
        },
      },
      productBoost: {
        fontSize: 16,
        color: palettes.cyans.Cyan,
        padding: "15px 15px 5px 5px",
      },
      checkmark: {
        padding: "25px 0px 15px 0px",
      },
    });
  }

  intervalID: ReturnType<typeof setTimeout> | null | undefined;

  componentDidMount() {
    this.intervalID = setInterval(() => {
      this.shippingPlanRequest.refresh();
    }, 10000);
  }

  @computed
  get shippingPlanId(): string {
    const { shipping_plan: shippingPlan } = this.props;
    return shippingPlan.id;
  }

  @computed
  get shippingPlanRequest() {
    return fbwApi.getShippingPlanById({
      shipping_plan_id: this.shippingPlanId,
    });
  }

  @computed
  get labelUrl(): string {
    if (
      this.shippingPlanRequest.response?.data?.shipping_plan?.label?.url &&
      this.shippingPlanRequest.response?.data?.shipping_plan?.invoice?.url
    ) {
      if (this.intervalID != null) {
        clearInterval(this.intervalID);
      }
    }
    return (
      this.shippingPlanRequest.response?.data?.shipping_plan?.label?.url || ""
    );
  }

  @computed
  get invoiceUrl(): string {
    return (
      this.shippingPlanRequest.response?.data?.shipping_plan?.invoice?.url || ""
    );
  }

  @computed
  get isLabelReady() {
    return this.labelUrl.trim().length > 0;
  }

  @computed
  get isInvoiceReady() {
    return this.invoiceUrl.trim().length > 0;
  }

  @computed
  get pbIncentive(): boolean {
    return this.shippingPlanRequest.response?.data?.fbw_pb_incentive || false;
  }

  render() {
    const { shipping_plan: shippingPlan, isFBSShippingPlan } = this.props;
    if (shippingPlan == null) {
      return null;
    }

    return (
      <Card className={css(this.styles.card)}>
        <div className={css(this.styles.content)}>
          <Text weight="bold" className={css(this.styles.textStatsTitle)}>
            Shipping Plan Summary
          </Text>
          <div>{this.renderShippingPlanTitle()}</div>
          {this.renderShippingPlanData(isFBSShippingPlan)}
          <Card
            showOverflow
            style={{ border: "none ", boxShadow: "none" }}
            className={css(this.styles.card)}
          >
            <Accordion
              header={i`View products`}
              headerPadding={"10px 15px 10px 0px"}
              hideLines
              isOpen={this.isViewProductsOpen}
              onOpenToggled={(isOpen) => (this.isViewProductsOpen = isOpen)}
              backgroundColor={palettes.greyScaleColors.LighterGrey}
            >
              <ShippingPlanSKUsTable skus={shippingPlan.skus} />
            </Accordion>
          </Card>
        </div>
      </Card>
    );
  }

  renderDownloadButtons() {
    const { shipping_plan: shippingPlan, showDownload } = this.props;
    if (shippingPlan == null) {
      return null;
    }

    return (
      <div className={css(this.styles.buttonGroup)}>
        <DownloadButton
          className={css(this.styles.downloadButton)}
          href={`/api/fbw/shipping-plan/export?shipping_plan_id=${shippingPlan.id}`}
          popoverContent={i`Export this shipping plan as a CSV file.`}
        >
          Export shipping plan
        </DownloadButton>
        {showDownload && (
          <>
            <DownloadButton
              className={css(this.styles.downloadButton)}
              href={this.labelUrl}
              popoverContent={
                this.isLabelReady
                  ? i`Download your case label.`
                  : i`Your shipping label will be available for download ` +
                    i`shortly. Please come back to check again later.  `
              }
              disabled={!this.isLabelReady}
            >
              Download case label
            </DownloadButton>
            <DownloadButton
              className={css(this.styles.downloadButton)}
              href={this.invoiceUrl}
              popoverContent={
                this.isLabelReady
                  ? i`Download your manifest.`
                  : i`Your shipping label will be available for download ` +
                    i`shortly. Please come back to check again later.  `
              }
              disabled={!this.isInvoiceReady}
            >
              Download manifest
            </DownloadButton>
          </>
        )}
      </div>
    );
  }

  renderShippingPlanTitle() {
    const { shipping_plan: shippingPlan } = this.props;

    return (
      <div className={css(this.styles.titleSection)}>
        <FBWWarehouseTitle
          title={i`Ship to`}
          value={shippingPlan.warehouse.warehouse_name}
          imgUrl="warehouse"
          titlePadding={"20px 20px 20px 0px"}
        />
        {this.pbIncentive && (
          <Icon name="cyanCheckmark" className={css(this.styles.checkmark)} />
        )}
        {this.pbIncentive && (
          <Markdown
            text={i`ProductBoost discount pending delivery`}
            className={css(this.styles.productBoost)}
          />
        )}
        {this.renderDownloadButtons()}
      </div>
    );
  }

  renderShippingPlanData(isFBS: boolean) {
    const { shipping_plan: shippingPlan } = this.props;
    if (shippingPlan == null) {
      return null;
    }

    return (
      <>
        <Card className={css(this.styles.card)}>
          <div className={css(this.styles.sheet)}>
            <div className={css(this.styles.sideBySide)}>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Wish Shipping Plan ID`}
              >
                <ObjectId id={shippingPlan.id} showFull copyOnBodyClick />
              </SheetItem>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={
                  isFBS ? i`FBS Shipping Plan ID ` : i`FBW Shipping Plan ID `
                }
              >
                <ObjectId
                  id={shippingPlan.fbw_shipping_id}
                  showFull
                  copyOnBodyClick
                />
              </SheetItem>
            </div>
            <div className={css(this.styles.sideBySide)}>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Transaction Date`}
              >
                {shippingPlan.date_created}
              </SheetItem>
            </div>
            <SheetItem
              className={css(this.styles.shippingAddressRow)}
              title={i`Shipping Address`}
            >
              <WarehouseShippingAddress
                shippingDetails={shippingPlan.delivery_option.address}
                disableCopy={false}
              />
            </SheetItem>
          </div>
        </Card>
      </>
    );
  }
}

export default FBWShippingPlanDetail;
