import React, { useMemo } from "react";
import { Table, Title, Icon } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import { CustomerServiceProductBreakdownBenchMark } from "@performance/toolkit/csProductBreakdown";
import commonStyles from "@performance/styles/common.module.css";
import { useTheme } from "@core/stores/ThemeStore";
import { ThemedLabel } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";

const ProductBreakdownBenchMarksData: ReadonlyArray<CustomerServiceProductBreakdownBenchMark> =
  [
    {
      benchmark: i`Unacceptable`,
      refundRatio30d: i`> 8%`,
      refundRatio93d: i`> 8%`,
    },
    {
      benchmark: i`Warning`,
      refundRatio30d: i`> 10%`,
      refundRatio93d: i`> 10%`,
    },
  ];

const ProductBreakdownBenchMarksModel: React.FC = () => {
  const { textBlack } = useTheme();
  const columns = useMemo(() => {
    const columns: ReadonlyArray<
      TableColumn<CustomerServiceProductBreakdownBenchMark>
    > = [
      {
        key: "benchmark",
        align: "left",
        titleRender: () => <span>Benchmark</span>,
        render: ({ row: { benchmark }, index }) => (
          <ThemedLabel
            theme={index === 0 ? "Yellow" : "Red"}
            className={commonStyles.benchMark}
          >
            {benchmark}
          </ThemedLabel>
        ),
      },
      {
        key: "refundRatio30d",
        titleRender: () => (
          <>
            <span>Refund Ratio 30 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders refunded divided by the number of orders made
                  0 to 30 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { refundRatio30d }, index }) => (
          <ThemedLabel
            theme={index === 0 ? "Yellow" : "Red"}
            className={commonStyles.themedLabel}
          >
            {refundRatio30d}
          </ThemedLabel>
        ),
      },

      {
        key: "refundRatio93d",
        titleRender: () => (
          <>
            <span>Refund Ratio 93 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders refunded divided by the number of orders made
                  63 to 93 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { refundRatio93d }, index }) => (
          <ThemedLabel
            theme={index === 0 ? "Yellow" : "Red"}
            className={commonStyles.themedLabel}
          >
            {refundRatio93d}
          </ThemedLabel>
        ),
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <>
      <Title className={commonStyles.title}>
        Wish Customer Service Performance Benchmarks
      </Title>
      <Table
        data={ProductBreakdownBenchMarksData}
        columns={columns}
        width={500}
      />
    </>
  );
};

export default ProductBreakdownBenchMarksModel;
