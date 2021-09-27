/* eslint-disable @typescript-eslint/naming-convention */
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";
import moment from "moment/moment";

/* External Libraries */
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";

/* Legacy */
import { zendeskURL, zendeskSectionURL, wishURL } from "@legacy/core/url";
import { ni18n, ci18n } from "@legacy/core/i18n";

/* Lego Components */
import {
  Card,
  Info,
  Label,
  Layout,
  ObjectId,
  PrimaryButton,
  Text,
} from "@ContextLogic/lego";

import {
  ShippingAddress,
  Illustration,
  DEPRECATEDIcon as Icon,
} from "@merchant/component/core";
import { Popover } from "@ContextLogic/lego";
import { SideMenu } from "@ContextLogic/lego";
import { SideMenuItemProps } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { CopyButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import Error404 from "@merchant/component/errors/Error404";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import ProductDetails from "@merchant/component/orders/detail/ProductDetails";
import RefundItemsTable from "@merchant/component/orders/detail/RefundItemsTable";
import PaymentDetailCard from "@merchant/component/orders/detail/PaymentDetailCard";

import TimeToDoor from "@merchant/component/logistics/TimeToDoor";
import OrderFinesTable from "@merchant/component/policy/fines/order-fines/OrderFinesTable";
import CarrierTierLabel from "@merchant/component/logistics/CarrierTierLabel";
import AftershipCheckpoints from "@merchant/component/logistics/AftershipCheckpoints";
import TrackingDisputeStateLabel from "@merchant/component/policy/disputes/TrackingDisputeStateLabel";
import DDPLabel from "@merchant/component/orders/ddp/DDPLabel";
import NorwayVATExplanation from "@merchant/component/orders/norway-vat/NorwayVATExplanation";
import WishpostShippingUpdates from "@merchant/component/orders/detail/WishpostShippingUpdates";
import OrderStateLabel from "@plus/component/orders/order-history/OrderStateLabel";
import Wps from "@merchant/component/orders/detail/Wps";
import EuBoundDetails from "@merchant/component/orders/detail/EuBoundDetails";

import { ThemeContext } from "@merchant/stores/ThemeStore";

/* Merchant API */
import * as finesApi from "@merchant/api/fines";

/* SVGs */
import redXIcon from "@assets/img/red-x.svg";
import yellowXIcon from "@assets/img/yellow-x.svg";
import greenCheckmarkIcon from "@assets/img/green-checkmark.svg";
import questionMarkIcon from "@assets/img/question-mark.svg";

/* Type Imports */
import DeviceStore from "@merchant/stores/DeviceStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineDisplayItem } from "@merchant/api/fines";
import {
  OrderDetailData,
  OrderDetailInitialData,
  WishPostAction,
  LegacyRefundFlavourText,
} from "@toolkit/orders/detail";
import {
  CommerceTransactionState,
  OrderLimboState,
  WfpOrderDeliveryState,
} from "@schema/types";
import ExperimentStore from "@merchant/stores/ExperimentStore";

const RowHeight = 50;

const SectionIdFines = "fines";
const SectionIdReturnInfo = "returns";
const SectionIdOrderStatus = "order";
const SectionIdAdminDetails = "admin";
const SectionIdPaymentStatus = "payment";
const SectionIdRefundDetails = "refunds";
const SectionIdProductDetails = "product";
const SectionIdEuBoundDetails = "eu_bound";
const SectionIdTrackingStatus = "tracking";
const SectionIdWps = "wps";
const SectionIdConfirmedDelivery = "value_order";
const SectionIdWishExpressStatus = "wish_express";
const SectionIdWishpostShippingUpdates = "wishpost_updates";
const SectionIdUkFulfillment = "uk_fulfillment";

const NotVisibleToMerchantLabel: React.FC<BaseProps> = (props: BaseProps) => {
  const { surfaceDark } = useTheme();
  return (
    <Label
      text={i`Not visible to merchant`}
      textColor="white"
      fontSize={12}
      backgroundColor={surfaceDark}
    />
  );
};

const ReroutedOrder: React.FC<{}> = () => {
  const { primary } = useTheme();
  return (
    <Label
      style={{ marginLeft: 10 }}
      text={i`Rerouted`}
      textColor="white"
      fontSize={12}
      backgroundColor={primary}
    />
  );
};

const CombinedShippedOrder: React.FC<{}> = () => {
  const { primary } = useTheme();
  return (
    <Label
      style={{ marginLeft: 10 }}
      text={i`Combined Shipped Order`}
      textColor="white"
      fontSize={12}
      backgroundColor={primary}
    />
  );
};

const FreeShippingEligible: React.FC<{}> = () => {
  const { primary } = useTheme();
  return (
    <Label
      style={{ marginLeft: 10 }}
      text={i`Free Shipping Eligible`}
      textColor="white"
      fontSize={12}
      backgroundColor={primary}
    />
  );
};

const LimboOrder: React.FC<{}> = () => {
  const { primary } = useTheme();
  return (
    <Label
      style={{ marginLeft: 10 }}
      text={i`Limbo Order Not Routed`}
      textColor="white"
      fontSize={12}
      backgroundColor={primary}
    />
  );
};

const SwapOrder: React.FC<{}> = () => {
  const { primary } = useTheme();
  return (
    <Label
      style={{ marginLeft: 10 }}
      text={i`Swap Order`}
      textColor="white"
      fontSize={12}
      backgroundColor={primary}
    />
  );
};

const LimboOrderRouted: React.FC<{}> = () => {
  const { primary } = useTheme();
  return (
    <Label
      style={{ marginLeft: 10 }}
      text={i`Limbo Order Routed`}
      textColor="white"
      fontSize={12}
      backgroundColor={primary}
    />
  );
};

type CriteriaProps = BaseProps & {
  readonly isMet: boolean;
  readonly deliveryState?: WfpOrderDeliveryState;
  readonly popoverContent?: (string | null | undefined) | (() => ReactNode);
};

const Criteria: React.FC<CriteriaProps> = observer((props: CriteriaProps) => {
  const { isMet, popoverContent, deliveryState } = props;
  const styles = StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontSize: 16,
      fontWeight: fonts.weightSemibold,
      height: RowHeight,
      cursor: "default",
    },
    icon: {
      width: 28,
      height: 28,
      marginRight: 10,
    },
  });

  const getIcon = () => {
    if (deliveryState === "LATE") {
      return yellowXIcon;
    }
    if (!isMet || deliveryState === "SIGNIFICANTLY_LATE") {
      return redXIcon;
    }
    return greenCheckmarkIcon;
  };

  return (
    <div className={css(styles.root, props.className)}>
      <img src={getIcon()} className={css(styles.icon)} />
      <Popover
        position="top center"
        popoverMaxWidth={250}
        popoverContent={popoverContent}
      >
        {props.children}
      </Popover>
    </div>
  );
});

const OrderSideMenuItem: React.FC<Omit<SideMenuItemProps, "style">> = (
  props: Omit<SideMenuItemProps, "style">
) => {
  return <SideMenu.Item {...props} style={{ paddingRight: "100px" }} />;
};

