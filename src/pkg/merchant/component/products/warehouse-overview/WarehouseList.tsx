/*
 * WarehouseList.tsx
 *
 * Created by Jonah Dlin on Wed Feb 24 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import sortBy from "lodash/sortBy";
import round from "lodash/round";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Popover, Table, Text, Layout } from "@ContextLogic/lego";

/* Merchant Components */
import WarehousePastTable from "./WarehousePastTable";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { PickedWarehouseType } from "@toolkit/products/warehouse-overview";

type Props = BaseProps & {
  readonly warehouses: ReadonlyArray<PickedWarehouseType>;
};

type WarningBadgeType = "RED" | "YELLOW";

type TableData = {
  readonly id: string;
  readonly unitId: string;
  readonly topLevelWarning?: WarningBadgeType | false | null;
  readonly lateDeliveryRate?: number | null;
  readonly weLateDeliveryRate?: number | null;
  readonly warning?: WarningBadgeType | false | null;
  readonly weWarning?: WarningBadgeType | false | null;
  readonly maxExpectedGmv?: string;
};

const NO_DATA = "--";

const ILLUSTRATION_MAP: {
  readonly [warn in WarningBadgeType]: IllustrationName;
} = {
  RED: "redX",
  YELLOW: "warningYellow",
};

const WarehouseList: React.FC<Props> = ({
  className,
  style,
  warehouses,
}: Props) => {
  const styles = useStylesheet();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const expandedRowsArray = useMemo(
    () => Array.from(expandedRows),
    [expandedRows]
  );
  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    const newExpandedRows = new Set(expandedRows);
    shouldExpand ? newExpandedRows.add(index) : newExpandedRows.delete(index);
    setExpandedRows(newExpandedRows);
  };

  const renderExpandedRow = (tableData: TableData) => {
    const warehouse = warehouses.find(({ id }) => id == tableData.id);
    return warehouse && <WarehousePastTable warehouse={warehouse} />;
  };

  const weekRange: {
    start: moment.Moment;
    end: moment.Moment;
  } = useMemo(() => {
    const start = moment().utc().startOf("week").subtract(1, "weeks");
    const end = moment().utc().endOf("week").subtract(1, "weeks");
    return {
      start,
      end,
    };
  }, []);

  const tableData: ReadonlyArray<TableData> = useMemo(
    () =>
      sortBy(
        warehouses.map(({ id, unitId, weekStats }) => {
          if (weekStats.length == 0) {
            return {
              id,
              unitId,
            };
          }

          const [latestStats] = weekStats;

          const showWithheldWarning =
            weekStats[0].isLateDeliveryRateHigh ||
            weekStats.some((weekStat) => weekStat.weIsLateDeliveryRateHigh);
          const showRiskOfWithheldWarning =
            weekStats[0].isLateDeliveryRateAtRisk ||
            weekStats[0].weIsLateDeliveryRateAtRisk;

          const topLevelWarning = showWithheldWarning
            ? "RED"
            : showRiskOfWithheldWarning && "YELLOW";

          // + 1 for difference between moment unix and BE unix
          if (
            latestStats.startDate.unix !=
            moment(weekRange.start).add(1, "days").unix()
          ) {
            return {
              id,
              unitId,
              topLevelWarning,
            };
          }

          return {
            id,
            unitId,
            topLevelWarning,
            lateDeliveryRate: latestStats.lateDeliveryRate,
            weLateDeliveryRate: latestStats.weLateDeliveryRate,
            maxExpectedGmv: latestStats.maxExpectedGmv.display,
            warning: latestStats.isLateDeliveryRateHigh
              ? "RED"
              : latestStats.isLateDeliveryRateAtRisk && "YELLOW",
            weWarning: latestStats.weIsLateDeliveryRateHigh
              ? "RED"
              : latestStats.weIsLateDeliveryRateAtRisk && "YELLOW",
          };
        }),
        ({ lateDeliveryRate }) => -(lateDeliveryRate || 0)
      ),
    [weekRange, warehouses]
  );

  const { weekStart, weekEnd } = useMemo(
    () => ({
      weekStart: weekRange.start.format("M/D"),
      weekEnd: weekRange.end.format("M/D"),
    }),
    [weekRange]
  );

  return (
    <Table
      className={css(className, style)}
      data={tableData}
      rowExpands={() => true}
      expandedRows={expandedRowsArray}
      onRowExpandToggled={onRowExpandToggled}
      renderExpanded={renderExpandedRow}
      hideBorder
      hideHeaderRowBackground
    >
      <Table.Column
        _key={undefined}
        title={() => (
          <Text className={css(styles.columnHeader, styles.ldrColumnHeader)}>
            Warehouse
          </Text>
        )}
        columnKey="unitId"
        align="left"
        noDataMessage={i`Unnamed warehouse`}
      >
        {({ row: { unitId, topLevelWarning } }: { row: TableData }) => (
          <Layout.GridRow
            templateColumns="16px max-content"
            gap={8}
            alignItems="center"
          >
            {topLevelWarning && (
              <Illustration
                className={css(styles.ldrWarning)}
                name={ILLUSTRATION_MAP[topLevelWarning]}
                alt=""
              />
            )}
            <Text className={css(styles.ldr)}>{unitId}</Text>
          </Layout.GridRow>
        )}
      </Table.Column>

      <Table.Column
        _key={undefined}
        title={() => (
          <Text className={css(styles.columnHeader, styles.ldrColumnHeader)}>
            Previous Week's Wish Express Late Delivery Rate (Week of {weekStart}{" "}
            - {weekEnd})
          </Text>
        )}
        noDataMessage={() => (
          <Text className={css(styles.noLdrDataMessage)}>{NO_DATA}</Text>
        )}
        description={() => (
          <Layout.FlexColumn className={css(styles.popover)}>
            <Text className={css(styles.popoverTitle)} weight="semibold">
              Wish Express Late Delivery Rate
            </Text>
            <Text>
              The number of late delivered Wish Express orders divided by Wish
              Express orders that should have been delivered within the given
              time range (only applicable if there are at least 10 orders per
              week).
            </Text>
          </Layout.FlexColumn>
        )}
        columnKey="weLateDeliveryRate"
        align="left"
      >
        {({ row: { weLateDeliveryRate, weWarning } }: { row: TableData }) => {
          const warningTextMap: {
            readonly [warn in ExcludeStrict<
              typeof weWarning,
              false | undefined | null
            >]: string;
          } = {
            RED:
              i`Wish Express benefits have been revoked for this warehouse due to a high Wish ` +
              i`Express Late Delivery Rate.`,
            YELLOW:
              i`Wish Express benefits are at risk of being revoked for this warehouse due to a ` +
              i`high Wish Express Late Delivery Rate.`,
          };

          return (
            <Layout.GridRow
              templateColumns="16px max-content"
              gap={8}
              alignItems="center"
            >
              {weWarning && (
                <Popover
                  position="top center"
                  popoverContent={() => (
                    <Layout.FlexColumn className={css(styles.popover)}>
                      {warningTextMap[weWarning]}
                    </Layout.FlexColumn>
                  )}
                >
                  <Illustration
                    className={css(styles.ldrWarning)}
                    name={ILLUSTRATION_MAP[weWarning]}
                    alt=""
                  />
                </Popover>
              )}
              <Text className={css(styles.ldr)} weight="semibold">
                {weLateDeliveryRate == null
                  ? NO_DATA
                  : round(weLateDeliveryRate * 100, 1)}
                %
              </Text>
            </Layout.GridRow>
          );
        }}
      </Table.Column>

      <Table.Column
        _key={undefined}
        title={() => (
          <Text className={css(styles.columnHeader, styles.ldrColumnHeader)}>
            Previous Week's Late Delivery Rate (Week of {weekStart} - {weekEnd})
          </Text>
        )}
        noDataMessage={() => (
          <Text className={css(styles.noLdrDataMessage)}>{NO_DATA}</Text>
        )}
        description={() => (
          <Layout.FlexColumn className={css(styles.popover)}>
            <Text className={css(styles.popoverTitle)} weight="semibold">
              Late Delivery Rate
            </Text>
            <Text>
              The amount of late delivered orders divided by orders that should
              have been delivered (based on merchant-set Maximum Delivery Days)
              within the given time range.
            </Text>
          </Layout.FlexColumn>
        )}
        columnKey="lateDeliveryRate"
        align="left"
      >
        {({ row: { lateDeliveryRate, warning } }: { row: TableData }) => {
          const warningTextMap: {
            readonly [warn in ExcludeStrict<
              typeof warning,
              false | undefined | null
            >]: string;
          } = {
            RED: i`Payment for late delivered orders are being withheld.`,
            YELLOW: i`Payment for late delivered orders are at risk of being withheld.`,
          };

          return (
            <Layout.GridRow
              templateColumns="16px max-content"
              gap={8}
              alignItems="center"
            >
              {warning && (
                <Popover
                  position="top center"
                  popoverContent={() => (
                    <Layout.FlexColumn className={css(styles.popover)}>
                      {warningTextMap[warning]}
                    </Layout.FlexColumn>
                  )}
                >
                  <Illustration
                    className={css(styles.ldrWarning)}
                    name={ILLUSTRATION_MAP[warning]}
                    alt=""
                  />
                </Popover>
              )}
              <Text className={css(styles.ldr)} weight="semibold">
                {lateDeliveryRate == null
                  ? NO_DATA
                  : round(lateDeliveryRate * 100, 1)}
                %
              </Text>
            </Layout.GridRow>
          );
        }}
      </Table.Column>

      <Table.Column
        _key={undefined}
        title={() => (
          <Text className={css(styles.columnHeader)}>
            {ci18n(
              "GMV is Gross Merchandise Value. placeholders are dates",
              "Previous Week's Max Expected GMV (Week of %1$s - %2$s)",
              weekStart,
              weekEnd
            )}
          </Text>
        )}
        noDataMessage={NO_DATA}
        columnKey="maxExpectedGmv"
        align="left"
        description={() => (
          <Layout.FlexColumn className={css(styles.popover)}>
            <Text className={css(styles.popoverTitle)} weight="semibold">
              {ci18n("GMV is Gross Merchandise Value", "Max expected GMV")}
            </Text>
            <Text>
              Gross merchandise value of orders that should have been delivered
              (based on merchant-set Maximum Delivery Days) within the given
              time range.
            </Text>
          </Layout.FlexColumn>
        )}
      >
        {({ row: { maxExpectedGmv } }: { row: TableData }) => (
          <Text className={css(styles.text)}>{maxExpectedGmv || NO_DATA}</Text>
        )}
      </Table.Column>
    </Table>
  );
};

export default observer(WarehouseList);

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        columnHeader: {
          // Need to override Lego table header font weight
          // eslint-disable-next-line local-rules/no-hardcoded-fontweight
          fontWeight: "normal",
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        text: {
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
        },
        noLdrDataMessage: {
          marginLeft: 24,
        },
        ldrWarning: {
          gridColumn: 1,
          width: 16,
        },
        ldr: {
          gridColumn: 2,
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
        },
        ldrColumnHeader: {
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
    [textBlack, textDark]
  );
};
