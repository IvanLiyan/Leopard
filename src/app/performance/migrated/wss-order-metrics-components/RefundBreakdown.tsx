import { H5, Layout, Text } from "@ContextLogic/lego";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";
import {
  ReturnRequestRefundReason,
  WssQualityRefundReason,
  WssRefundBreakdown,
} from "@schema";
import {
  QualityRefundReasonLabel,
  WSSQualityRefundBreakdownQuery,
  WSSQualityRefundBreakdownRequest,
  WSSQualityRefundBreakdownResponse,
} from "@performance/migrated/toolkit/order-metrics";
import { css } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Skeleton from "@core/components/Skeleton";

const MAX_REFUND_REASONS_TO_SHOW = 7;

type Props = BaseProps & {
  readonly productId: string;
};

type RefundBreakdownType = Omit<WssRefundBreakdown, "reason"> & {
  readonly reason?: ReturnRequestRefundReason | "REMAINDER" | null;
};

const RefundBreakdown: React.FC<Props> = ({ style, className, productId }) => {
  const styles = useStylesheet();
  const { pie: palette } = useTheme();

  const { data, loading } = useQuery<
    WSSQualityRefundBreakdownResponse,
    WSSQualityRefundBreakdownRequest
  >(WSSQualityRefundBreakdownQuery, {
    variables: {
      productId,
    },
  });

  const breakdownData: ReadonlyArray<WssRefundBreakdown> = Array.from(
    data?.currentMerchant?.wishSellerStandard.deepDive
      ?.qualityRefundBreakdown || [],
  ).sort((a, b) => {
    if (b.count == null) {
      return -1;
    }
    if (a.count == null) {
      return 1;
    }
    return b.count - a.count;
  });

  const mergedBreakdownData = useMemo<
    ReadonlyArray<RefundBreakdownType>
  >(() => {
    if (breakdownData.length > MAX_REFUND_REASONS_TO_SHOW) {
      const firstHalf = breakdownData.slice(0, MAX_REFUND_REASONS_TO_SHOW - 1);
      const secondHalf = breakdownData
        .slice(MAX_REFUND_REASONS_TO_SHOW - 1, breakdownData.length)
        .reduce<RefundBreakdownType>((prev, cur) => {
          return {
            reason: "REMAINDER",
            count: (prev.count || 0) + (cur.count || 0),
          };
        }, {});
      return [...firstHalf, secondHalf];
    }
    return breakdownData;
  }, [breakdownData]);

  const totalRefund =
    data?.currentMerchant?.wishSellerStandard.deepDive?.qualityRefundBreakdown?.reduce<number>(
      (prev, cur) => (cur.count != null ? prev + cur.count : prev),
      0,
    );

  if (loading) {
    return <Skeleton height={277} sx={{ margin: "24px 0px" }} />;
  }

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="flex-start"
    >
      <div style={{ width: 325, height: 325 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={mergedBreakdownData as RefundBreakdownType[]}
              dataKey={"count"}
              innerRadius={80}
              outerRadius={140}
            >
              {mergedBreakdownData.map((entry, idx) => (
                <Cell key={entry.reason} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <Layout.FlexColumn>
        <H5>
          {ci18n(
            "Title of section that lists refund reasons for a selected product",
            "Refund reasons",
          )}
        </H5>
        <Layout.GridRow
          style={styles.reasonList}
          templateColumns={"auto 1fr auto"}
          smallScreenTemplateColumns={"auto 1fr auto"}
        >
          {mergedBreakdownData?.map((entry, idx) => {
            if (entry.reason == null || entry.count == null) {
              return null;
            }
            return (
              <React.Fragment key={entry.reason}>
                <div
                  className={css({
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    background: palette[idx],
                  })}
                />
                <Text style={styles.refundDescription}>
                  {entry.reason == "REMAINDER"
                    ? ci18n(
                        "Means a group of more than 1 refund reasons",
                        "Other refund reasons ({%1=number of reasons})",
                        entry.count,
                      )
                    : QualityRefundReasonLabel[
                        entry.reason as WssQualityRefundReason
                      ]}
                </Text>
                <Text style={styles.refundPercentage}>
                  {entry.count != null && totalRefund
                    ? numeral(entry.count / totalRefund).format("0.00%")
                    : "-"}
                </Text>
              </React.Fragment>
            );
          })}
        </Layout.GridRow>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          gap: 80,
          flexWrap: "wrap",
          alignItems: "flex-start",
        },
        refundDescription: {
          fontSize: 12,
          justifySelf: "start",
        },
        refundPercentage: {
          fontSize: 12,
          justifySelf: "end",
        },
        reasonList: {
          marginTop: 23,
          gap: 16,
        },
      }),
    [],
  );
};
export default observer(RefundBreakdown);
