import React, { useMemo } from "react";
import gql from "graphql-tag";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import {
  LoadingIndicator,
  Markdown,
  PageIndicator,
  Tip,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { useIntQueryParam } from "@toolkit/url";

/* Merchant Components */
import TransactionHistoryTable from "@merchant/component/product-boost/wallet/TransactionHistoryTable";

/* Merchant Model */
import {
  PBBalanceTransactionRecord,
  PBCreditTransactionRecord,
} from "@merchant/api/product-boost";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";
import { useUserStore } from "@stores/UserStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  MarketingServiceSchema,
  MarketingServiceSchemaBalanceTransactionsArgs,
  MarketingServiceSchemaCreditTransactionsArgs,
  Maybe,
} from "@schema/types";

const PageSize = 100;

const GET_CREDIT_TRANSACTION_RECORDS = gql`
  query TransactionHistory_GetCreditTransactionRecord(
    $offset: Int
    $limit: Int
  ) {
    marketing {
      creditTransactions(offset: $offset, limit: $limit) {
        id
        dateCreated {
          formatted(fmt: "%m/%d/%Y %H:%M:%S %Z")
        }
        updatedReason
        campaignId
        productId
        transactionAmount {
          display
        }
        expiredDate {
          formatted(fmt: "%m/%d/%Y %H:%M:%S")
        }
        updateReasonDescription
        receiptId
      }
      creditTransactionsCount
    }
  }
`;

type GetCreditTransactionRecordResponseType = {
  readonly marketing: Maybe<
    Pick<MarketingServiceSchema, "creditTransactionsCount"> & {
      readonly creditTransactions: ReadonlyArray<PBCreditTransactionRecord>;
    }
  >;
};

const GET_BALANCE_TRANSACTION_RECORDS = gql`
  query TransactionHistory_GetBalanceTransactionRecord(
    $offset: Int
    $limit: Int
  ) {
    marketing {
      balanceTransactions(offset: $offset, limit: $limit) {
        id
        dateCreated {
          formatted(fmt: "%m/%d/%Y %H:%M:%S %Z")
        }
        campaignId
        productId
        transactionAmount {
          display
        }
        updatedReason
        updateReasonDescription
        receiptId
      }
      balanceTransactionsCount
    }
  }
`;

type GetBalanceTransactionRecordResponseType = {
  readonly marketing: Maybe<
    Pick<MarketingServiceSchema, "balanceTransactionsCount"> & {
      readonly balanceTransactions: ReadonlyArray<PBBalanceTransactionRecord>;
    }
  >;
};

type TransactionHistoryProps = BaseProps & {
  readonly currentTabKey: string;
  readonly dailyBudgetEnabled: boolean;
};

