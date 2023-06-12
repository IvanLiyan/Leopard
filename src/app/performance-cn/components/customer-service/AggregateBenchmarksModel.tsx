import React, { useMemo } from "react";
import { Table, Title, Icon } from "src/app/performance-cn/components";
import { TableColumn } from "src/app/performance-cn/components/Table";
import { CustomerServiceAggregateBenchMark } from "src/app/performance-cn/toolkit/cs";
import commonStyles from "@performance-cn/styles/common.module.css";
import { useTheme } from "@core/stores/ThemeStore";
import { ThemedLabel } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";

const AggregateBenchMarksData: ReadonlyArray<CustomerServiceAggregateBenchMark> =
  [
    {
      benchmark: i`Unacceptable`,
      refundRatio30d: i`> 8%`,
      refundRatio93d: i`> 8%`,
      chargebackRatio: "-",
      chargebackAmountRatio: "-",
      ticketRatio: "-",
      lateResponseRate30d: "-",
      customerSatisfaction: "-",
    },
    {
      benchmark: i`Warning`,
      refundRatio30d: i`> 10%`,
      refundRatio93d: i`> 10%`,
      chargebackRatio: i`> 0.5%`,
      chargebackAmountRatio: i`> 0.5%`,
      ticketRatio: i`> 30%`,
      lateResponseRate30d: i`> 15%`,
      customerSatisfaction: i`< 80%`,
    },
  ];

const AggregateBenchMarksModel: React.FC = () => {
  const { textBlack } = useTheme();
  const columns = useMemo(() => {
    const columns: ReadonlyArray<
      TableColumn<CustomerServiceAggregateBenchMark>
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

      {
        key: "chargebackRatio",
        titleRender: () => (
          <>
            <span>Chargeback Ratio</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of chargebacks divided by number of orders
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { chargebackRatio }, index }) =>
          index === 0 ? (
            <div>-</div>
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {chargebackRatio}
            </ThemedLabel>
          ),
      },

      {
        key: "chargebackAmountRatio",
        titleRender: () => (
          <>
            <span>Chargeback Amount Ratio</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Chargeback amount divided by GMV
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { chargebackAmountRatio }, index }) =>
          index === 0 ? (
            <div>-</div>
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {chargebackAmountRatio}
            </ThemedLabel>
          ),
      },
      {
        key: "ticketRatio",
        titleRender: () => (
          <>
            <span>Ticket Ratio</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of tickets divided by total number of orders
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { ticketRatio }, index }) =>
          index === 0 ? (
            <div>-</div>
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {ticketRatio}
            </ThemedLabel>
          ),
      },
      {
        key: "lateResponseRate30d",
        titleRender: () => (
          <>
            <span>Late Response Rate (30 day)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Late response rate is the percentage of tickets you responded
                  to after 48 hours
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { lateResponseRate30d }, index }) =>
          index === 0 ? (
            <div>-</div>
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {lateResponseRate30d}
            </ThemedLabel>
          ),
      },

      {
        key: "customerSatisfaction",
        titleRender: () => (
          <>
            <span>Customer Satisfaction</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of ticket responses rated helpful divided by the total
                  number of ticket responses rated by customers
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { customerSatisfaction }, index }) =>
          index === 0 ? (
            <div>-</div>
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {customerSatisfaction}
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
      <Table data={AggregateBenchMarksData} columns={columns} width={1200} />
    </>
  );
};

export default AggregateBenchMarksModel;
