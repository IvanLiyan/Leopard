import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { Pager } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Relative Imports */
import AccountBalanceTable from "./AccountBalanceTable";
import AccountBalancePaymentMessage from "./AccountBalancePaymentMessage";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { AccountBalances, Enum } from "@merchant/api/account-balance";
import { Option } from "@ContextLogic/lego";
import { PaymentMessageProps } from "./AccountBalancePaymentMessage";
import EarlyPaymentMarketingBanner from "@merchant/component/payments/early-payment/EarlyPaymentMarketingBanner";
import { ReactNode } from "react";
import { AccountBalanceInitialData } from "@toolkit/account-balance";

type Props = PaymentMessageProps & {
  readonly account_balances: AccountBalances;
  readonly adminMode: boolean;
  readonly id_types: ReadonlyArray<Option<string>>;
  readonly line_item_type_enum: Enum;
  readonly fine_type_enum: Enum;
  readonly line_item_filter_types: ReadonlyArray<Option<number>>;
  readonly initialData: AccountBalanceInitialData;
};

const AccountBalancePager = (props: Props) => {
  const styles = useStyleSheet();
  const {
    account_balances: accountBalances,
    adminMode,
    id_types: idTypes,
    line_item_type_enum: lineItemTypeEnum,
    fine_type_enum: fineTypeEnum,
    line_item_filter_types: lineItemFilterTypes,
    can_request_for_funds: canRequestForFunds,
    suspended_and_no_holds: suspendedAndNoHolds,
    holds,
    infraction_id: infractionId,
    next_payment_date: nextPaymentDate,
    reauthentication_id: reauthenticationId,
    withhold_funds_permanently: withholdFundsPermanently,
    show_invalid_weekly_disb_psp: showInvalidWeeklyDisbPSP,
    initialData: {
      currentMerchant: { isMerchantPlus },
    },
  } = props;

  // if you find this please fix the any types (legacy)
  const renderCurrent = (balance: any) => {
    return (
      <div className={css(styles.content)}>
        <div className={css(styles.header)}>
          <span>Balance: {balance}</span>
          {holds && holds.length > 0 && (
            <Label
              className={css(styles.withheldLabel)}
              text={i`Withheld`}
              textColor={colors.palettes.textColors.Ink}
              backgroundColor={colors.palettes.yellows.LightYellow}
            />
          )}
        </div>
        {!isMerchantPlus && <EarlyPaymentMarketingBanner />}
        <div className={css(styles.message)}>
          <AccountBalancePaymentMessage
            can_request_for_funds={canRequestForFunds}
            suspended_and_no_holds={suspendedAndNoHolds}
            holds={holds}
            infraction_id={infractionId}
            next_payment_date={nextPaymentDate}
            reauthentication_id={reauthenticationId}
            withhold_funds_permanently={withholdFundsPermanently}
            show_invalid_weekly_disb_psp={showInvalidWeeklyDisbPSP}
          />
        </div>
      </div>
    );
  };

  const renderPending = () => {
    return (
      <div className={css(styles.message)}>
        These transactions are not yet eligible for payment.
      </div>
    );
  };

  const renderTab = ({
    currency,
    confirmed,
    balance,
  }: {
    currency: string;
    confirmed: boolean;
    balance: string;
  }) => {
    const key = currency + "-" + balance;
    return (
      <Pager.Content
        key={key}
        tabKey={key}
        titleValue={i`${
          confirmed ? i`Current` : i`Pending`
        } Balance (${currency}): ${balance}`}
      >
        <div className={css(styles.balance)}>
          {confirmed ? renderCurrent(balance) : renderPending()}
          <AccountBalanceTable
            adminMode={adminMode}
            idTypes={idTypes}
            currency={currency}
            confirmed={confirmed}
            lineItemTypeEnum={lineItemTypeEnum}
            fineTypeEnum={fineTypeEnum}
            lineItemFilterTypes={lineItemFilterTypes}
          />
        </div>
      </Pager.Content>
    );
  };

  const tabs: ReactNode[] = [];
  const currencies: ReadonlyArray<string> = Object.keys(accountBalances);

  currencies.forEach((currency) => {
    const confirmedBalance = formatCurrency(
      Number(accountBalances[currency].CONFIRMED),
      currency
    );
    const pendingBalance = formatCurrency(
      Number(accountBalances[currency].PENDING),
      currency
    );

    tabs.push(
      renderTab({ currency, confirmed: true, balance: confirmedBalance })
    );
    tabs.push(
      renderTab({ currency, confirmed: false, balance: pendingBalance })
    );
  });

  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = AppStore.instance();
  return (
    <Pager tabAlignment="flex-start" tabsPadding={`0 ${pageX}`}>
      {tabs}
    </Pager>
  );
};

const useStyleSheet = () => {
  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = AppStore.instance();
  return React.useMemo(
    () =>
      StyleSheet.create({
        content: {
          marginTop: 20,
        },
        header: {
          marginTop: 15,
          fontWeight: fonts.weightBold,
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        message: {
          marginTop: 10,
        },
        balance: {
          padding: `0 ${pageX}`,
        },
        withheldLabel: {
          marginLeft: 10,
        },
        alert: {
          fontSize: 14,
        },
      }),
    [pageX]
  );
};

export default observer(AccountBalancePager);
