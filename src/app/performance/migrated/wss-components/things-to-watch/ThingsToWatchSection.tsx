import { CellInfo, Layout, Markdown, Table, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Icon, { IconProps } from "@core/components/Icon";
import WssSection from "@performance/migrated/wss-components/WssSection";
import { WssThingsToWatch } from "@schema";
import {
  useNoOpportunityMessage,
  WssMetricTrendNumber as WssMetricTrendValue,
  WSSMetricTypeMapping,
  WSSMetricTypeScoreDataMap,
  WSSMetricTypeSign,
  WSSThingsToWatchQuery,
  WSSThingsToWatchQueryResponse,
} from "@performance/migrated/toolkit/overview";
import { PickedMerchantWssDetails } from "@performance/migrated/toolkit/stats";
import { useTrendIcon } from "@performance/migrated/toolkit/themes";
import { useTheme } from "@core/stores/ThemeStore";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Skeleton from "@core/components/Skeleton";
import Link from "@deprecated/components/Link";

type Props = BaseProps & {
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

type TableData = {
  readonly name: string;
  readonly type: string;
  readonly href: string;
  readonly today: string | null;
  readonly goal: string | null;
  readonly trend: Pick<IconProps, "color" | "name">;
};

const ThingsToWatchSection: React.FC<Props> = ({
  className,
  style,
  ...rest
}) => {
  return (
    <WssSection
      style={[className, style]}
      title={ci18n(
        "Title of card that displays the top 3 metrics to be improved",
        "Things to Watch",
      )}
    >
      <ThingsToWatchSectionBody {...rest} />
    </WssSection>
  );
};

const ThingsToWatchSectionBody: React.FC<{
  readonly wssDetails?: PickedMerchantWssDetails | null;
}> = ({ wssDetails }) => {
  const styles = useStylesheet();
  const trendIcon = useTrendIcon();
  const noDataMessage = useNoOpportunityMessage(wssDetails);

  const { data, loading } = useQuery<WSSThingsToWatchQueryResponse, never>(
    WSSThingsToWatchQuery,
    { fetchPolicy: "no-cache" },
  );

  const getRow = (
    o: Pick<WssThingsToWatch, "metricTrend" | "metricType" | "metricValue">,
  ): TableData | null => {
    if (o.metricType == null) {
      return null;
    }
    if (
      o.metricType === "AVERAGE_USER_RATING" ||
      o.metricType === "LOGISTICS_REFUND" ||
      o.metricType === "ORDER_FULFILLMENT_RATE" ||
      o.metricType === "ORDER_FULFILLMENT_SPEED" ||
      o.metricType === "PRODUCT_QUALITY_REFUND" ||
      o.metricType === "VALID_TRACKING_RATE" ||
      o.metricType === "BAD_PRODUCT_RATE"
    ) {
      const todayScoreData = WSSMetricTypeScoreDataMap[o.metricType](
        wssDetails?.stats,
      );
      const lastUpdateScoreData = WSSMetricTypeScoreDataMap[o.metricType](
        wssDetails?.monthlyUpdateStats,
      );
      return {
        name: WSSMetricTypeMapping[o.metricType].name,
        type: WSSMetricTypeMapping[o.metricType].type,
        href: WSSMetricTypeMapping[o.metricType].href,
        today: todayScoreData.currentScoreDisplay,
        goal: lastUpdateScoreData.goalScoreDisplay,
        trend: trendIcon(
          WssMetricTrendValue[o.metricTrend ?? "UNSPECIFIED"] *
            WSSMetricTypeSign[o.metricType],
        ),
      };
    }
    return {
      name: WSSMetricTypeMapping[o.metricType].name,
      type: WSSMetricTypeMapping[o.metricType].type,
      href: WSSMetricTypeMapping[o.metricType].href,
      today: o.metricValue != null ? numeral(o.metricValue).format("0") : "-",
      goal: "0",
      trend: trendIcon(
        WssMetricTrendValue[o.metricTrend ?? "UNSPECIFIED"] *
          WSSMetricTypeSign[o.metricType],
      ),
    };
  };

  const tableData =
    data?.currentMerchant?.wishSellerStandard?.thingsToWatchBoard?.dataSlice
      ?.reduce<TableData[]>((prev, o) => {
        const row = getRow(o);
        return [...prev, ...(row == null ? [] : [row])];
      }, [])
      .slice(0, 3);

  if (loading) {
    return <Skeleton height="100%" width="50vw" />;
  }

  return (
    <>
      {!tableData?.length && noDataMessage ? (
        <Layout.FlexColumn justifyContent="center" style={styles.card}>
          <Markdown style={{ textAlign: "center" }} text={noDataMessage} />
        </Layout.FlexColumn>
      ) : (
        <Layout.FlexColumn justifyContent="flex-start" style={styles.card}>
          <Table
            data={tableData}
            hideBorder
            hideHeaderRowBackground
            rowDataCy={(row: TableData) => `opportunity-row-${row.name}`}
          >
            <Table.Column
              title={null}
              columnKey="name"
              _key="rank"
              columnDataCy={"rank-column"}
            >
              {({ index }: CellInfo<React.ReactNode, TableData>) => (
                <Text>{index + 1}</Text>
              )}
            </Table.Column>
            <Table.Column
              title={ci18n(
                "Column title, means an opportunity to improve the specified metric/infraction",
                "Opportunities",
              )}
              description={
                i`Prioritizing and addressing these performance metrics and/or infractions ` +
                i`will have the highest impact in improving your Wish Standards tier`
              }
              columnKey="name"
              _key="name"
              handleEmptyRow
              columnDataCy={"opportunity-name-column"}
            >
              {({ row }: CellInfo<React.ReactNode, TableData>) =>
                row.type === "Performance metrics" ? (
                  <Link openInNewTab href={row.href}>
                    <Text
                      style={{ fontFamily: "Ginto-Medium" }}
                    >{i`${row.name}`}</Text>
                  </Link>
                ) : (
                  <Markdown
                    openLinksInNewTab
                    text={i`[${row.name}](${row.href})`}
                  />
                )
              }
            </Table.Column>
            <Table.Column
              title={ci18n(
                "Column title, means category of metrics/infraction",
                "Type",
              )}
              columnKey="type"
              _key="type"
              handleEmptyRow
              columnDataCy={"type-column"}
            />
            <Table.Column
              align={"right"}
              title={ci18n(
                "Column title, means the metric value/infraction count as of today",
                "Today",
              )}
              columnKey="today"
              _key="today"
              handleEmptyRow
              columnDataCy={"today-score-column"}
            >
              {({ row }: CellInfo<React.ReactNode, TableData>) => (
                <Text weight="semibold">{row.today}</Text>
              )}
            </Table.Column>
            <Table.Column
              align="right"
              title={ci18n(
                "Column title, means the desired value of a metric/infraction ",
                "Goal",
              )}
              description={i`Improve your performance towards these goal metrics`}
              columnKey="goal"
              _key="goal"
              handleEmptyRow
              columnDataCy={"goal-score-column"}
            >
              {({ row }: CellInfo<React.ReactNode, TableData>) => (
                <Text weight="semibold">{row.goal}</Text>
              )}
            </Table.Column>
            <Table.Column
              align="center"
              title={ci18n(
                "Column title, means whether the metric/infraction is improving/worsening",
                "Trend",
              )}
              description={i`How this metric or infraction has trended compared to 30 days prior to today`}
              columnKey="trend"
              _key="trend"
              handleEmptyRow
              columnDataCy={"trend-column"}
            >
              {({ row }: CellInfo<React.ReactNode, TableData>) => (
                <Icon style={styles.icon} size={24} {...row.trend} />
              )}
            </Table.Column>
          </Table>
        </Layout.FlexColumn>
      )}
    </>
  );
};

export default observer(ThingsToWatchSection);

const useStylesheet = () => {
  const { borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexGrow: 1,
          padding: "12px 16px",
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          background: surfaceLightest,
        },
        icon: {
          margin: "0px 4px 0px 4px",
        },
        fontFamily: {
          fontFamily: `Ginto-Medium`,
        },
      }),
    [borderPrimary, surfaceLightest],
  );
};
