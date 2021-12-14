/* eslint-disable local-rules/use-markdown */

import React, { ReactNode, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useApolloStore } from "@stores/ApolloStore";

/* Lego Components */
import {
  Info,
  Link,
  Table,
  CellInfo,
  LoadingIndicator,
  Text,
  Layout,
  Markdown,
} from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { yellowExclamation } from "@assets/icons";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import RefundTypePopover from "@merchant/component/payments/refunds/RefundTypePopover";

/* Type Imports */
import {
  OrderSchema,
  OrderRefundItemsSummarySchema,
  Datetime,
} from "@schema/types";
import { PickedRefundItems, OrderDetailData } from "@toolkit/orders/detail";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

const GET_ORDER_INFO_QUERY = gql`
  query RefundItemsTable_GetOrderInfoQuery($orderId: String!) {
    payments {
      currentMerchant {
        nextPayoutTime {
          formatted(fmt: "M-d-y")
        }
      }
    }
    fulfillment {
      order(id: $orderId) {
        isUnityOrder
        isRemovedFromAdvancedLogistics
        initialWishpostShipping {
          display
        }
        quantity
        withholdWarningId
        withholdReasonText
        counterfeitRefundWarningId
        refundItemsSummary {
          isPartialAmountRefunded
          refundedQuantity
          refundedPercentage
        }
        refundItems {
          id
          quantity
          refundTime {
            formatted(fmt: "M-d-y")
          }
          merchantResponsibleAmount {
            amount
            display
          }
          merchantResponsibleAmountWishpost: merchantResponsibleAmount(
            includeWishpostFee: true
          ) {
            amount
            display
          }
          merchantResponsibilityRatio
          payment {
            id
            status
            time {
              formatted(fmt: "M-d-y")
            }
            merchantAmount {
              amount
              display
              currencyCode
            }
            merchantAmountWishpost: merchantAmount(includeWishpostFee: true) {
              amount
              currencyCode
              display
            }
          }
          reasonInfo {
            reason
            text
          }
          refundTax {
            amount
            display
            currencyCode
          }
          note
          isDisputable
          eatCostWarning {
            id
          }
          dispute {
            supportingPolicy
          }
          source
        }
      }
    }
  }
`;
type PickedOrderSchema = Pick<
  OrderSchema,
  | "isUnityOrder"
  | "isRemovedFromAdvancedLogistics"
  | "initialWishpostShipping"
  | "quantity"
  | "withholdWarningId"
  | "withholdReasonText"
  | "counterfeitRefundWarningId"
>;
type ResponseType = {
  readonly payments?: {
    readonly currentMerchant?: {
      readonly nextPayoutTime?: Pick<Datetime, "formatted"> | null;
    };
  };
  readonly fulfillment: {
    readonly order: PickedOrderSchema & {
      readonly refundItemsSummary?: Pick<
        OrderRefundItemsSummarySchema,
        "isPartialAmountRefunded" | "refundedPercentage" | "refundedQuantity"
      > | null;
      readonly refundItems?: ReadonlyArray<PickedRefundItems> | null;
    };
  };
};
type RequestType = {
  readonly orderId: string;
};

export type RefundItemsTableProps = BaseProps & {
  readonly orderId: OrderDetailData["id"];
  readonly showTax: boolean | null | undefined;
  readonly fromTransactionHistory: boolean | null | undefined;
  readonly showRefundType: boolean | null | undefined;
  readonly fromOrderDetails?: boolean;
};

