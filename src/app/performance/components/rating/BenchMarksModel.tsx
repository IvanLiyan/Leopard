import React, { useMemo } from "react";
import { Table, Title, Icon } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import { RatingAggregateBenchMark } from "@performance/toolkit/rating";
import commonStyles from "@performance/styles/common.module.css";
import { useTheme } from "@core/stores/ThemeStore";
import { ThemedLabel } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";

const benchMarksData: ReadonlyArray<RatingAggregateBenchMark> = [
  {
    benchmark: i`Warning`,
    averageStoreRating: `< 4.0`,
    lowStoreRatingPercentage: `> 15%`,
    averageProductRating: `< 3.0`,
    lowProductRatingPercentage: `> 15%`,
    average30dStoreRating: `< 4.0`,
  },
];

const BenchMarksModel: React.FC = () => {
  const { textBlack } = useTheme();
  const columns = useMemo(() => {
    const columns: ReadonlyArray<TableColumn<RatingAggregateBenchMark>> = [
      {
        key: "benchmark",
        titleRender: () => <span>Benchmark</span>,
        render: ({ row: { benchmark } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {benchmark}
          </ThemedLabel>
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
        render: ({ row: { averageStoreRating } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {averageStoreRating}
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
        render: ({ row: { lowStoreRatingPercentage } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {lowStoreRatingPercentage}
          </ThemedLabel>
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
        render: ({ row: { averageProductRating } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {averageProductRating}
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
        render: ({ row: { lowProductRatingPercentage } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {lowProductRatingPercentage}
          </ThemedLabel>
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
        render: ({ row: { average30dStoreRating } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {average30dStoreRating}
          </ThemedLabel>
        ),
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <>
      <Title className={commonStyles.title}>
        Wish Rating Performance Benchmarks
      </Title>
      <Table data={benchMarksData} columns={columns} />
    </>
  );
};

export default BenchMarksModel;
