import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";

/* Merchant Store */
import { useUserStore } from "@stores/UserStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { MaxSpendingBreakdown } from "@merchant/model/product-boost/Campaign";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useProductBoostMerchantInfo } from "@merchant/stores/product-boost/ProductBoostContextStore";
import { useTheme } from "@stores/ThemeStore";

type BreakDownTableRowButton = {
  title: string;
  url: string;
};

type BreakDownTableRow = {
  key: string;
  description: string;
  toolTip?: string;
  amount: string;
  color: string;
  button?: BreakDownTableRowButton;
};

type TableData = {
  readonly key: string;
  readonly description: string;
  readonly toolTip?: string;
  readonly amount: string;
  readonly color: string;
  readonly button?: {
    readonly title: string;
    readonly url: string;
  };
};

type BudgetBreakDownTableProps = BaseProps & {
  readonly maxAllowedSpending: number;
  readonly maxSpendingBreakdown: MaxSpendingBreakdown;
  readonly isPayable: boolean | null | undefined;
  readonly headerSize?: number;
  readonly fontSize?: number;
  readonly expended: boolean;
  readonly campaignBudget?: number;
  readonly discount?: number;
  readonly hideInfoButton?: boolean;
  readonly dailyBudgetEnabled?: boolean;
};

const BudgetBreakDownTable = (props: BudgetBreakDownTableProps) => {
  const styles = useStyleSheet();
  const [expanded, setExpanded] = useState(true);
  const {
    className,
    maxSpendingBreakdown,
    maxAllowedSpending,
    isPayable,
    campaignBudget,
    discount,
    dailyBudgetEnabled,
    headerSize,
    hideInfoButton,
  } = props;
  const { currency } = maxSpendingBreakdown;
  const results = useProductBoostMerchantInfo();

  const { loggedInMerchantUser } = useUserStore();
  const { positive, negative, textDark, textBlack } = useTheme();

  if (results == null) {
    return null;
  }

  const showCredits = results.marketing.currentMerchant.showCredits;
  const breakdown = maxSpendingBreakdown;

  const isSubUser = loggedInMerchantUser.is_sub_user;
  const productBoostCredit = breakdown.product_boost_credit;
  const discountAmount =
    campaignBudget && discount ? campaignBudget * discount : 0;
  const displayMaxAllowedSpending =
    discount && campaignBudget
      ? Math.max(maxAllowedSpending + discountAmount - campaignBudget, 0)
      : maxAllowedSpending;

  const formatAmount = (val: number) => {
    const sign = val > 0 ? "+" : "-";
    return `${sign} ${formatCurrency(
      Math.abs(val),
      maxSpendingBreakdown.currency,
    )}`;
  };

  const getValueColor = (val: number, color?: string | null | undefined) => {
    if (val === null || Math.abs(val) < 0.01) {
      return textDark;
    }
    if (color) {
      return color;
    }
    return val > 0 ? positive : negative;
  };

  const renderDescription = (row: BreakDownTableRow) => {
    return (
      <span
        className={css(
          styles.descriptionStyle,
          row.key === "maxAllowedSpending" ? styles.summaryStyle : null,
        )}
      >
        {row.description}
      </span>
    );
  };

  const renderToolTip = (row: BreakDownTableRow) => {
    if (!row.toolTip) {
      return null;
    }
    return (
      <Info
        className={css(styles.info)}
        text={row.toolTip}
        position={"bottom center"}
        popoverFontSize={12}
        popoverMaxWidth={300}
      />
    );
  };

  const renderAmount = (row: BreakDownTableRow) => {
    return (
      <span
        className={css(
          styles.amountStyle,
          row.key === "maxAllowedSpending" ? styles.summaryStyle : null,
        )}
        style={
          row.key === "maxAllowedSpending" ? undefined : { color: row.color }
        }
      >
        {row.amount}
      </span>
    );
  };

  const renderLink = (row: BreakDownTableRow) => {
    if (!row.button) {
      return null;
    }
    const linkButton: BreakDownTableRowButton = row.button;
    return (
      <Link className={css(styles.button)} openInNewTab href={linkButton.url}>
        {linkButton.title}
      </Link>
    );
  };

  const data: TableData[] = [
    ...(isPayable
      ? [
          {
            key: "balance",
            description: i`Total Balance on Wish`,
            toolTip:
              i`Merchant's current account balance. ` +
              i`Amount merchant will be paid on their next payment cycle.`,
            amount: formatAmount(breakdown.balance),
            color: getValueColor(breakdown.balance),
          },
          {
            key: "bonus",
            description: i`Promotion Loan`,
            toolTip: i`${breakdown.bonus_reason_text}`,
            amount: formatAmount(breakdown.bonus),
            color: getValueColor(breakdown.bonus),
          },
        ]
      : []),
    ...(showCredits && productBoostCredit && productBoostCredit > 0
      ? [
          {
            key: "productBoostCredit",
            description: i`ProductBoost Credit`,
            toolTip: dailyBudgetEnabled
              ? i`Free credit given for ProductBoost promotions.`
              : i`Free credit given for ProductBoost campaigns.`,
            amount: formatAmount(productBoostCredit),
            color: getValueColor(productBoostCredit),
          },
        ]
      : []),
    {
      key: "productBoostBalance",
      description: i`ProductBoost Balance`,
      amount: formatAmount(breakdown.product_boost_balance),
      toolTip: i`Merchant's ProductBoost account balance.`,
      color: getValueColor(breakdown.product_boost_balance),
      button: isSubUser
        ? undefined
        : {
            title: i`Recharge`,
            url: "/buy-product-boost-credits",
          },
    },
    {
      key: "currentUnpaid",
      description: dailyBudgetEnabled
        ? i`Pending Promotion Amount`
        : i`Pending Campaign Amount`,
      amount: formatAmount(-breakdown.current_unpaid),
      toolTip: dailyBudgetEnabled
        ? i`Impression Fee for new and running promotions for the merchant.`
        : i`Enrollment Fee and Impression Fee for new ` +
          i`and running campaigns for the merchant.`,
      color: getValueColor(-breakdown.current_unpaid),
      button: {
        title: i`View details`,
        url: "/product-boost-holding-amounts",
      },
    },
    ...(campaignBudget
      ? [
          {
            key: "campaignBudget",
            description: i`Current Campaign Budget`,
            amount: formatAmount(-campaignBudget),
            toolTip: i`Maximum spend of the campaign.`,
            color: getValueColor(-campaignBudget),
          },
        ]
      : []),
    ...(campaignBudget && discount
      ? [
          {
            key: "discountAmount",
            description: i`Discount Amount`,
            amount: formatAmount(discountAmount),
            toolTip: i`Amount discounted from the current campaign budget.`,
            color: getValueColor(discountAmount),
          },
        ]
      : []),
    {
      key: "maxAllowedSpending",
      description: i`Maximum budget available`,
      amount: `= ${formatCurrency(displayMaxAllowedSpending, currency)}`,
      color: getValueColor(displayMaxAllowedSpending, textBlack),
    },
  ];

  return (
    <Accordion
      header={() => (
        <div className={css(styles.headerText)}>
          How is my maximum budget calculated?
        </div>
      )}
      onOpenToggled={() => {
        setExpanded(!expanded);
      }}
      isOpen={expanded}
      chevronSize={headerSize}
      hideLines
      centerHeader
      className={css(className)}
    >
      <div className={css(styles.root)}>
        <div className={css(styles.table)}>
          {data.map((row: BreakDownTableRow) => {
            return (
              <div
                key={row.key}
                className={css(
                  styles.rowContainer,
                  row.key === "maxAllowedSpending" ? styles.summaryRow : null,
                )}
              >
                <div className={css(styles.columnLeft)}>
                  {renderDescription(row)}
                  {!hideInfoButton && renderToolTip(row)}
                </div>
                <div className={css(styles.columnRight)}>
                  {renderAmount(row)}
                  {renderLink(row)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Accordion>
  );
};

const useStyleSheet = () => {
  const { textBlack, textDark, surfaceLight, borderPrimaryDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "block",
          backgroundColor: surfaceLight,
        },
        headerText: {
          fontWeight: fonts.weightNormal,
          color: textBlack,
          flex: 1,
          "@media (max-width: 900px)": {
            fontSize: 14,
          },
          "@media (min-width: 900px)": {
            fontSize: 16,
          },
        },
        table: {
          display: "block",
          padding: "24px 0px 24px 0px",
          backgroundColor: surfaceLight,
        },
        rowContainer: {
          display: "flex",
          margin: `0px 25px 16px 25px`,
          "@media (max-width: 900px)": {
            margin: `0px 25px 16px 25px`,
          },
          "@media (min-width: 900px)": {
            margin: `0px 40px 16px 40px`,
          },
        },
        descriptionStyle: {
          "@media (max-width: 900px)": {
            fontSize: 14,
          },
          "@media (min-width: 900px)": {
            fontSize: 16,
          },
          fontWeight: fonts.weightMedium,
          color: textDark,
        },
        summaryStyle: {
          fontWeight: fonts.weightSemibold,
          color: textBlack,
          paddingTop: 16,
        },
        summaryRow: {
          display: "flex",
          borderTop: `1px solid ${borderPrimaryDark}`,
          alignItems: "flex-end",
        },
        summaryColumnStyle: {
          marginTop: 16,
          paddingTop: 16,
        },
        amountStyle: {
          "@media (max-width: 900px)": {
            fontSize: 14,
          },
          "@media (min-width: 900px)": {
            fontSize: 16,
          },
          fontWeight: fonts.weightSemibold,
          marginRight: 8,
        },
        columnLeft: {
          lineHeight: 1.4,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          "@media (max-width: 900px)": {
            flex: 0.72,
          },
          "@media (min-width: 900px)": {
            flex: 0.4,
          },
        },
        columnRight: {
          lineHeight: 1.4,
          "@media (max-width: 900px)": {
            flex: 0.28,
            justifyContent: "flex-end",
          },
          "@media (min-width: 900px)": {
            flex: 0.6,
            justifyContent: "flex-start",
          },
          alignItems: "center",
          display: "flex",
        },
        button: {
          "@media (max-width: 900px)": {
            fontSize: 14,
          },
          "@media (min-width: 900px)": {
            fontSize: 16,
          },
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          overflow: "hidden",
        },
        info: {
          marginLeft: 4,
        },
      }),
    [textBlack, textDark, surfaceLight, borderPrimaryDark],
  );
};

export default observer(BudgetBreakDownTable);