const TransactionHistory = (props: TransactionHistoryProps) => {
  const styles = useStyleSheet();
  const { currentTabKey, dailyBudgetEnabled, className } = props;

  const { primary } = useTheme();
  const {
    loggedInMerchantUser: { is_sub_user: isSubUser },
  } = useUserStore();

  const [creditOffset, setCreditOffset] = useIntQueryParam("creditOffset");
  const currentCreditOffset = creditOffset || 0;
  const [balanceOffset, setBalanceOffset] = useIntQueryParam("balanceOffset");
  const currentBalanceOffset = balanceOffset || 0;
  const faqLink = zendeskURL("360006299174");

  // get PB balance transaction records
  const { data: balanceRecordData, loading: balanceRecordLoading } = useQuery<
    GetBalanceTransactionRecordResponseType,
    MarketingServiceSchemaBalanceTransactionsArgs
  >(GET_BALANCE_TRANSACTION_RECORDS, {
    variables: {
      limit: PageSize,
      offset: currentBalanceOffset,
    },
    skip: currentTabKey !== "BALANCE",
  });

  // get PB credit transaction records
  const { data: creditRecordData, loading: creditRecordLoading } = useQuery<
    GetCreditTransactionRecordResponseType,
    MarketingServiceSchemaCreditTransactionsArgs
  >(GET_CREDIT_TRANSACTION_RECORDS, {
    variables: {
      limit: PageSize,
      offset: currentCreditOffset,
    },
    skip: currentTabKey !== "CREDIT",
  });

  if (
    (currentTabKey === "CREDIT" && creditRecordLoading) ||
    (currentTabKey === "BALANCE" && balanceRecordLoading)
  ) {
    return <LoadingIndicator />;
  }

  const creditTotalCount =
    creditRecordData?.marketing?.creditTransactionsCount || 0;
  const balanceTotalCount =
    balanceRecordData?.marketing?.balanceTransactionsCount || 0;

  const currentCreditEnd = Math.min(
    creditTotalCount,
    currentCreditOffset + PageSize,
  );

  const currentBalanceEnd = Math.min(
    balanceTotalCount,
    currentBalanceOffset + PageSize,
  );

  const tipContent = !isSubUser && (
    <Tip className={css(styles.rechargeBalanceTip)} color={primary} icon="tip">
      <div className={css(styles.rechargeBalanceTip)}>
        <Markdown
          className={css(styles.rechargeBalanceTipText)}
          openLinksInNewTab
          text={
            dailyBudgetEnabled
              ? i`To maintain a positive balance and increase your budget ` +
                i`on promotions, you can recharge your balance.`
              : i`To maintain a positive balance and increase your ` +
                i`budget on campaigns, you can recharge your ` +
                i`balance. [Learn More](${faqLink})`
          }
        />
      </div>
    </Tip>
  );

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.topControls)}>
        {tipContent}
        <div className={css(styles.searchContainer)}>
          <div className={css(styles.title)}>History</div>
        </div>
        <div className={css(styles.buttons)}>
          <PageIndicator
            className={css(styles.pageIndicator)}
            totalItems={
              currentTabKey === "BALANCE" ? balanceTotalCount : creditTotalCount
            }
            rangeStart={
              currentTabKey === "BALANCE"
                ? currentBalanceOffset + 1
                : currentCreditOffset + 1
            }
            rangeEnd={
              currentTabKey === "BALANCE" ? currentBalanceEnd : currentCreditEnd
            }
            hasNext={
              currentTabKey === "BALANCE"
                ? balanceTotalCount > currentBalanceOffset + PageSize
                : creditTotalCount > currentCreditOffset + PageSize
            }
            hasPrev={
              currentTabKey === "BALANCE"
                ? currentBalanceOffset >= PageSize
                : currentCreditOffset >= PageSize
            }
            currentPage={
              currentTabKey === "BALANCE"
                ? currentBalanceOffset / PageSize
                : currentCreditOffset / PageSize
            }
            onPageChange={(nextPage) => {
              nextPage = Math.max(0, nextPage);
              if (currentTabKey === "BALANCE") {
                setBalanceOffset(nextPage * PageSize);
              } else {
                setCreditOffset(nextPage * PageSize);
              }
            }}
          />
        </div>
      </div>
      <TransactionHistoryTable
        currentTabKey={currentTabKey}
        data={
          currentTabKey === "BALANCE"
            ? balanceRecordData?.marketing?.balanceTransactions || []
            : creditRecordData?.marketing?.creditTransactions || []
        }
        dailyBudgetEnabled={dailyBudgetEnabled}
      />
    </div>
  );
};

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        topControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          marginTop: 25,
          ":nth-child(1n) > *": {
            height: 30,
            margin: "0px 0px 25px 0px",
          },
        },
        searchContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        title: {
          fontSize: 22,
          fontWeight: fonts.weightMedium,
          lineHeight: 1.33,
          color: textBlack,
          marginRight: 25,
          userSelect: "none",
          alignSelf: "center",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        buttons: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        rechargeBalanceTipText: {
          fontSize: 14,
          color: textBlack,
        },
        rechargeBalanceTip: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        },
        faqLink: {
          marginLeft: 10,
        },
      }),
    [textBlack],
  );
};

export default observer(TransactionHistory);
