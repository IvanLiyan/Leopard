/*
 * WarehousePastTable.tsx
 *
 * Created by Jonah Dlin on Fri Feb 26 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";
import moment from "moment/moment";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  LoadingIndicator,
  PageIndicator,
  Popover,
  SimpleSelect,
  Table,
  Text,
  Layout,
} from "@ContextLogic/lego";

/* Merchant Components */
import { Illustration } from "@merchant/component/core";
import { useTheme } from "@stores/ThemeStore";
import {
  GetWeekStatsInput,
  GET_WEEK_STATS,
  PickedWarehouseType,
  WarehouseOverviewInitialData,
} from "@toolkit/products/warehouse-overview";
import { useQuery } from "react-apollo";

type Props = BaseProps & {
  readonly warehouse: PickedWarehouseType;
};

const LIMIT_OPTIONS: ReadonlyArray<number | "ALL"> = [5, 10, "ALL"];
const UPPER_LIMIT = 24;

type TableRow = {
  readonly startDate: string;
  readonly endDate: string;
  readonly lateDeliveries?: number;
  readonly expectedDeliveries?: number;
  readonly isLateDeliveryRateHigh?: boolean | null;
  readonly isLateDeliveryRateAtRisk?: boolean | null;
  readonly weLateDeliveryRate?: number | null;
  readonly weIsLateDeliveryRateAtRisk?: boolean | null;
  readonly weIsLateDeliveryRateHigh?: boolean | null;
  readonly maxExpectedGmv?: string;
};

