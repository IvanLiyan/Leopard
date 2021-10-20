import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Table, Layout, Text, Info } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { zendeskURL } from "@toolkit/url";
import { RevShareQualifier } from "@schema/types";
import RevShareQualifierLabel from "./RevShareQualifierLabel";

type RevShareTableProps = BaseProps & {
  readonly revShare: string | null | undefined;
  readonly qualifiers: ReadonlyArray<RevShareQualifier>;
  readonly revShareAdjustmentData: ReadonlyArray<{
    readonly date: string | null | undefined;
    readonly dispute_id: string | null | undefined;
    readonly oneoff_id: string | null | undefined;
    readonly prev_rev_share: string | null | undefined;
    readonly new_rev_share: string | null | undefined;
    readonly formatted_amount: string | null | undefined;
  }>;
};

const RevShareDetails: React.FC<RevShareTableProps> = (
  props: RevShareTableProps,
) => {
  const styles = useStylesheet();
  const { revShare, qualifiers, revShareAdjustmentData } = props;
  const revShareLearnMoreLink = zendeskURL("204531538");
  const revShareAdjustmentLearnMoreLink = zendeskURL("4403535077403");
  const renderRevShareAdjustmentTable = () => {
    if (!revShareAdjustmentData) {
      return null;
    }
    return (
      <>
        <Layout.FlexRow>
          <Text className={css(styles.tableTitle)} weight="semibold">
            Revenue share Adjustment
          </Text>
          <Info
            className={css(styles.tooltip)}
            size={16}
            position="right center"
            sentiment="info"
            popoverMaxWidth={250}
            popoverContent={
              i`If a Product Category Dispute results in a revenue share adjustment,` +
              i`the relevant payment information is included here. [Learn more]` +
              i`(${revShareAdjustmentLearnMoreLink}).`
            }
            openContentLinksInNewTab
          />
        </Layout.FlexRow>
        <Table
          className={css(styles.table)}
          data={revShareAdjustmentData}
          fixLayout
        >
          <Table.Column title={i`Date`} columnKey="date" />
          <Table.LinkColumn
            title={i`Dispute ID`}
            columnKey="dispute_id"
            href={({ row }) => `/product-category-dispute/${row.dispute_id}`}
            text={({ row }) => `${row.dispute_id}`}
            openInNewTab
          />
          <Table.LinkColumn
            title={i`Payment Details`}
            columnKey="oneoff_id"
            href={({ row }) => `/oneoff-payment-detail/${row.oneoff_id}`}
            text={({ row }) => `${row.oneoff_id}`}
            openInNewTab
          />
          <Table.Column
            title={i`Previous Revenue Share`}
            columnKey="prev_rev_share"
          />
          <Table.Column
            title={i`New Revenue Share`}
            columnKey="new_rev_share"
          />
          <Table.Column title={i`Adjustment`} columnKey="formatted_amount" />
        </Table>
      </>
    );
  };

  return (
    <div className={css(styles.container)}>
      <Text className={css(styles.sectionTitle)} weight="bold">
        Revenue Share
      </Text>
      <Card>
        <>
          <SheetItem
            title={i`Revenue share`}
            className={css(styles.fixedHeightSheetItem)}
            popoverContent={
              i`Revenue share percentage is calculated per order. [Learn more]` +
              i`(${revShareLearnMoreLink}).`
            }
          >
            {revShare}
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
        </>
        {renderRevShareAdjustmentTable()}
      </Card>
    </div>
  );
};

const RowHeight = 50;

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: 30,
        },
        sectionTitle: {
          fontSize: 18,
          marginTop: 20,
          marginBottom: 8,
        },
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
        qualifiersSheetItem: {
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
        tableTitle: {
          fontSize: 16,
          color: textBlack,
          height: 36,
          margin: "16px 0px 0px 10px",
        },
        tooltip: {
          margin: "4px 0px 0px 8px",
        },
        table: {
          margin: "0px 10px 10px 10px",
        },
      }),
    [borderPrimary, textBlack],
  );
};

export default observer(RevShareDetails);