@observer
export default class OrderContainer extends Component<{
  initialData: OrderDetailInitialData;
}> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @observable
  currentSection: string | null | undefined = (
    window.location.hash || ""
  ).substring(1);

  componentDidMount() {
    document.querySelectorAll(".banner").forEach((e) => e.remove());
    const { isNavyBlueNav } = NavigationStore.instance();
    if (!isNavyBlueNav) {
      configureAnchors({ offset: 100, scrollDuration: 200 });
      const pageContent = document.getElementById("page-content");
      if (pageContent) {
        const offset = -1 * (pageContent.getBoundingClientRect().top + 20);
        configureAnchors({ offset, scrollDuration: 200 });
      }
    }

    window.addEventListener("hashchange", this.onHashChange);

    this.initCanShowWps();
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.onHashChange);
  }

  @computed
  get fines(): ReadonlyArray<FineDisplayItem> {
    return this.finesRequest.response?.data?.results || [];
  }

  @computed
  get orderId(): string {
    const { orderId } = NavigationStore.instance().pathParams(
      "/order/:orderId"
    );
    return orderId;
  }

  @computed
  get finesRequest() {
    return finesApi.getOrderFines({
      transaction_id: this.orderId,
    });
  }

  @action
  onHashChange = () => {
    this.currentSection = (window.location.hash || "").substring(1);
  };

  @computed
  get canOpenTrackingDispute() {
    const { fines, order } = this;
    if (order == null || fines.length === 0) {
      return false;
    }

    return fines.some(
      (fine) => fine.create_dispute_url != null && fine.is_tracking_fine
    );
  }

  renderTrackingDisputeItem() {
    const {
      initialData: {
        fulfillment: {
          order: { trackingDispute },
        },
      },
    } = this.props;
    const { order, canOpenTrackingDispute } = this;
    if (order == null) {
      return null;
    }

    if (trackingDispute) {
      return (
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Tracking Dispute`}
        >
          <Link href={`/tracking-dispute/${trackingDispute.id}`} openInNewTab>
            <TrackingDisputeStateLabel state={trackingDispute.state} />
          </Link>
        </SheetItem>
      );
    } else if (canOpenTrackingDispute) {
      <SheetItem
        className={css(this.styles.fixedHeightSheetItem)}
        title={i`Tracking Dispute`}
      >
        <Button
          href={`/penalties/orders?order_id=${this.orderId}`}
          openInNewTab
        >
          Go to penalties page
        </Button>
      </SheetItem>;
    }

    return null;
  }

  renderOrderStatus() {
    const { canShowAdminDetails, order } = this;

    if (order == null) {
      return null;
    }

    const {
      state,
      isProcessing,
      id: orderId,
      shopifyDetails,
      reReleasedTime,
      ukDetails,
      tax,
      isSwapFromAnotherOrder,
      isCombinedOrder,
      isRouted,
      isFreeShippingEligible,
      limboState,
      requiresDeliveredDutyPaid,
      cartPrice,
      orderTime,
      shippingDetails,
      inRefundLimbo,
      releasedTime,
      chargeback,
      norwayDetails,
      customerIdentifyInfo,
      routingOriginalOrderId,
      supportTicket,
      showAplusShippingAddressTooltip,
    } = order;

    const shippingAddress = shippingDetails && {
      name: shippingDetails.name,
      street_address1: shippingDetails.streetAddress1,
      street_address2: shippingDetails.streetAddress2,
      city: shippingDetails.city,
      state: shippingDetails.state,
      zipcode: shippingDetails.zipcode,
      country: shippingDetails.country?.name || shippingDetails.countryCode,
      country_code: shippingDetails.countryCode,
      phone_number: shippingDetails.phoneNumber,
    };

    const isLimboOrderNotRouted =
      limboState === ("LIMBO_AND_NOT_ROUTED" as OrderLimboState);
    const isLimboOrderRouted =
      limboState === ("LIMBO_AND_ROUTED" as OrderLimboState);

    const shopifyOrderId = shopifyDetails?.shopifyOrderId;
    const orderReReleasedTime = reReleasedTime?.formatted;

    const isUkBound = ukDetails != null ? ukDetails.isBoundOrder : false;
    const isNorwayBound =
      norwayDetails != null ? norwayDetails.isBoundOrder : false;
    const isVatOrder = tax != null ? !!tax.isVatOrder : false;

    const pcVatRequired = isUkBound && !isVatOrder;

    const shippingAddressTooltip = showAplusShippingAddressTooltip
      ? i`You can find the full warehouse address in WishPost.`
      : null;

    return (
      <ScrollableAnchor id={SectionIdOrderStatus}>
        <Card
          title={() => {
            return (
              <div className={css(this.styles.orderOverviewCardTitle)}>
                <div>Order overview</div>
                <div className={css(this.styles.orderLabels)}>
                  {canShowAdminDetails && isRouted && <ReroutedOrder />}
                  {canShowAdminDetails && isCombinedOrder && (
                    <CombinedShippedOrder />
                  )}
                  {canShowAdminDetails && isFreeShippingEligible && (
                    <FreeShippingEligible />
                  )}
                  {canShowAdminDetails && isLimboOrderNotRouted && (
                    <LimboOrder />
                  )}
                  {canShowAdminDetails && isSwapFromAnotherOrder && (
                    <SwapOrder />
                  )}
                  {canShowAdminDetails && isLimboOrderRouted && (
                    <LimboOrderRouted />
                  )}
                </div>
              </div>
            );
          }}
          className={css(this.styles.card)}
        >
          <div className={css(this.styles.sheet)}>
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title={i`Order status`}
            >
              <OrderStateLabel state={state} isProcessing={isProcessing} />
            </SheetItem>
            <div className={css(this.styles.sideBySide)}>
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Order ID`}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <ObjectId id={orderId} showFull copyOnBodyClick />
                  {(requiresDeliveredDutyPaid || pcVatRequired) && (
                    <DDPLabel
                      className={css(this.styles.ddpLabel)}
                      pcVatRequired={pcVatRequired}
                    />
                  )}
                </div>
              </SheetItem>
              {isRouted && routingOriginalOrderId && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Original Order ID`}
                >
                  <ObjectId
                    id={routingOriginalOrderId}
                    showFull
                    copyOnBodyClick
                  />
                </SheetItem>
              )}
            </div>
            {shopifyOrderId && (
              <div>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Shopify Order ID`}
                >
                  <ObjectId id={shopifyOrderId} showFull copyOnBodyClick />
                </SheetItem>
              </div>
            )}
            <div className={css(this.styles.sideBySide)}>
              {releasedTime && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={
                    orderTime == null
                      ? i`Available for fulfillment date`
                      : i`Transaction Date`
                  }
                >
                  {releasedTime.formatted}
                </SheetItem>
              )}
              {orderReReleasedTime && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Order Re-Released Date`}
                >
                  {orderReReleasedTime}
                </SheetItem>
              )}
              {supportTicket && !inRefundLimbo && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Support Ticket`}
                >
                  <Link href={`/ticket/${supportTicket.id}`} openInNewTab>
                    {supportTicket.id}
                  </Link>
                </SheetItem>
              )}
            </div>
            {chargeback && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Chargeback`}
              >
                Yes
              </SheetItem>
            )}
            {shippingAddress && (
              <>
                <SheetItem
                  className={css(this.styles.shippingAddressRow)}
                  title={i`Shipping Address`}
                  popoverContent={shippingAddressTooltip}
                >
                  <ShippingAddress
                    shippingDetails={shippingAddress}
                    shouldDisplayCustomerIdentityNumber={
                      customerIdentifyInfo != null
                    }
                    customerIdentityNumberName={
                      customerIdentifyInfo?.numberName
                    }
                    customerIdentityNumber={customerIdentifyInfo?.number}
                  />
                </SheetItem>
                {tax != null && isVatOrder && isNorwayBound && (
                  <>
                    <SheetItem
                      className={css(
                        this.styles.norwayVAT,
                        this.styles.fixedHeightSheetItem
                      )}
                      title={() => (
                        <div className={css(this.styles.norwayVATTitle)}>
                          <span>Required on the shipping label</span>
                          <Popover
                            position="right"
                            popoverContent={() => (
                              <NorwayVATExplanation
                                className={css(this.styles.norwayVATExplain)}
                              />
                            )}
                          >
                            <img
                              src={questionMarkIcon}
                              className={css(this.styles.icon)}
                            />
                          </Popover>
                        </div>
                      )}
                      titleWidth={400}
                    />
                    <SheetItem
                      className={css(this.styles.fixedHeightSheetItem)}
                      title={i`VOEC number`}
                    >
                      {tax.norwayVatNumber}
                    </SheetItem>
                  </>
                )}
              </>
            )}
            {!isUkBound &&
              cartPrice?.postTaxProductPrice &&
              cartPrice?.postTaxShippingPrice && (
                <div className={css(this.styles.sideBySide)}>
                  <SheetItem
                    className={css(this.styles.fixedHeightSheetItem)}
                    title={i`Total Product Price (${cartPrice.postTaxProductPrice.currencyCode})`}
                    popoverContent={
                      i`Prices presented are totals paid by customer ` +
                      i`and are inclusive of promotions and other adjustments. ` +
                      i`Amount paid to merchant by Wish is not affected by price adjustments ` +
                      i`and may differ from order total presented here.`
                    }
                  >
                    {cartPrice.postTaxProductPrice.display}
                  </SheetItem>
                  <SheetItem
                    className={css(this.styles.fixedHeightSheetItem)}
                    title={i`Total Shipping Price (${cartPrice.postTaxShippingPrice.currencyCode})`}
                    popoverContent={
                      i`Prices presented are totals paid by customer ` +
                      i`and are inclusive of promotions and other adjustments. ` +
                      i`Amount paid to merchant by Wish is not affected by price adjustments ` +
                      i`and may differ from order total presented here.`
                    }
                  >
                    {cartPrice.postTaxShippingPrice.display}
                  </SheetItem>
                </div>
              )}
            {!isUkBound && cartPrice?.total && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Total Order Price (${cartPrice.total.currencyCode})`}
                popoverContent={
                  i`Prices presented are totals paid by customer ` +
                  i`and are inclusive of promotions and other adjustments. ` +
                  i`Amount paid to merchant by Wish is not affected by price adjustments ` +
                  i`and may differ from order total presented here.`
                }
              >
                {cartPrice.total.display}
              </SheetItem>
            )}
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowTrackingStatus() {
    const { order } = this;
    if (order == null) {
      return false;
    }
    const { isRouted } = order;
    return order != null && !isRouted;
  }

  renderTrackingStatus() {
    const { order } = this;
    if (order == null || !this.canShowTrackingStatus) {
      return null;
    }

    const {
      shippingDetails,
      shippedDate,
      releasedTime,
      reReleasedTime,
      trackingCancelledDate,
      confirmedDelivered,
      fbwDetails,
      shippingEstimate,
      isCombinedOrder,
      ttd,
      tracking,
      canShowCarrierTier,
    } = order;

    if (tracking == null) {
      return null;
    }

    const {
      confirmedFulfillmentDate,
      deliveredDate,
      checkpoints,
      carrierTier,
    } = tracking;

    const lastCheckpoint =
      tracking.checkpoints != null && tracking.checkpoints.length > 0
        ? tracking.checkpoints[tracking.checkpoints.length - 1]
        : null;

    let status: string | null | undefined = null;
    if (lastCheckpoint != null) {
      status = lastCheckpoint.resultingTrackingState;
    } else if (shippedDate) {
      status = i`Pending`;
    } else {
      status = i`Not Shipped Yet`;
    }

    const trackingCancelledTime = trackingCancelledDate?.formatted;
    const trackingCancelledDaysAgo = Math.round(
      trackingCancelledDate?.timeSince.days
    );

    const warehouseArrival = checkpoints
      ? checkpoints.find(
          (cp) => cp.wishpostAction === WishPostAction.arriveEPCWarehouse
        )
      : null;
    const warehouseDeparture = checkpoints
      ? checkpoints.find(
          (cp) => cp.wishpostAction === WishPostAction.departEPCWarehouse
        )
      : null;

    const lastUpdate =
      lastCheckpoint != null ? lastCheckpoint.date.formatted : null;
    const lastUpdateDaysAgo =
      lastCheckpoint != null
        ? Math.round(lastCheckpoint.date.timeSince.days)
        : null;
    return (
      <ScrollableAnchor id={SectionIdTrackingStatus}>
        <Card
          className={css(this.styles.card)}
          title={() => {
            return (
              <div className={css(this.styles.trackingCardTitle)}>
                <div>Tracking status</div>
                {lastUpdate && (
                  <div
                    className={css(this.styles.trackingLastUpdated)}
                    title={i`${lastUpdateDaysAgo} days ago`}
                  >
                    Last updated {lastUpdate}
                  </div>
                )}
              </div>
            );
          }}
        >
          <div className={css(this.styles.sheet)}>
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title={i`Tracking status`}
            >
              {status.toUpperCase()}
            </SheetItem>
            <div className={css(this.styles.sideBySide)}>
              {shippingDetails && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Tracking ID`}
                >
                  <CopyButton text={shippingDetails.trackingId} copyOnBodyClick>
                    {shippingDetails.trackingId}
                  </CopyButton>
                </SheetItem>
              )}
              {shippingDetails != null && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Carrier`}
                >
                  <div className={css(this.styles.flexHorizontal)}>
                    <Link
                      href={shippingDetails.provider?.providerUrl || "#"}
                      openInNewTab
                    >
                      {shippingDetails.provider
                        ? shippingDetails.provider.name
                        : i`Unknown`}
                    </Link>
                    {canShowCarrierTier && carrierTier != null && (
                      <CarrierTierLabel
                        carrierTier={carrierTier}
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </div>
                </SheetItem>
              )}
            </div>
            {this.renderTrackingDisputeItem()}
            {shippingDetails?.shipNote && (
              <SheetItem
                className={css(this.styles.genericRow)}
                title={i`Internal notes`}
              >
                {shippingDetails.shipNote}
              </SheetItem>
            )}
            {checkpoints && checkpoints.length > 0 && (
              <SheetItem
                className={css(this.styles.checkpointsRow)}
                title={i`Tracking history`}
              >
                <AftershipCheckpoints checkpoints={checkpoints} foldCount={3} />
              </SheetItem>
            )}
            {shippingEstimate && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Est. Shipping Time`}
                popoverContent={
                  i`The estimated shipping time for this order ` +
                  i`based on historical shipping data`
                }
              >
                {fbwDetails?.isFbw
                  ? i`7 Days`
                  : i`${shippingEstimate.minTime?.days} - ${shippingEstimate.maxTime?.days} Days`}
              </SheetItem>
            )}
            {releasedTime && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Available for Fulfillment`}
                popoverContent={i`The first date the order was able to be fulfilled`}
              >
                {releasedTime.formatted +
                  " " +
                  i`(${Math.round(releasedTime.timeSince.days)} days ago)`}
              </SheetItem>
            )}
            {reReleasedTime && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Order Re-Released Date`}
                popoverContent={i`The date the order was re-released to be fulfilled again`}
              >
                {reReleasedTime.formatted +
                  " " +
                  i`(${Math.round(reReleasedTime.timeSince.days)} days ago)`}
              </SheetItem>
            )}
            <div className={css(this.styles.sideBySide)}>
              {shippedDate && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Marked Shipped`}
                  popoverContent={
                    i`The date you updated the product as` +
                    i` Shipped on your Dashboard`
                  }
                >
                  {shippedDate.formatted +
                    " " +
                    (Math.round(shippedDate.timeSince.days)
                      ? "(" +
                        ni18n(
                          Math.round(shippedDate.timeSince.days),
                          "1 day ago",
                          "%1$d days ago"
                        ) +
                        ")"
                      : "(Less than 1 day ago)")}
                </SheetItem>
              )}
              {trackingCancelledTime && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Tracking ID Cancelled Date`}
                  popoverContent={i`The date the order's tracking number was detected as "Cancelled"`}
                >
                  {trackingCancelledTime +
                    " " +
                    (trackingCancelledDaysAgo
                      ? `(${ni18n(
                          trackingCancelledDaysAgo,
                          "1 day ago",
                          "%1$d days ago"
                        )})`
                      : "(Less than 1 day ago)")}
                </SheetItem>
              )}
              {shippedDate && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Confirmed Fulfillment Date`}
                  popoverContent={
                    i`The date Wish received the fulfillment ` +
                    i`confirmation from the tracking provider`
                  }
                >
                  {confirmedFulfillmentDate
                    ? confirmedFulfillmentDate.formatted +
                      " " +
                      i`(${Math.round(
                        confirmedFulfillmentDate.timeSince.days
                      )} days ago)`
                    : i`N/A`}
                </SheetItem>
              )}
            </div>
            {isCombinedOrder && (
              <div className={css(this.styles.sideBySide)}>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Warehouse Arrival Date`}
                  popoverContent={i`The date the product arrived at the warehouse`}
                >
                  {warehouseArrival
                    ? warehouseArrival.date.formatted +
                      " " +
                      i`(${Math.round(
                        warehouseArrival.date.timeSince.days
                      )} days ago)`
                    : i`N/A`}
                </SheetItem>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Warehouse Departure Date`}
                  popoverContent={i`The date the product departed the warehouse`}
                >
                  {warehouseDeparture
                    ? warehouseDeparture.date.formatted +
                      " " +
                      i`(${Math.round(
                        warehouseDeparture.date.timeSince.days
                      )} days ago)`
                    : i`N/A`}
                </SheetItem>
              </div>
            )}
            {shippedDate && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Confirmed Delivered Date`}
                popoverContent={
                  i`The date Wish received the delivery ` +
                  i` confirmation from the tracking provider`
                }
              >
                {deliveredDate
                  ? deliveredDate.formatted +
                    " " +
                    i`(${Math.round(deliveredDate.timeSince.days)} days ago)`
                  : i`N/A`}
              </SheetItem>
            )}
            {confirmedDelivered && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Time to Door`}
                popoverContent={
                  i`Time from when the order was placed to ` +
                  i`when the shipping carrier confirmed the order as delivered`
                }
              >
                {ttd != null
                  ? ni18n(ttd, "1 day", "{%1= number of days} days")
                  : i`N/A`}
              </SheetItem>
            )}
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  async initCanShowWps(): Promise<void> {
    const { order } = this;
    const experimentStore = ExperimentStore.instance();

    const isGatedForWps = await experimentStore.getDeciderKeyDecision(
      "md_wish_parcel_service"
    );

    this.canShowWps = isGatedForWps && order?.wpsFulfillment != null;
  }

  @observable
  canShowWps = false; // initialized in componentDidMount

  @computed
  get canShowWpsActions(): boolean {
    const { canShowWps, order } = this;
    if (!canShowWps || order == null) {
      return false;
    }
    const { state } = order;
    return state !== "REFUNDED";
  }

  renderWps() {
    const {
      order,
      props: { initialData },
      canShowWps,
    } = this;

    if (order == null || order.wpsFulfillment == null || !canShowWps) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdWps}>
        <Wps className={css(this.styles.card)} initialData={initialData} />
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowWishExpressStatus() {
    const { order } = this;
    if (order == null || this.order != null) {
      return false;
    }
    const cancelledByUser =
      order.state == "REFUNDED" && order.legacyRefundSource == "USER_CANCEL";
    const underReview = order.state == "REQUIRE_REVIEW";
    const showWishExpress = !cancelledByUser && !underReview;
    return (order.isWishExpress || order.isStreamline) && showWishExpress;
  }

  renderWishExpressStatus() {
    const { order } = this;
    if (order == null || !this.canShowWishExpressStatus) {
      return null;
    }

    const {
      shippedDate,
      wishExpressExtensionDays,
      shippingDetails,
      confirmedDelivered,
      warehouseFulfillmentPolicyInfo,
      shippingEstimate,
      ttdBusinessDays,
      expectedTtdBusinessDays,
      isWishExpress,
    } = order;

    if (shippingDetails == null || shippingDetails.country == null) {
      return null;
    }

    const maxTtd = shippingEstimate?.maxTime?.days;

    let timeToDoorAddedText = `(${shippingDetails.countryCode})`;

    if (wishExpressExtensionDays > 0) {
      timeToDoorAddedText = i`(${wishExpressExtensionDays} business day extension added)`;
    }

    const isDelivered =
      warehouseFulfillmentPolicyInfo != null &&
      warehouseFulfillmentPolicyInfo.deliveryState !== "NOT_DELIVERED";

    // Prettier formatting is messing w/ translation, need to use "i"
    /* eslint-disable local-rules/no-unnecessary-i-tag */
    return (
      <ScrollableAnchor id={SectionIdWishExpressStatus}>
        <Card title={i`Delivery Status`} className={css(this.styles.card)}>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Destination Country`}
          >
            {shippingDetails.countryCode}
          </SheetItem>
          <div className={css(this.styles.sideBySide)}>
            {shippedDate && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Time to Door`}
                popoverContent={
                  i`Time from when the order was placed to ` +
                  i`when the shipping carrier confirmed the order as delivered`
                }
              >
                {confirmedDelivered ? (
                  <TimeToDoor ttd={ttdBusinessDays} maxTTD={maxTtd} />
                ) : (
                  i`Not Confirmed Delivered`
                )}
              </SheetItem>
            )}
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              title={i`Max Delivery Days`}
              popoverContent={
                i`Warehouse Fulfillment Policy delivery requirements are country specific ` +
                i`unless the max delivery days (MDD) is manually set by the merchant. ` +
                i`View the Warehouse Fulfillment Policy to learn more.`
              }
            >
              <Layout.FlexRow>
                <Text>
                  {i`${expectedTtdBusinessDays} business days` +
                    " " +
                    timeToDoorAddedText}
                </Text>
                {isWishExpress && (
                  <Popover popoverContent={i`Wish Express`}>
                    <Icon
                      name="wishExpressTruck"
                      style={{ width: 20, marginLeft: 8 }}
                    />
                  </Popover>
                )}
              </Layout.FlexRow>
            </SheetItem>
          </div>
          {shippedDate != null && isDelivered && (
            <div className={css(this.styles.wishExpressRequirementsRow)}>
              <div className={css(this.styles.plainRow)}>
                Does this order meet the Warehouse Fulfillment Policy
                Requirements?
              </div>
              <Criteria
                isMet={isDelivered}
                deliveryState={warehouseFulfillmentPolicyInfo?.deliveryState}
              >
                {i`Confirmed delivered within ${expectedTtdBusinessDays} business days`}
              </Criteria>
            </div>
          )}
          <div
            className={css(this.styles.plainRow)}
            style={{ padding: "5px 0px" }}
          >
            <Button
              href="/policy#warehouse_fulfillment"
              style={{ margin: 10 }}
              openInNewTab
            >
              <Text weight="medium">View Policy</Text>
            </Button>
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  renderProductDetails() {
    const {
      props: { initialData },
      order,
    } = this;
    if (order == null) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdProductDetails}>
        <ProductDetails
          className={css(this.styles.card)}
          initialData={initialData}
        />
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowEuBoundDetails() {
    const {
      props: { initialData },
    } = this;

    const hasEuDetails = initialData.fulfillment.order.tax?.euVat != null;

    return hasEuDetails;
  }

  renderEuBoundDetails() {
    const {
      props: { initialData },
      canShowEuBoundDetails,
    } = this;

    if (!canShowEuBoundDetails) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdEuBoundDetails}>
        <EuBoundDetails
          className={css(this.styles.card)}
          initialData={initialData}
        />
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowConfirmedDeliveryPolicy() {
    const { order } = this;
    if (order == null) {
      return false;
    }

    const { shippedDate, requiresConfirmedDelivery } = order;

    return (
      shippedDate &&
      order.state != "REQUIRE_REVIEW" &&
      requiresConfirmedDelivery
    );
  }

  renderConfirmedDeliveryPolicyStatus() {
    const {
      initialData: { platformConstants },
    } = this.props;

    const { order, canShowConfirmedDeliveryPolicy } = this;
    if (order == null || !canShowConfirmedDeliveryPolicy) {
      return null;
    }

    const {
      isShippedWithQualifiedDadaCarrier,
      isInIncentiveProgram,
      confirmedDelivered,
      dadaWasDeliveredOnTime,
      hasShipped,
      releasedTime,
      tracking,
    } = order;

    const availableForFulfillmentDate =
      releasedTime != null && moment(releasedTime.iso8061);
    const confirmedFullmentDate =
      tracking?.confirmedFulfillmentDate != null &&
      moment(tracking.confirmedFulfillmentDate.iso8061);

    const shippedInTime =
      availableForFulfillmentDate &&
      confirmedFullmentDate &&
      moment
        .duration(confirmedFullmentDate.diff(availableForFulfillmentDate))
        .asDays() <= 7;

    const criteriaList: ReactNode[] = [];

    if (isInIncentiveProgram) {
      // eslint-disable-next-line local-rules/no-imperative-jsx
      criteriaList.push(
        <Criteria key="meets-incentive" isMet>
          Meets the requirements of the Incentive Program
        </Criteria>
      );
    } else {
      // eslint-disable-next-line local-rules/no-imperative-jsx
      criteriaList.push(
        <Criteria
          isMet={isShippedWithQualifiedDadaCarrier}
          key="is_qualified"
          popoverContent={
            i`For more information about Qualified Carriers, ` +
            i`see the Confirmed Delivery Policy.`
          }
          className={css(this.styles.dadaCriteria)}
        >
          Fulfilled with a qualified carrier
        </Criteria>
      );

      if (hasShipped || !shippedInTime) {
        // eslint-disable-next-line local-rules/no-imperative-jsx
        criteriaList.push(
          <Criteria
            key="confirmed_shipped"
            isMet={hasShipped && shippedInTime}
            popoverContent={i`Order must be confirmed shipped within 7 days`}
            className={css(this.styles.dadaCriteria)}
          >
            Confirmed shipped within 7 days
          </Criteria>
        );
      }

      if (
        platformConstants &&
        (confirmedDelivered || !dadaWasDeliveredOnTime)
      ) {
        // Prettier formatting is messing w/ translation, need to use "i"
        /* eslint-disable local-rules/no-unnecessary-i-tag */
        /* eslint-disable local-rules/no-imperative-jsx */
        criteriaList.push(
          <Criteria
            isMet={confirmedDelivered && !!dadaWasDeliveredOnTime}
            key="confirmed_delivered"
            className={css(this.styles.dadaCriteria)}
          >
            {i`Confirmed delivered within ${platformConstants.orders.dadaPolicyDaysToConfirmedDelivered} days`}
          </Criteria>
        );
      }
    }

    return (
      <ScrollableAnchor id={SectionIdConfirmedDelivery}>
        <Card
          title={i`Confirmed Delivery Status`}
          icon="confirmedDelivery"
          className={css(this.styles.card)}
        >
          <div
            className={css(
              this.styles.sheet,
              this.styles.confirmedDeliveryIconCard
            )}
          >
            <Text weight="medium" className={css(this.styles.plainRow)}>
              This order is included in the Confirmed Delivery Policy.
            </Text>
            <Text weight="medium" className={css(this.styles.plainRow)}>
              Does this order meet the policy requirements?
            </Text>
            {criteriaList}
            <div
              className={css(this.styles.plainRow)}
              style={{ padding: "5px 0px" }}
            >
              <Button
                href="/confirmed-delivery-policy"
                openInNewTab
                style={{ marginRight: 10 }}
              >
                View Policy
              </Button>
              {isInIncentiveProgram && (
                <Button
                  href={zendeskURL("360002698513")}
                  openInNewTab
                  style={{ marginRight: 10 }}
                >
                  View Incentive Program
                </Button>
              )}
              <Button
                openInNewTab
                href="/shipping-dest-performance#tab=delivery-confirmation"
              >
                View Shipping Performance
              </Button>
            </div>
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowRefundDetails() {
    const { order } = this;
    if (order == null) {
      return false;
    }

    const refundItems = order.refundItems;

    return (
      order.refundedTime != null ||
      (refundItems != null && refundItems.length > 0)
    );
  }

  renderOldRefund() {
    const { order } = this;
    if (order == null) {
      return null;
    }

    if (order.isNewRefund || order.legacyRefundSource == null) {
      return null;
    }

    const { refundedTime, legacyRefundSource } = order;

    return (
      <Card title={i`Refund details`} className={css(this.styles.card)}>
        {refundedTime && (
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Refund Date`}
          >
            {refundedTime.formatted}
          </SheetItem>
        )}
        <SheetItem
          className={css(this.styles.genericRow)}
          title={i`Refund reason`}
        >
          {LegacyRefundFlavourText[legacyRefundSource]}
        </SheetItem>
      </Card>
    );
  }

  renderRefundTable() {
    const { order } = this;
    if (order == null) {
      return null;
    }

    if (!order.isNewRefund) {
      return null;
    }

    const showTax =
      order.tax?.salesTax.remitTypes != null &&
      order.tax.salesTax.remitTypes.includes("MERCHANT_REMIT") &&
      order.shippedDate != null;

    return (
      <div className={css(this.styles.card)}>
        <section className={css(this.styles.sectionTitle)}>
          Refund details
        </section>
        <Card showOverflow>
          <RefundItemsTable
            orderId={order.id}
            showTax={showTax}
            fromTransactionHistory={false}
            showRefundType
            fromOrderDetails
          />
        </Card>
      </div>
    );
  }

  renderRefundDetails() {
    const { canShowRefundDetails, order } = this;
    if (order == null || !canShowRefundDetails) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdRefundDetails}>
        {order.isNewRefund ? this.renderRefundTable() : this.renderOldRefund()}
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowReturnInfo() {
    const { order } = this;
    if (order == null) {
      return false;
    }

    return order.returnLabelFee?.amount != null;
  }

  renderReturnInfo() {
    const { order, canShowReturnInfo } = this;

    if (order == null || !canShowReturnInfo) {
      return null;
    }

    const { returnDetailsId, returnLabelFee } = order;

    if (returnDetailsId == null || returnLabelFee == null) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdReturnInfo}>
        <Card title={i`Return information`} className={css(this.styles.card)}>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Return label fee`}
          >
            {returnLabelFee.amount.display}
          </SheetItem>
          <div
            className={css(this.styles.plainRow)}
            style={{ padding: "5px 0px" }}
          >
            <Button
              href={`/return-status/${returnDetailsId}`}
              openInNewTab
              style={{ margin: 10 }}
            >
              <Text weight="medium">View Return</Text>
            </Button>
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowFines() {
    const { fines } = this;
    return fines.length > 0;
  }

  @computed
  get order(): OrderDetailData | undefined {
    const {
      initialData: {
        fulfillment: { order },
      },
    } = this.props;
    return order;
  }

  renderFines() {
    const { fines } = this;
    if (fines.length === 0) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdFines}>
        <div className={css(this.styles.card)}>
          <Text weight="bold" className={css(this.styles.sectionTitle)}>
            Penalties
          </Text>
          <Card showOverflow>
            <OrderFinesTable fines={fines} hideOrderStatusColumn />
          </Card>
        </div>
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowPaymentStatus() {
    const {
      initialData: { currentUser },
    } = this.props;
    return this.order != null && !currentUser.isOnCsTeam;
  }

  renderPaymentStatus() {
    const { initialData } = this.props;

    return (
      <ScrollableAnchor id={SectionIdPaymentStatus}>
        <PaymentDetailCard
          initialData={initialData}
          className={css(this.styles.card)}
        />
      </ScrollableAnchor>
    );
  }

  @computed
  get canShowAdminDetails() {
    const {
      initialData: { su, currentUser },
    } = this.props;
    const isSuAdmin = su?.isAdmin;
    return (isSuAdmin || currentUser.isAdmin) && this.order != null;
  }

  renderAdminDetails() {
    const {
      initialData: { currentMerchant },
    } = this.props;
    const { order } = this;
    const { canShowAdminDetails } = this;
    if (!canShowAdminDetails || order == null) {
      return null;
    }

    const {
      customer,
      transactionId,
      specialPrograms,
      merchantId,
      fbwDetails,
      releasedTime,
      client,
      estimatedShippingTimeline,
      warehouseShippingType,
    } = order;
    const userId = customer.user?.id;
    const userEmail = customer.user?.email;
    const userSignupMethod = customer.user?.signupMethod;
    const userIsVerified = customer.user?.isVerified;
    const emailBouncedReason = customer.user?.emailBouncedReason;
    const maxShipDate =
      estimatedShippingTimeline != null
        ? estimatedShippingTimeline.maxShipTime
        : null;
    const maxDeliveryDate =
      estimatedShippingTimeline != null
        ? estimatedShippingTimeline.maxDeliveryTime
        : null;

    const specialOrderProgramMarkdown = specialPrograms
      ?.map(({ taskLink, name }) => {
        if (taskLink) {
          return `[${name}](${taskLink})`;
        }
        return name;
      })
      .join(", ");

    return (
      <ScrollableAnchor id={SectionIdAdminDetails}>
        <Card
          title={() => {
            return (
              <div className={css(this.styles.adminInfoCardTitle)}>
                <div>Admin info</div>
                <NotVisibleToMerchantLabel />
              </div>
            );
          }}
          className={css(this.styles.card)}
        >
          <div className={css(this.styles.sheet)}>
            <div className={css(this.styles.sideBySide)}>
              {currentMerchant && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Merchant`}
                >
                  {currentMerchant.displayName}
                </SheetItem>
              )}
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Merchant ID`}
              >
                <CopyButton text={merchantId} copyOnBodyClick={false}>
                  <Link href={`/go/${merchantId}`} openInNewTab>
                    {merchantId}
                  </Link>
                </CopyButton>
              </SheetItem>
            </div>
            {transactionId && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Transaction ID`}
              >
                <ObjectId id={transactionId} showFull copyOnBodyClick />
              </SheetItem>
            )}
            <div className={css(this.styles.sideBySide)}>
              {userId && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`User ID`}
                >
                  <CopyButton text={userId} copyOnBodyClick={false}>
                    <Link href={wishURL(`/profile?uid=${userId}`)} openInNewTab>
                      {userId}
                    </Link>
                  </CopyButton>
                </SheetItem>
              )}
              {userEmail && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`User email`}
                >
                  <CopyButton text={userEmail} copyOnBodyClick>
                    {userEmail}
                  </CopyButton>
                </SheetItem>
              )}
            </div>
            {client != null && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`App`}
              >
                {client}
              </SheetItem>
            )}
            <div className={css(this.styles.sideBySide)}>
              {userSignupMethod && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Login method`}
                >
                  {userSignupMethod}
                </SheetItem>
              )}
              {userSignupMethod === "EMAIL" && (
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  title={i`Email Verified`}
                >
                  {userIsVerified ? i`Yes` : i`No`}
                </SheetItem>
              )}
            </div>
            {releasedTime && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Transaction Date`}
              >
                {releasedTime.formatted}
              </SheetItem>
            )}
            {specialPrograms && specialOrderProgramMarkdown && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Special Programs`}
              >
                <Markdown text={specialOrderProgramMarkdown} />
              </SheetItem>
            )}
            {emailBouncedReason && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Email bounce reason`}
              >
                {emailBouncedReason}
              </SheetItem>
            )}
            {fbwDetails && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`FBW Warehouse`}
              >
                {fbwDetails.warehouseName}
              </SheetItem>
            )}
            {maxShipDate != null && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Est. Delivery Date`}
                popoverContent={
                  i`The estimated delivery date for this order ` +
                  i`based on historical shipping data`
                }
              >
                {maxShipDate.formatted}
                {` (${ni18n(
                  Math.round(maxShipDate.timeSince.days),
                  "1 day ago",
                  "%1$d days ago"
                )})`}
              </SheetItem>
            )}
            {maxDeliveryDate != null && (
              <SheetItem
                className={css(this.styles.fixedHeightSheetItem)}
                title={i`Max Delivery Date`}
                popoverContent={
                  i`The max delivery date for this order ` +
                  i`based on historical shipping data`
                }
              >
                {maxDeliveryDate.formatted}
                {` (${ni18n(
                  Math.round(maxDeliveryDate.timeSince.days),
                  "1 day ago",
                  "%1$d days ago"
                )})`}
              </SheetItem>
            )}
            {order.refundItems != null &&
              order.refundItems.length > 0 &&
              order.state == "REFUNDED" && (
                <SheetItem
                  className={css(this.styles.genericRow)}
                  title={i`User refund`}
                  popoverContent={i`Refund reason shown to the user`}
                >
                  {order.refundItems
                    .map((item) => item.reasonInfo.text)
                    .filter((reason) => reason != null)
                    .join(", ")
                    .trim()}
                </SheetItem>
              )}
            {warehouseShippingType && (
              <SheetItem
                className={css(this.styles.genericRow)}
                title={i`Warehouse Shipping Type`}
              >
                {warehouseShippingType}
              </SheetItem>
            )}
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  renderSideMenu() {
    const { order } = this;

    if (order == null) {
      return null;
    }

    const { epc, isAdvancedLogistics } = order;

    const aplusFastPaymentText = ni18n(
      20,
      "This Advanced Logistics Program order may become eligible for payment **1 calendar** day after confirmed fulfillment.",
      "This Advanced Logistics Program order may become eligible for payment **{%1=number of days} calendar** days after confirmed fulfillment."
    );
    const epcFastPaymentText = ni18n(
      20,
      "This EPC order may become eligible for payment **1 calendar** day after confirmed fulfillment.",
      "This EPC order may become eligible for payment **{%1=number of days} calendar** days after confirmed fulfillment."
    );
    return (
      <>
        {this.canShowAdminDetails && (
          <OrderSideMenuItem
            title={i`Admin info`}
            href={`#${SectionIdAdminDetails}`}
            selected={this.currentSection === SectionIdAdminDetails}
          />
        )}
        {this.order != null && (
          <OrderSideMenuItem
            title={i`Order overview`}
            href={`#${SectionIdOrderStatus}`}
            selected={this.currentSection === SectionIdOrderStatus}
          />
        )}
        {this.order != null && (
          <OrderSideMenuItem
            title={i`Product details`}
            href={`#${SectionIdProductDetails}`}
            selected={this.currentSection === SectionIdProductDetails}
          />
        )}
        {this.canShowEuBoundDetails && (
          <OrderSideMenuItem
            title={i`EU bound H7 order information`}
            href={`#${SectionIdEuBoundDetails}`}
            selected={this.currentSection === SectionIdEuBoundDetails}
          />
        )}
        {this.canShowTrackingStatus && (
          <OrderSideMenuItem
            title={i`Tracking status`}
            href={`#${SectionIdTrackingStatus}`}
            selected={this.currentSection === SectionIdTrackingStatus}
          />
        )}
        {this.canShowWps && (
          <OrderSideMenuItem
            title={i`Wish Parcel`}
            href={`#${SectionIdWps}`}
            selected={this.currentSection === SectionIdWps}
          />
        )}
        {this.canShowWishExpressStatus && (
          <OrderSideMenuItem
            title={i`Wish Express status`}
            href={`#${SectionIdWishExpressStatus}`}
            selected={this.currentSection === SectionIdWishExpressStatus}
          />
        )}
        {this.canShowConfirmedDeliveryPolicy && (
          <OrderSideMenuItem
            title={i`Confirmed delivery`}
            href={`#${SectionIdConfirmedDelivery}`}
            selected={this.currentSection === SectionIdConfirmedDelivery}
          />
        )}
        {this.canShowRefundDetails && (
          <OrderSideMenuItem
            title={i`Refunds details`}
            href={`#${SectionIdRefundDetails}`}
            selected={this.currentSection === SectionIdRefundDetails}
          />
        )}
        {this.canShowReturnInfo && (
          <OrderSideMenuItem
            title={i`Return information`}
            href={`#${SectionIdReturnInfo}`}
            selected={this.currentSection === SectionIdReturnInfo}
          />
        )}
        {this.canShowFines && (
          <OrderSideMenuItem
            title={i`Penalties`}
            href={`#${SectionIdFines}`}
            selected={this.currentSection === SectionIdFines}
          />
        )}
        {this.canShowPaymentStatus && (
          <OrderSideMenuItem
            title={() => {
              return (
                <div style={{ flexDirection: "row", display: "flex" }}>
                  <span>Payment information</span>
                  {epc?.canUncombine != null && (
                    <Popover
                      position="right"
                      popoverContent={() => {
                        return (
                          <div style={{ width: 280, margin: 8 }}>
                            <Markdown
                              text={
                                isAdvancedLogistics
                                  ? aplusFastPaymentText
                                  : epcFastPaymentText
                              }
                            />
                            <Link
                              href={
                                isAdvancedLogistics
                                  ? zendeskSectionURL("360006353574")
                                  : zendeskURL("360008230173")
                              }
                              openInNewTab
                            >
                              Learn more
                            </Link>
                          </div>
                        );
                      }}
                    >
                      <Illustration
                        name="epcFastPayments"
                        alt="illustration"
                        style={{
                          width: "24px",
                          height: "24px",
                          paddingLeft: "4px",
                        }}
                      />
                    </Popover>
                  )}
                </div>
              );
            }}
            href={`#${SectionIdPaymentStatus}`}
            selected={this.currentSection === SectionIdPaymentStatus}
          />
        )}
      </>
    );
  }

  renderWishpostShippingUpdates() {
    const { initialData } = this.props;

    return (
      <ScrollableAnchor id={SectionIdWishpostShippingUpdates}>
        <WishpostShippingUpdates
          initialData={initialData}
          className={css(this.styles.card)}
        />
      </ScrollableAnchor>
    );
  }

  renderUkFulfillmentRequirements() {
    const {
      initialData: {
        fulfillment: {
          order: { cartPrice, ukDetails, tax },
        },
      },
    } = this.props;

    if (
      ukDetails == null ||
      tax == null ||
      cartPrice == null ||
      cartPrice.preTaxProductPrice == null ||
      cartPrice.preTaxShippingPrice == null
    ) {
      return null;
    }

    const {
      productPrice,
      shippingPrice,
      vatAmount,
      overviewLink,
      isUkBound,
      isVatOrder,
    } = {
      productPrice: cartPrice.preTaxProductPrice.display,
      shippingPrice: cartPrice.preTaxShippingPrice.display,
      vatAmount: formatCurrency(
        tax.ukPriceTax.salesTax.amount + tax.ukShippingTax.salesTax.amount,
        "GBP"
      ),
      overviewLink: `/order-package-overview-doc/${this.orderId}`,
      isUkBound: ukDetails.isBoundOrder,
      isVatOrder: !!tax.isVatOrder,
    };

    const viewRequiredInfoLink = zendeskURL("1260800792790");
    const headerLearnMoreLink = zendeskURL("1260800792790");
    const overviewLearnMoreLink = zendeskURL("1260800792790");

    if (!isUkBound) {
      return null;
    }

    return (
      <ScrollableAnchor id={SectionIdUkFulfillment}>
        <Card
          className={css(this.styles.card)}
          title={() => {
            return (
              <div className={css(this.styles.ukFulfillmentDetailsCardTitle)}>
                <div>United Kingdom fulfillment requirements</div>
                <Info
                  className={css(this.styles.ukFulfillmentInfo)}
                  popoverPosition="top center"
                  text={() => (
                    <div className={css(this.styles.tooltipContent)}>
                      <Markdown
                        className={css(this.styles.tooltipHeader)}
                        text={i`**United Kingdom Fulfillment Requirements**`}
                      />
                      <Markdown
                        className={css(this.styles.tooltipParagraph)}
                        text={
                          i`All orders **shipping to the UK from outside of ` +
                          i`the UK** need to comply with the following:`
                        }
                      />
                      <Markdown
                        className={css(this.styles.tooltipParagraph)}
                        text={
                          i`• Merchants must pass a list of required ` +
                          i`order information to the carrier when generating ` +
                          i`the shipping label. [View required information](${viewRequiredInfoLink})`
                        }
                      />
                      <Markdown
                        className={css(this.styles.tooltipParagraph)}
                        text={
                          i`• Merchants must print the **Package Overview** ` +
                          i`document generated by Wish for each relevant ` +
                          i`order and include it inside the package.`
                        }
                      />
                      <Markdown
                        className={css(this.styles.tooltipParagraph)}
                        text={i`[Learn more](${headerLearnMoreLink})`}
                      />
                    </div>
                  )}
                />
              </div>
            );
          }}
        >
          <div className={css(this.styles.sheet)}>
            {!isVatOrder && (
              <>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  titleWidth={264}
                  title={i`Total product price (GBP)`}
                  popoverContent={
                    i`Prices presented are totals paid by customer ` +
                    i`and are inclusive of promotions and other adjustments. ` +
                    i`Amount paid to merchant by Wish is not affected by price adjustments ` +
                    i`and may differ from order total presented here.`
                  }
                >
                  {productPrice}
                </SheetItem>
                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  titleWidth={264}
                  title={i`Total shipping price (GBP)`}
                  popoverContent={
                    i`Prices presented are totals paid by customer ` +
                    i`and are inclusive of promotions and other adjustments. ` +
                    i`Amount paid to merchant by Wish is not affected by price adjustments ` +
                    i`and may differ from order total presented here.`
                  }
                >
                  {shippingPrice}
                </SheetItem>

                <SheetItem
                  className={css(this.styles.fixedHeightSheetItem)}
                  titleWidth={264}
                  title={i`Total VAT collected amount (GBP)`}
                  popoverContent={i`The total VAT amount paid by the customer for this order.`}
                >
                  {vatAmount}
                </SheetItem>
              </>
            )}
            <SheetItem
              className={css(this.styles.fixedHeightSheetItem)}
              titleWidth={264}
              title={i`Package Overview document`}
              popoverContent={() => (
                <div className={css(this.styles.tooltipContent)}>
                  <Markdown
                    className={css(this.styles.tooltipHeader)}
                    text={i`**Package Overview document**`}
                  />
                  <Markdown
                    className={css(this.styles.tooltipParagraph)}
                    text={
                      i`For all orders **shipping to the UK from outside of ` +
                      i`the UK**, the Package Overview document must be ` +
                      i`printed and included inside the package. [Learn more](${overviewLearnMoreLink})`
                    }
                  />
                </div>
              )}
            >
              <Link href={overviewLink}>View and print</Link>
            </SheetItem>
          </div>
        </Card>
      </ScrollableAnchor>
    );
  }

  renderActions() {
    const { canShowWps, canShowWpsActions, styles, order } = this;
    const navigationStore = NavigationStore.instance();

    if (!canShowWps || !canShowWpsActions || order == null) {
      return null;
    }
    const { id } = order;

    const downloadLink = order?.wpsFulfillment?.shippingLabelDownloadLink;
    const editLink = `/shipping-label/create/${id}`;
    const notPaid = order.wpsFulfillment?.shipmentState !== "PAID";

    return (
      <Layout.GridRow
        style={styles.actionsContainer}
        templateColumns="max-content max-content"
        gap={16}
      >
        <PrimaryButton
          style={styles.downloadShippingLabelButton}
          isDisabled={downloadLink == null || notPaid}
          onClick={async () => {
            if (downloadLink != null) {
              await navigationStore.download(downloadLink);
            }
          }}
          popoverContent={
            downloadLink == null
              ? i`Your shipping label is not ready for download yet. ` +
                i`Refresh this page shortly to access the shipping label.`
              : undefined
          }
        >
          Download shipping label
        </PrimaryButton>
        <Button href={editLink} disabled={notPaid}>
          Edit shipping label
        </Button>
      </Layout.GridRow>
    );
  }

  renderContent() {
    return (
      <StaggeredFadeIn
        className={css(this.styles.content)}
        animationDurationMs={1000}
      >
        <ScrollableAnchor id="overview">
          <section className={css(this.styles.sectionTitle)}>
            Order details
          </section>
        </ScrollableAnchor>
        {this.renderAdminDetails()}
        {this.renderOrderStatus()}
        {this.renderProductDetails()}
        {this.renderUkFulfillmentRequirements()}
        {this.renderEuBoundDetails()}
        {this.renderTrackingStatus()}
        {this.renderWps()}
        {this.renderWishExpressStatus()}
        {this.renderConfirmedDeliveryPolicyStatus()}
        {this.renderRefundDetails()}
        {this.renderReturnInfo()}
        {this.renderFines()}
        {this.renderPaymentStatus()}
        {this.renderWishpostShippingUpdates()}
      </StaggeredFadeIn>
    );
  }

  @computed
  get styles() {
    const deviceStore = DeviceStore.instance();
    const { borderPrimary, textBlack, textLight } = this.context;

    return StyleSheet.create({
      actionsContainer: {
        height: 40,
      },
      downloadShippingLabelButton: {
        height: 40,
        boxSizing: "border-box",
      },
      content: {
        marginTop: 25,
        maxWidth: 800,
      },
      card: {
        marginBottom: 30,
      },
      sheet: {
        display: "flex",
        flexDirection: "column",
      },
      fixedHeightSheetItem: {
        height: deviceStore.isSmallScreen ? RowHeight * 1.2 : RowHeight,
        padding: "0px 20px",
        borderBottom: `1px solid ${borderPrimary}`,
      },
      norwayVAT: {
        backgroundBlendMode: "darken",
        backgroundImage: "linear-gradient(to bottom, #eef2f5, #eef2f5);",
      },
      norwayVATTitle: {
        flexDirection: "row",
        display: "flex",
      },
      norwayVATExplain: {
        maxWidth: 260,
        padding: 8,
      },
      icon: {
        marginLeft: 7,
        marginTop: 5,
        width: "17px",
        height: "17px",
      },
      sideBySide: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
        ":nth-child(1n) > div": {
          flexGrow: 1,
          flexBasis: 0,
          flexShrink: 1,
          ":first-child": {
            borderRight: `1px solid ${borderPrimary}`,
          },
        },
      },
      plainRow: {
        fontSize: 16,
        lineHeight: 1.5,
        height: RowHeight,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      shippingAddressRow: {
        padding: "15px 20px",
        borderBottom: `1px solid ${borderPrimary}`,
      },
      genericRow: {
        padding: "15px 20px",
        borderBottom: `1px solid ${borderPrimary}`,
        minHeight: RowHeight,
      },
      wishExpressRequirementsRow: {
        padding: "0px 20px",
        borderBottom: `1px solid ${borderPrimary}`,
      },
      checkpointsRow: {
        padding: "15px 20px",
        borderBottom: `1px solid ${borderPrimary}`,
      },
      confirmedDeliveryIconCard: {
        padding: "0px 20px",
      },
      dadaCriteria: {
        borderBottom: `1px solid ${borderPrimary}`,
      },
      sectionTitle: {
        color: textBlack,
        fontSize: 24,
        marginBottom: 25,
      },
      trackingLastUpdated: {
        fontSize: 14,
        color: textLight,
        cursor: "default",
      },
      trackingCardTitle: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      adminInfoCardTitle: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      orderOverviewCardTitle: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      ukFulfillmentDetailsCardTitle: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      ukFulfillmentInfo: {
        marginLeft: 4,
      },
      tooltipContent: {
        maxWidth: 336,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        fontWeight: fonts.weightNormal,
      },
      tooltipHeader: {
        fontSize: 14,
        lineHeight: "20px",
        marginBottom: 8,
        whiteSpace: "pre-wrap",
      },
      tooltipParagraph: {
        fontSize: 14,
        lineHeight: "20px",
        whiteSpace: "pre-wrap",
      },
      orderLabels: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      info: {
        marginLeft: 10,
      },
      flexHorizontal: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      header: {
        alignSelf: "stretch",
      },
      ddpLabel: {
        marginLeft: 10,
      },
    });
  }

  render() {
    const {
      orderId,
      props: { initialData },
    } = this;
    if (orderId == null) {
      return <Error404 />;
    }

    const {
      fulfillment: { order },
    } = initialData;

    if (order == null) {
      return <Error404 />;
    }

    const { shippingDetails, state } = order;

    const userName = shippingDetails?.name;
    const title = userName
      ? ci18n("Placeholder is the user's name", "%1$s's order", userName)
      : i`Order details`;

    const fulfilledStates: ReadonlyArray<CommerceTransactionState> = [
      "SHIPPED",
      "REFUNDED",
    ];

    const ordersBreadcrumb = fulfilledStates.includes(state)
      ? { name: i`Order History`, href: "/transactions/history" }
      : { name: i`Unfulfilled Orders`, href: "/transactions/action" };

    const actions = this.renderActions();

    return (
      <PageRoot>
        <PlusWelcomeHeader
          title={title}
          breadcrumbs={[
            ordersBreadcrumb,
            { name: title, href: window.location.href },
          ]}
          className={css(this.styles.header)}
          actions={actions}
        />
        <PageGuide>
          <LoadingIndicator
            loadingComplete={this.order != null}
            style={{
              marginTop: this.order == null ? 300 : 0,
            }}
          >
            {this.renderContent()}
          </LoadingIndicator>
        </PageGuide>
      </PageRoot>
    );
  }
}