const RefundItemsTable: React.FC<RefundItemsTableProps> = (
  props: RefundItemsTableProps,
) => {
  const styles = useStylesheet();
  const { orderId, fromOrderDetails = false } = props;
  const { client } = useApolloStore();
  const { data: orderData, loading } = useQuery<ResponseType, RequestType>(
    GET_ORDER_INFO_QUERY,
    {
      variables: {
        orderId,
      },
      client,
    },
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (orderData == null || orderData.fulfillment.order == null) {
    return null;
  }

  const renderWithholdWarning = (): ReactNode => {
    const { orderId } = props;
    const withholdWarningId = orderData.fulfillment.order.withholdWarningId;

    return (
      <Link href={`/warning/view/${withholdWarningId}?order_id=${orderId}}`}>
        File Dispute
      </Link>
    );
  };

  const renderCounterfeitRefundWarning = (): ReactNode => {
    const counterfeitRefundWarningId =
      orderData.fulfillment.order.counterfeitRefundWarningId;

    return (
      <Link href={`/warning/view/${counterfeitRefundWarningId}`}>
        File Dispute
      </Link>
    );
  };

  const renderOpenDispute = (row: PickedRefundItems): ReactNode => {
    const { orderId } = props;

    return (
      <>
        <Link href={`/open-dispute/${orderId}${row.id}`}>File Dispute</Link>
        {row.reasonInfo?.text != null &&
          row.reasonInfo.reason != "SUSPECTED_FRAUD" && (
            <Layout.FlexRow>
              <Text className={css(styles.smallTip)}>Dispute Reason:</Text>
              <Info
                className={css(styles.tooltip)}
                text={row.reasonInfo.text}
                size={10}
                position="top center"
                sentiment="info"
              />
            </Layout.FlexRow>
          )}
      </>
    );
  };

  const showReportFraudLink = () => {
    // We want to hide the "report fraud" button for Unity orders that do not
    // yet have INITIAL WishPost shipping present on the order
    if (orderData == null) {
      return false;
    }

    const {
      fulfillment: {
        order: {
          isUnityOrder,
          isRemovedFromAdvancedLogistics,
          initialWishpostShipping,
        },
      },
    } = orderData;

    if (isUnityOrder == false) {
      return true;
    }

    if (isRemovedFromAdvancedLogistics == true) {
      return true;
    }

    return initialWishpostShipping != null;
  };

  const renderEatCostWarning = (row: PickedRefundItems): ReactNode => {
    const { orderId } = props;

    if (row.eatCostWarning == null) {
      return null;
    }

    const link = (
      <div className={css(styles.popupDialog)}>
        <Text>
          Your store is responsible for the cost of this refund due to an
          infraction.
        </Text>
        <Link href={`/warning/view/${row.eatCostWarning.id}`}>Learn more</Link>
      </div>
    );

    return (
      <>
        <Popover
          popoverContent={() => {
            return link;
          }}
          popoverMaxWidth={250}
          position="top center"
        >
          <div>
            <img
              src={yellowExclamation}
              className={css(styles.icon)}
              draggable="false"
            />{" "}
            {i`View Infraction`}
          </div>
        </Popover>
        <br />
        {showReportFraudLink() && (
          <Link href={`/open-dispute/${orderId}${row.id}?report-fraud=true`}>
            Report Fraud
          </Link>
        )}
      </>
    );
  };

  const renderNotEligibleForDispute = (row: PickedRefundItems): ReactNode => {
    const { orderId } = props;

    if (row.isDisputable) {
      return null;
    }

    return (
      <>
        <Link
          href={`/policy/refunds#${
            row.dispute != null ? row.dispute.supportingPolicy : ""
          }`}
        >
          Not eligible for dispute
        </Link>
        <br />
        {showReportFraudLink() &&
          row.reasonInfo != null &&
          row.reasonInfo.reason != "MERCHANT_REPORTED_BUYER_FRAUD" && (
            <Link href={`/open-dispute/${orderId}${row.id}?report-fraud=true`}>
              Report Fraud
            </Link>
          )}
      </>
    );
  };

  const renderResponsibilityLinks = (row: PickedRefundItems): ReactNode => {
    const {
      fulfillment: {
        order: {
          withholdWarningId,
          withholdReasonText,
          counterfeitRefundWarningId,
        },
      },
    } = orderData;

    if (withholdWarningId != null && withholdReasonText != null) {
      return renderWithholdWarning();
    }

    if (counterfeitRefundWarningId != null) {
      return renderCounterfeitRefundWarning();
    }

    if (row.isDisputable) {
      return renderOpenDispute(row);
    }

    if (row.eatCostWarning != null) {
      return renderEatCostWarning(row);
    }

    return renderNotEligibleForDispute(row);
  };

  const renderResponsibilityFooter = (row: PickedRefundItems): ReactNode => {
    if (
      row.payment.merchantAmount != null &&
      row.payment.merchantAmount.amount > 0
    ) {
      return renderResponsibilityLinks(row);
    }
    return null;
  };

  const renderRefundReasonColumn = ({
    row,
  }: CellInfo<React.ReactElement, PickedRefundItems>) => {
    if (row.note && row.note.length > 0 && row.reasonInfo != null) {
      return `${row.reasonInfo.text} (${row.note})`;
    } else if (row.reasonInfo != null) {
      return row.reasonInfo.text;
    }
    return null;
  };

  const renderRefundTypeColumn = ({
    row,
  }: CellInfo<React.ReactElement, PickedRefundItems>) => {
    const { showRefundType } = props;
    const {
      fulfillment: {
        order: { refundItemsSummary },
      },
    } = orderData;

    if (refundItemsSummary == null) {
      return null;
    }

    const orderQuantity = orderData.fulfillment.order.quantity;

    if (!showRefundType) {
      return row.quantity;
    }

    if (refundItemsSummary.isPartialAmountRefunded) {
      return (
        <>
          <Layout.FlexRow>
            <Text className={css(styles.refundTypeName)}>Partial</Text>
            :&nbsp;
            {refundItemsSummary.refundedPercentage != null && (
              <Text>${refundItemsSummary.refundedPercentage * 100}%)</Text>
            )}
          </Layout.FlexRow>
        </>
      );
    }

    return (
      <>
        <Layout.FlexRow>
          <Text className={css(styles.refundTypeName)}>Quantity</Text>
          :&nbsp;
          <Text>
            {row.quantity} / {orderQuantity}
          </Text>
        </Layout.FlexRow>
      </>
    );
  };

  const renderResponsibilityColumn = ({
    row,
  }: CellInfo<React.ReactElement, PickedRefundItems>) => {
    if (row.merchantResponsibleAmount == null) {
      return null;
    }

    return (
      <>
        {`${row.merchantResponsibleAmount.display} (${
          row.merchantResponsibilityRatio * 100
        }%)`}
        <br />
        {renderResponsibilityFooter(row)}
      </>
    );
  };

  const renderDeductionStatus = ({
    row,
  }: CellInfo<React.ReactElement, PickedRefundItems>) => {
    if (
      row.payment.merchantAmount == null ||
      orderData.payments == null ||
      orderData.payments.currentMerchant?.nextPayoutTime == null
    ) {
      return null;
    }

    const nextPaymentDate =
      orderData.payments.currentMerchant.nextPayoutTime.formatted;

    if (
      (row.payment.merchantAmountWishpost?.amount ||
        row.payment.merchantAmount.amount) +
        (showTax && row.refundTax != null ? row.refundTax.amount : 0) >
      0
    ) {
      if (row.payment.status === "UNDEDUCTED") {
        return `Will be deducted on ${nextPaymentDate}`;
      } else if (row.payment.time != null) {
        return (
          <Markdown
            text={i`Deducted on [${row.payment.time.formatted}](/payment-detail/${row.payment.id})`}
          />
        );
      }
    }
    return i`N/A`;
  };

  const renderTotalRow = (): ReactNode => {
    const { showTax, fromTransactionHistory, showRefundType } = props;

    const {
      fulfillment: {
        order: { refundItemsSummary, refundItems },
      },
    } = orderData;

    if (
      fromOrderDetails ||
      refundItems == null ||
      refundItems.length == 0 ||
      refundItemsSummary == null
    ) {
      return null;
    }

    const { isPartialAmountRefunded, refundedQuantity, refundedPercentage } =
      refundItemsSummary;

    const totalRefundWithWishpost = refundItems.reduce(
      (acc, { payment: { merchantAmount, merchantAmountWishpost } }) => {
        const amount =
          merchantAmountWishpost != null
            ? merchantAmountWishpost.amount
            : merchantAmount?.amount || 0;
        return acc + amount;
      },
      0,
    );

    const totalResponsibleRefundWithWishpost = refundItems.reduce(
      (
        acc,
        { merchantResponsibleAmount, merchantResponsibleAmountWishpost },
      ) => {
        const amount =
          merchantResponsibleAmountWishpost != null
            ? merchantResponsibleAmountWishpost.amount
            : merchantResponsibleAmount?.amount || 0;
        return acc + amount;
      },
      0,
    );

    const totalRefundTax = refundItems.reduce(
      (acc, { refundTax }) => acc + (refundTax != null ? refundTax.amount : 0),
      0,
    );

    const currencyCode =
      refundItems[0].payment.merchantAmount != null
        ? refundItems[0].payment.merchantAmount.currencyCode
        : undefined;
    const refundTaxCurrencyCode =
      refundItems[0].refundTax != null
        ? refundItems[0].refundTax.currencyCode
        : undefined;

    // no need to render the total row from the order status page
    return (
      totalRefundWithWishpost && (
        <Table.FixtureRow>
          <Table.FixtureCell
            className={css(styles.totalRowTitle)}
            spanCount={fromTransactionHistory ? 3 : 2}
          >
            Total
          </Table.FixtureCell>
          <Table.FixtureCell className={css(styles.totalRowCell)}>
            {showRefundType && isPartialAmountRefunded
              ? refundedPercentage
              : refundedQuantity}
          </Table.FixtureCell>
          <Table.FixtureCell className={css(styles.totalRowCell)}>
            {formatCurrency(totalRefundWithWishpost, currencyCode)}
          </Table.FixtureCell>
          {!fromTransactionHistory && (
            <Table.FixtureCell className={css(styles.totalRowCell)}>
              {formatCurrency(totalResponsibleRefundWithWishpost, currencyCode)}
            </Table.FixtureCell>
          )}
          {showTax && !fromTransactionHistory && (
            <Table.FixtureCell className={css(styles.totalRowCell)}>
              {formatCurrency(totalRefundTax, refundTaxCurrencyCode)}
            </Table.FixtureCell>
          )}
          {!fromTransactionHistory && (
            <Table.FixtureCell className={css(styles.totalRowCell)}>
              {formatCurrency(
                totalResponsibleRefundWithWishpost +
                  (showTax ? totalRefundTax : 0),
                refundTaxCurrencyCode,
              )}
            </Table.FixtureCell>
          )}
          {!fromTransactionHistory && (
            <Table.FixtureCell className={css(styles.totalRowCell)} />
          )}
        </Table.FixtureRow>
      )
    );
  };

  const renderRefundTypeTitle = (): ReactNode => {
    const { showRefundType } = props;

    return (
      <Layout.FlexRow>
        <Text>{showRefundType ? i`Refund Type` : i`Quantity`}</Text>
        {showRefundType && (
          <Info
            size={16}
            position="left"
            sentiment="info"
            popoverMaxWidth={250}
            className={css(styles.tooltip)}
            popoverContent={() => <RefundTypePopover />}
          />
        )}
      </Layout.FlexRow>
    );
  };

  const renderDeductionTitle = (): ReactNode => {
    return (
      <Layout.FlexRow>
        <Text>Total Deductions</Text>
        {showTax && (
          <Info
            text={
              i`Net amount (cost & tax) that will be deducted` +
              i` from merchant's next payment.`
            }
            size={14}
            position="left"
            sentiment="info"
            popoverMaxWidth={250}
            contentWidth={150}
            className={css(styles.tooltip)}
          />
        )}
      </Layout.FlexRow>
    );
  };

  const { showTax, fromTransactionHistory, className, style } = props;

  const refundItems = orderData.fulfillment.order.refundItems;

  return (
    <Table
      className={css(className, style)}
      data={refundItems || undefined}
      cellStyle={() => ({ verticalAlign: "middle" })}
      hideBorder
    >
      <Table.Column
        title={i`Refund Date`}
        columnKey="refundTime.formatted"
        align="left"
        multiline
      />
      {fromTransactionHistory && (
        <Table.Column title={i`Refunded By`} columnKey="source" align="left" />
      )}
      <Table.Column
        title={i`Refund Reason`}
        columnKey="reasonInfo.text"
        align="left"
        multiline
      >
        {renderRefundReasonColumn}
      </Table.Column>
      <Table.Column
        title={() => renderRefundTypeTitle()}
        columnKey="quantity"
        align="left"
      >
        {renderRefundTypeColumn}
      </Table.Column>
      <Table.Column
        title={i`Total Cost Refunded`}
        columnKey="payment.merchantAmount.display"
        align="left"
      />
      {!fromTransactionHistory && (
        <Table.Column
          className={css(styles.responsibilityDisplay)}
          title={i`Responsibility`}
          columnKey="merchantResponsibleAmount"
          align="left"
          multiline
          width={150}
        >
          {renderResponsibilityColumn}
        </Table.Column>
      )}
      {showTax && !fromTransactionHistory && (
        <Table.Column
          title={i`Tax Refunded`}
          columnKey="refundTax.display"
          noDataMessage="-"
          align="left"
        />
      )}
      {!fromTransactionHistory && (
        <Table.Column
          title={() => renderDeductionTitle()}
          columnKey="payment.merchantAmount.display"
          align="left"
        >
          {({ row }: CellInfo<React.ReactNode, PickedRefundItems>) => {
            const amount =
              (row.payment.merchantAmountWishpost != null
                ? row.payment.merchantAmountWishpost.amount
                : row.payment.merchantAmount?.amount || 0) +
              (showTax && row.refundTax != null ? row.refundTax.amount : 0);

            return formatCurrency(
              amount,
              row.payment.merchantAmount?.currencyCode,
            );
          }}
        </Table.Column>
      )}
      // Do not show deduction status if payment is still to be paid
      {!fromTransactionHistory && (
        <Table.Column
          title={i`Deduction Status`}
          columnKey={"payment.id"}
          align="left"
          noDataMessage="-"
          multiline
        >
          {renderDeductionStatus}
        </Table.Column>
      )}
      {renderTotalRow()}
    </Table>
  );
};