const WarehousePastTable: React.FC<Props> = ({
  className,
  style,
  warehouse,
}: Props) => {
  const styles = useStylesheet();

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(LIMIT_OPTIONS[0]);

  const totalCount = UPPER_LIMIT;
  const limitNumber = limit === "ALL" ? UPPER_LIMIT : limit;

  const { data, loading: isLoadingWeekStats } = useQuery<
    WarehouseOverviewInitialData,
    GetWeekStatsInput
  >(GET_WEEK_STATS, {
    variables: {
      offset: 0,
      limit: totalCount,
      id: warehouse.id,
      startDate: {
        unix: moment()
          .utc()
          .startOf("week")
          .subtract(UPPER_LIMIT, "weeks")
          .unix(),
      },
      endDate: {
        unix: moment().utc().endOf("week").subtract(1, "week").unix(),
      },
    },
  });

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limitNumber);
  };

  const renderNoData = () => <div className={css(styles.ldrNoData)}>--</div>;

  const tableData: ReadonlyArray<TableRow> = useMemo(() => {
    const warehouseWithData =
      data != null && data.currentMerchant.warehouses != null
        ? data.currentMerchant.warehouses[0]
        : null;
    const weekStats =
      warehouseWithData == null ? [] : warehouseWithData.weekStats;

    const weekStart = moment().utc().subtract(1, "weeks").startOf("week");
    const weekEnd = moment().utc().subtract(1, "weeks").endOf("week");

    return _.range(UPPER_LIMIT)
      .map((_, index) => {
        weekEnd.subtract(index > 0 ? 1 : 0, "weeks");
        weekStart.subtract(index > 0 ? 1 : 0, "weeks");
        const weekData = weekStats.find(
          // + 1 for difference between moment unix and BE unix
          ({ endDate: { unix } }) => unix == weekEnd.unix() + 1,
        );
        if (weekData == null) {
          return {
            startDate: weekStart.format("M/D"),
            endDate: weekEnd.format("M/D"),
          };
        }
        return {
          startDate: weekData.startDate.formatted,
          endDate: weekData.endDate.formatted,
          lateDeliveries: weekData.lateDeliveries,
          expectedDeliveries: weekData.expectedDeliveries,
          isLateDeliveryRateAtRisk: weekData.isLateDeliveryRateAtRisk,
          isLateDeliveryRateHigh: weekData.isLateDeliveryRateHigh,
          weLateDeliveryRate: weekData.weLateDeliveryRate,
          weIsLateDeliveryRateAtRisk: weekData.weIsLateDeliveryRateAtRisk,
          weIsLateDeliveryRateHigh: weekData.weIsLateDeliveryRateHigh,
          maxExpectedGmv: weekData.maxExpectedGmv.display,
        };
      })
      .slice(offset, Math.min(offset + limitNumber, totalCount));
  }, [data, offset, limitNumber, totalCount]);

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Layout.FlexRow
        justifyContent="flex-end"
        className={css(styles.paginationContainer)}
      >
        <PageIndicator
          style={css(styles.pageIndicator)}
          totalItems={totalCount}
          rangeStart={offset + 1}
          rangeEnd={Math.min(offset + limitNumber, totalCount)}
          hasNext={offset + limitNumber < totalCount}
          hasPrev={offset > 0}
          currentPage={Math.ceil(offset / limitNumber)}
          onPageChange={onPageChange}
        />
        <SimpleSelect
          className={css(styles.limitSelect)}
          options={LIMIT_OPTIONS.map((v) => ({
            value: v.toString(),
            text: v === "ALL" ? i`All` : v.toString(),
          }))}
          onSelected={(item: string) => {
            setLimit(item === "ALL" ? item : parseInt(item));
            setOffset(0);
          }}
          selectedValue={limit.toString()}
        />
      </Layout.FlexRow>
      {isLoadingWeekStats ? (
        <LoadingIndicator />
      ) : (
        <Table className={css(styles.table)} data={tableData}>
          <Table.Column
            title={i`Date range`}
            columnKey="startDate"
            align="left"
          >
            {({ row: { startDate, endDate } }: { row: TableRow }) =>
              i`${startDate} to ${endDate}`
            }
          </Table.Column>

          <Table.Column
            title={() => (
              <Text className={css(styles.ldrColumnHeader)} weight="semibold">
                Wish Express Late Delivery Rate
              </Text>
            )}
            columnKey="weLateDeliveryRate"
            align="left"
            noDataMessage={renderNoData}
          >
            {({
              row: {
                weLateDeliveryRate,
                weIsLateDeliveryRateAtRisk,
                weIsLateDeliveryRateHigh,
              },
            }: {
              row: TableRow;
            }) => {
              const warningType = weIsLateDeliveryRateAtRisk
                ? "warningYellow"
                : weIsLateDeliveryRateHigh && "redX";
              const warningText = weIsLateDeliveryRateAtRisk
                ? i`Wish Express benefits are at risk of being revoked for this warehouse due to a ` +
                  i`high Wish Express Late Delivery Rate.`
                : weIsLateDeliveryRateHigh &&
                  i`Wish Express benefits have been revoked for this warehouse due to a high Wish ` +
                    i`Express Late Delivery Rate.`;
              return (
                weLateDeliveryRate != null && (
                  <Layout.GridRow
                    templateColumns="16px max-content"
                    gap={8}
                    alignItems="center"
                  >
                    {warningType && (
                      <Popover
                        position="top center"
                        popoverContent={() =>
                          warningText && (
                            <Text className={css(styles.popover)}>
                              {warningText}
                            </Text>
                          )
                        }
                      >
                        <Illustration
                          className={css(styles.ldrWarning)}
                          name={warningType}
                          alt=""
                        />
                      </Popover>
                    )}
                    <Text className={css(styles.ldr)}>
                      {_.round(weLateDeliveryRate * 100, 1)}%
                    </Text>
                  </Layout.GridRow>
                )
              );
            }}
          </Table.Column>

          <Table.Column
            title={() => (
              <Text className={css(styles.ldrColumnHeader)} weight="semibold">
                Late Delivery Rate
              </Text>
            )}
            columnKey="expectedDeliveries"
            align="left"
            noDataMessage={renderNoData}
          >
            {({
              row: {
                expectedDeliveries,
                lateDeliveries,
                isLateDeliveryRateHigh,
                isLateDeliveryRateAtRisk,
              },
            }: {
              row: TableRow;
            }) => {
              const warningType = isLateDeliveryRateAtRisk
                ? "warningYellow"
                : isLateDeliveryRateHigh && "redX";
              return (
                lateDeliveries != null &&
                expectedDeliveries != null && (
                  <Layout.GridRow
                    templateColumns="16px max-content"
                    gap={8}
                    alignItems="center"
                  >
                    {warningType && (
                      <Popover
                        position="top center"
                        popoverContent={() =>
                          isLateDeliveryRateHigh && (
                            <Text className={css(styles.popover)}>
                              Payment for late delivered orders are being
                              withheld.
                            </Text>
                          )
                        }
                      >
                        <Illustration
                          className={css(styles.ldrWarning)}
                          name={warningType}
                          alt=""
                        />
                      </Popover>
                    )}
                    <Text className={css(styles.ldr)}>
                      {_.round((lateDeliveries / expectedDeliveries) * 100, 1)}%
                    </Text>
                  </Layout.GridRow>
                )
              );
            }}
          </Table.Column>

          <Table.NumeralColumn
            title={i`Expected deliveries`}
            columnKey="expectedDeliveries"
            align="right"
            description={() => (
              <Layout.FlexColumn className={css(styles.popover)}>
                <Text className={css(styles.popoverTitle)} weight="semibold">
                  Expected deliveries
                </Text>
                <Text>
                  Based on merchant-set Maximum Delivery Days, orders that
                  should have been delivered within the given time range.
                </Text>
              </Layout.FlexColumn>
            )}
            noDataMessage="--"
          />

          <Table.NumeralColumn
            title={i`Late deliveries`}
            columnKey="lateDeliveries"
            align="right"
            description={() => (
              <Layout.FlexColumn className={css(styles.popover)}>
                <Text className={css(styles.popoverTitle)} weight="semibold">
                  Expected deliveries
                </Text>
                <Text>
                  Based on merchant-set Maximum Delivery Days, orders that
                  should have been delivered within the given time range.
                </Text>
              </Layout.FlexColumn>
            )}
            noDataMessage="--"
          />

          <Table.Column
            title={ci18n("GMV is Gross Merchandise Value", "Max expected GMV")}
            columnKey="maxExpectedGmv"
            align="right"
            noDataMessage="--"
          />
        </Table>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(WarehousePastTable);

const useStylesheet = () => {
  const { textDark, pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
          padding: 16,
        },
        paginationContainer: {
          height: 40,
          marginBottom: 16,
        },
        pageIndicator: {
          margin: "0 12px",
          height: 40,
        },
        limitSelect: {
          height: "100%",
          width: 50,
          flex: 0,
        },
        table: {
          width: "100%",
        },
        ldrNoData: {
          marginLeft: 24,
        },
        ldrWarning: {
          gridColumn: 1,
          width: 16,
        },
        ldr: {
          gridColumn: 2,
        },
        ldrColumnHeader: {
          color: textBlack,
          fontSize: 15,
          lineHeight: "20px",
          marginLeft: 24,
        },
        popover: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          padding: 16,
          maxWidth: 200,
        },
        popoverTitle: {
          marginBottom: 4,
        },
      }),
    [textDark, pageBackground, textBlack],
  );
};
