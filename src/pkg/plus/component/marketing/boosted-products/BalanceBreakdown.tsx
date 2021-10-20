import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H5, Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { BoostedProductsMerchantSpending } from "@toolkit/marketing/boosted-products";

type Props = BaseProps & {
  readonly spending: BoostedProductsMerchantSpending;
  readonly isFreeBudgetMerchant: boolean;
};

const BalanceBreakdown: React.FC<Props> = (props: Props) => {
  const { className, style, spending, isFreeBudgetMerchant } = props;

  const styles = useStylesheet();

  const Field = ({
    name,
    description,
    children,
  }: {
    readonly name: string;
    readonly description?: string;
    readonly children: React.ReactNode;
  }) => {
    return (
      <div className={css(styles.row)}>
        <div className={css(styles.fieldNameContainer)}>
          <span>{name}</span>
          {description !== undefined && (
            <Info className={css(styles.description)} text={description} />
          )}
        </div>

        <span>{children}</span>
      </div>
    );
  };

  if (isFreeBudgetMerchant) {
    return (
      <div className={css(styles.root, className, style)}>
        <Field
          name={i`Free marketing budget`}
          description={spending.promotionLoanDescription}
        >
          {spending.promotionLoan.display}
        </Field>
        <Field
          name={i`Used budget`}
          description={i`Marketing budget budget has been used by current boosted products`}
        >
          {spending.pending.display}
        </Field>
      </div>
    );
  }

  return (
    <div className={css(styles.root, className, style)}>
      <Field name={i`Account balance`}>{spending.accountBalance.display}</Field>

      <Field
        name={i`Promotional loan`}
        description={spending.promotionLoanDescription}
      >
        {spending.promotionLoan.display}
      </Field>

      <Field
        name={i`Promotional balance`}
        description={i`The available promotional balance you deposited through payments.`}
      >
        {spending.promotionBalance.display}
      </Field>

      <Field
        name={i`Promotional credit`}
        description={i`Promotional credits are free credits from Wish to boost your products.`}
      >
        {spending.promotionCredit.display}
      </Field>

      <Field
        name={i`Pending`}
        description={i`Pending amounts to be deducted for newly or actively boosted products.`}
      >
        {spending.pending.display}
      </Field>

      <div className={css(styles.totalBorder)} />

      <Field name={i`Budget available`}>
        <H5>{spending.budgetAvailable.display}</H5>
      </Field>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        row: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "7px 0px",
          color: textDark,
        },
        totalBorder: {
          border: `1px dashed ${borderPrimaryDark}`,
          margin: "5px 0px",
        },
        fieldNameContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        description: {
          marginLeft: 5,
        },
      }),
    [textDark, borderPrimaryDark],
  );
};

export default observer(BalanceBreakdown);