const useStylesheet = () => {
  const { primaryLight, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        link: {
          marginLeft: 2,
        },
        responsibilityDisplay: {
          display: "inline-block",
          textAlign: "left",
          width: "100%",
        },
        totalRowTitle: {
          backgroundBlendMode: "darken",
          backgroundImage: `linear-gradient(to bottom, #${primaryLight}, #${primaryLight})`,
          fontWeight: fonts.weightBold,
          fontSize: 14,
          padding: 0,
          border: "none",
          verticalAlign: "middle",
        },
        totalRowCell: {
          backgroundBlendMode: "darken",
          backgroundImage: `linear-gradient(to bottom, #${primaryLight}, #${primaryLight})`,
          fontWeight: fonts.weightBold,
          fontSize: 14,
          border: "none",
          textAlign: "left",
          verticalAlign: "middle",
        },
        smallTip: {
          fontSize: 10,
        },
        icon: {
          width: 14,
          height: 14,
          alignSelf: "flex-start",
        },
        popupDialog: {
          maxWidth: 300,
          textAlign: "center",
          padding: 8,
        },
        tooltip: {
          margin: "2px 0px 0px 2px",
        },
        refundTypeName: {
          color: textLight,
        },
      }),
    [primaryLight, textLight],
  );
};

export default observer(RefundItemsTable);
