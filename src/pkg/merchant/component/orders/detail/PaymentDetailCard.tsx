import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Layout,
  Link,
  Text,
  Info,
  Table,
  Card,
  CellInfo,
  LoadingIndicator,
} from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import MerchantPaymentDetail from "@legacy/view/modal/MerchantPaymentDetail";
import OrderPaymentStateLabel from "@plus/component/orders/order-history/OrderPaymentStateLabel";

import { OrderDetailInitialData } from "@toolkit/orders/detail";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";
import { zendeskURL } from "@toolkit/url";
import RevShareQualifierLabel from "./RevShareQualifierLabel";

type Props = BaseProps & {
  readonly initialData: OrderDetailInitialData;
};

type RevShareAdjustmentTableData = {
  readonly id: string;
  readonly date: string;
  readonly disputeId?: string | null;
  readonly paymentId?: string | null;
  readonly previousRevShare?: number | null;
  readonly newRevShare?: number | null;
  readonly adjustment: string;
};

type RevShareAdjustmentRow = CellInfo<
  RevShareAdjustmentTableData,
  RevShareAdjustmentTableData
>;

const NoData = "--";

const PaymentDetailCard: React.FC<Props> = ({
  initialData,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();
  const {
    fulfillment: {
      order: {
        id: mtid,
        paymentStatus,
        originalRevShare,
        updatedRevShare,
        oneoffPayment,
        revShare,
      },
    },
  } = initialData;
  const { decision: showRevShare, isLoading: showRevShareIsLoading } =
    useDeciderKey("order_details_rev_share");

  const revShareLearnMoreLink = zendeskURL("204531538");
  const adjustmentLearnMoreLink = zendeskURL("4403535077403");

  const revenueShare =
    updatedRevShare == null ? originalRevShare : updatedRevShare;

  const qualifiers = revShare?.qualifiers || [];

  const revShareAdjustmentTableData =
    useMemo((): ReadonlyArray<RevShareAdjustmentTableData> => {
      if (oneoffPayment == null) {
        return [];
      }
      return [
        {
          id: oneoffPayment.id,
          date: oneoffPayment.creationTime.formatted,
          disputeId: oneoffPayment.disputeId,
          paymentId: oneoffPayment.paymentId,
          previousRevShare: originalRevShare,
          newRevShare: updatedRevShare,
          adjustment: oneoffPayment.amount.display,
        },
      ];
    }, [oneoffPayment, originalRevShare, updatedRevShare]);

  return (
    <Card title={i`Payment information`} className={css(className, style)}>
      <SheetItem title={i`Status`} className={css(styles.fixedHeightSheetItem)}>
        <Layout.FlexRow alignItems="center">
          {paymentStatus && (
            <OrderPaymentStateLabel
              state={paymentStatus}
              className={css(styles.label)}
            />
          )}
          <Link onClick={() => new MerchantPaymentDetail({ mtid }).render()}>
            View Details
          </Link>
        </Layout.FlexRow>
      </SheetItem>
      {showRevShare &&
        revenueShare != null &&
        (showRevShareIsLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <SheetItem
              className={css(styles.fixedHeightSheetItem)}
              title={i`Revenue share`}
              popoverContent={i`Revenue share percentage is calculated per order. [Learn more](${revShareLearnMoreLink})`}
            >
              {revenueShare}%
            </SheetItem>
            {qualifiers.length > 0 && (
              <SheetItem
                className={css(styles.qualifiersSheetItem)}
                title={i`Basis for revenue share`}
                freezeTitleWidth
              >
                <Layout.FlexRow className={css(styles.qualifiers)}>
                  {qualifiers.map((qualifier) => (
                    <RevShareQualifierLabel
                      className={css(styles.qualifierLabel)}
                      key={qualifier}
                      qualifier={qualifier}
                    />
                  ))}
                </Layout.FlexRow>
              </SheetItem>
            )}
            {revShareAdjustmentTableData.length != 0 && (
              <Layout.FlexColumn className={css(styles.adjustmentSection)}>
                <Layout.FlexRow>
                  <Text className={css(styles.title)} weight="semibold">
                    Revenue share adjustment
                  </Text>
                  <Info
                    position="top center"
                    popoverMaxWidth={250}
                    popoverContent={
                      i`If a Product Category Dispute results in a revenue share adjustment, the ` +
                      i`relevant payment information is included here. [Learn more](${adjustmentLearnMoreLink})`
                    }
                    className={css(styles.info)}
                    openContentLinksInNewTab
                  />
                </Layout.FlexRow>
                <Table
                  data={revShareAdjustmentTableData}
                  className={css(styles.revShareTable)}
                >
                  <Table.Column title={i`Date`} columnKey="date" />

                  <Table.Column
                    title={i`Dispute Details`}
                    columnKey="disputeId"
                  >
                    {({ row: { disputeId } }: RevShareAdjustmentRow) =>
                      disputeId == null ? (
                        NoData
                      ) : (
                        <Link
                          href={`/product-category-dispute/${disputeId}`}
                          openInNewTab
                        >{`...${disputeId.slice(-5)}`}</Link>
                      )
                    }
                  </Table.Column>

                  <Table.Column title={i`Payment Details`} columnKey="id">
                    {({ row: { id } }: RevShareAdjustmentRow) =>
                      id == null ? (
                        NoData
                      ) : (
                        <Link
                          href={`/oneoff-payment-detail/${id}`}
                          openInNewTab
                        >{`...${id.slice(-5)}`}</Link>
                      )
                    }
                  </Table.Column>

                  <Table.Column
                    title={i`Previous Revenue Share`}
                    columnKey="previousRevShare"
                  >
                    {({ row: { previousRevShare } }: RevShareAdjustmentRow) =>
                      previousRevShare == null ? NoData : `${previousRevShare}%`
                    }
                  </Table.Column>

                  <Table.Column
                    title={i`New Revenue Share`}
                    columnKey="newRevShare"
                  >
                    {({ row: { newRevShare } }: RevShareAdjustmentRow) =>
                      newRevShare == null ? NoData : `${newRevShare}%`
                    }
                  </Table.Column>

                  <Table.Column title={i`Adjustment`} columnKey="adjustment" />
                </Table>
              </Layout.FlexColumn>
            )}
          </>
        ))}
    </Card>
  );
};

const RowHeight = 50;

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fixedHeightSheetItem: {
          "@media (max-width: 900px)": {
            height: RowHeight * 1.2,
          },
          "@media (min-width: 900px)": {
            height: RowHeight,
          },
          padding: "0px 20px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        label: {
          marginRight: 15,
        },
        title: {
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
        },
        info: {
          marginTop: 1,
          marginLeft: 7,
        },
        adjustmentSection: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "15px 20px",
        },
        revShareTable: {
          marginTop: 8,
        },
        popoverContent: {
          padding: 16,
          maxWidth: 250,
        },
        qualifiersSheetItem: {
          borderBottom: `1px solid ${borderPrimary}`,
          "@media (max-width: 900px)": {
            padding: "11px 20px 19px 20px",
          },
          "@media (min-width: 900px)": {
            padding: "6px 20px 14px 20px",
          },
        },
        qualifiers: {
          flexWrap: "wrap",
        },
        qualifierLabel: {
          marginTop: 8,
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
      }),
    [textBlack, borderPrimary]
  );
};
export default observer(PaymentDetailCard);
