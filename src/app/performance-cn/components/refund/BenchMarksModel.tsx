import React, { useMemo } from "react";
import { Table, Title, Icon } from "src/app/performance-cn/components";
import { TableColumn } from "src/app/performance-cn/components/Table";
import { RefundAggregateBenchMark } from "src/app/performance-cn/stores/Refund";
import commonStyles from "@performance-cn/styles/common.module.css";
import { useTheme } from "@core/stores/ThemeStore";
import { ThemedLabel } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";

const benchMarksData: ReadonlyArray<RefundAggregateBenchMark> = [
  {
    benchMark: i`Warning`,
    refundRate: 0.1,
  },
];

const BenchMarksModel: React.FC = () => {
  const { textBlack } = useTheme();
  const columns = useMemo(() => {
    const columns: ReadonlyArray<TableColumn<RefundAggregateBenchMark>> = [
      {
        title: i`Benchmark`,
        key: "benchMark",
        align: "left",
        render: ({ row: { benchMark } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.benchMark}>
            {benchMark}
          </ThemedLabel>
        ),
      },
      {
        key: "refundRate",
        titleRender: () => (
          <>
            <span>Refund Rate</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Percent of total transactions that were refunded
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: () => {
          return (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              <span>&gt; Over 10%</span>
            </ThemedLabel>
          );
        },
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <>
      <Title className={commonStyles.title}>
        Wish Merchant Refund Rate Benchmarks
      </Title>
      <Table data={benchMarksData} columns={columns} width={350} />
    </>
  );
};

export default BenchMarksModel;
