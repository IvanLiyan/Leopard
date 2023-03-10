import React, { useMemo } from "react";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { useQuery } from "@apollo/client";
import { ThemedLabel } from "@ContextLogic/lego";
import { formatPercentage, round } from "src/app/core/toolkit/stringUtils";
import { observer } from "mobx-react";
import BenchMarksModel from "@performance/components/rating/BenchMarksModel";
import { Table, Title, Icon } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import { LoadingIndicator } from "@ContextLogic/lego";
import { useExportCSV } from "@performance/toolkit/utils";
import {
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
  REQUEST_WEEKS,
} from "@performance/toolkit/enums";
import {
  RATING_PERFORMANCE_AGGREGATE_DATA_QUERY,
  PickedRatingAggregate,
  RatingAggregateResponseData,
  RatingAggregateArgs,
} from "@performance/toolkit/rating";
import commonStyles from "@performance/styles/common.module.css";
import { useTheme } from "@core/stores/ThemeStore";

const AggregateRating: React.FC = () => {
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const { data, loading } = useQuery<
    RatingAggregateResponseData,
    RatingAggregateArgs
  >(RATING_PERFORMANCE_AGGREGATE_DATA_QUERY, {
    variables: {
      weeks: REQUEST_WEEKS,
    },
  });

  const tableData: ReadonlyArray<PickedRatingAggregate> | undefined =
    useMemo(() => {
      return data?.currentMerchant?.storeStats?.weekly?.map(
        (week) => week.rating,
      );
    }, [data?.currentMerchant?.storeStats?.weekly]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<PickedRatingAggregate>> = [
      {
        key: "dateRange",
        align: "left",
        titleRender: () => <span>Date Range</span>,
        render: ({ row: { startDate, endDate } }) => (
          <div style={{ textAlign: "left" }}>
            {`${startDate.mmddyyyy}-${endDate.mmddyyyy}`}
          </div>
        ),
      },
      {
        key: "storeRatings",
        titleRender: () => (
          <>
            <span>Store Ratings</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The number of ratings your store received.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
      },
      {
        key: "averageStoreRating",
        titleRender: () => (
          <>
            <span>Average Store Rating</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The average of the store ratings received.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageStoreRating } }) =>
          averageStoreRating == null || averageStoreRating == 0 ? (
            "-"
          ) : averageStoreRating >= 4 ? (
            round(String(averageStoreRating), 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(averageStoreRating), 2)}
            </ThemedLabel>
          ),
      },

      {
        key: "lowStoreRatingPercentage",
        titleRender: () => (
          <>
            <span>Percentage of Low Store Ratings</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The percentage of store ratings received that are less than
                  three.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { lowStoreRatingPercentage } }) =>
          lowStoreRatingPercentage == null || lowStoreRatingPercentage == 0 ? (
            "-"
          ) : lowStoreRatingPercentage > 0 &&
            lowStoreRatingPercentage <= 0.15 ? (
            formatPercentage(String(lowStoreRatingPercentage), "1", 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(lowStoreRatingPercentage), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "productRatings",
        titleRender: () => (
          <>
            <span>Product Ratings</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The number of product ratings received.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
      },
      {
        key: "averageProductRating",
        titleRender: () => (
          <>
            <span>Average Product Rating</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The average of the product ratings received.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageProductRating } }) =>
          averageProductRating == null || averageProductRating == 0 ? (
            "-"
          ) : averageProductRating >= 3 ? (
            round(String(averageProductRating), 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(averageProductRating), 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "lowProductRatingPercentage",
        titleRender: () => (
          <>
            <span>Percentage of Low Product Ratings</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The percentage of product ratings received that are less than
                  three.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { lowProductRatingPercentage } }) =>
          lowProductRatingPercentage == null ||
          lowProductRatingPercentage == 0 ? (
            "-"
          ) : lowProductRatingPercentage > 0 &&
            lowProductRatingPercentage <= 0.15 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(lowProductRatingPercentage), "1", 2)}
            </ThemedLabel>
          ) : (
            formatPercentage(String(lowProductRatingPercentage), "1", 2)
          ),
      },
      {
        key: "average30dStoreRating",
        titleRender: () => (
          <>
            <span>Average 30-Day Rating</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  The average of your store ratings for the past 30 days ending
                  on the time period shown.
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { average30dStoreRating } }) =>
          average30dStoreRating == null ? (
            "-"
          ) : average30dStoreRating >= 4 ? (
            round(String(average30dStoreRating), 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(average30dStoreRating), 2)}
            </ThemedLabel>
          ),
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <>
      <BenchMarksModel />
      <div className={commonStyles.toolkit}>
        <Title className={commonStyles.title} style={{ padding: 0 }}>
          Your Metrics
        </Title>
        {tableData && tableData.length > 0 && (
          <Button
            secondary
            onClick={() =>
              exportCSV({
                type: EXPORT_CSV_TYPE.MERCHANT,
                stats_type: EXPORT_CSV_STATS_TYPE.RATING,
                target_date:
                  new Date(
                    tableData[tableData.length - 1].startDate.mmddyyyy,
                  ).getTime() / 1000,
              })
            }
          >
            Export CSV
          </Button>
        )}
      </div>
      {loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : tableData ? (
        <Table data={tableData} columns={columns} />
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default observer(AggregateRating);
