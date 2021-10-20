import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import TransactionHistory from "@merchant/component/product-boost/wallet/TransactionHistory";

/* Merchant Plus Component */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";

/* Types */
import { CurrencyValue, MarketingMerchantPropertySchema } from "@schema/types";

export const BalanceHistoryKey = "BALANCE";
export const CreditHistoryKey = "CREDIT";

type InitialData = {
  readonly marketing: {
    readonly currentMerchant: Pick<
      MarketingMerchantPropertySchema,
      "showCredits" | "dailyBudgetEnabled"
    > & {
      readonly spending: {
        readonly promotionCredit: Pick<
          CurrencyValue,
          "display" | "currencyCode"
        >;
        readonly promotionBalance: Pick<
          CurrencyValue,
          "display" | "currencyCode"
        >;
      };
    };
  };
};

type PlusBoostWalletContainerProps = {
  readonly initialData: InitialData;
};

const PlusBoostWalletContainer: React.FC<PlusBoostWalletContainerProps> = ({
  initialData,
}: PlusBoostWalletContainerProps) => {
  const styles = useStyleSheet();

  const [currentTabKey, setCurrentTabKey] = useState<string>(BalanceHistoryKey);

  const {
    showCredits,
    dailyBudgetEnabled,
    spending: { promotionCredit, promotionBalance },
  } = initialData.marketing.currentMerchant;

  const actions = (
    <PrimaryButton minWidth href="/buy-product-boost-credits" openInNewTab>
      Recharge balance
    </PrimaryButton>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Wallet`}
        actions={actions}
        className={css(styles.header)}
        breadcrumbs={[
          { name: i`Marketing`, href: "/plus/marketing/boost" },
          { name: i`Wallet`, href: window.location.href },
        ]}
      >
        <div className={css(styles.headerText)}>
          View the balance you can use for promoting products including free
          ProductBoost credits.
        </div>
        <div className={css(styles.statsContainer)}>
          <div className={css(styles.column)}>
            <div className={css(styles.textStatsTitle)}>
              Available balance(${promotionBalance.currencyCode})
            </div>
            <div className={css(styles.textStatsBody)}>
              {promotionBalance.display}
            </div>
          </div>
          <div className={css(styles.column)}>
            <div className={css(styles.textStatsTitle)}>
              Available credit(${promotionCredit.currencyCode})
            </div>
            <div className={css(styles.textStatsBody)}>
              {promotionCredit.display}
            </div>
          </div>
        </div>
        <Pager
          className={css(styles.headerText)}
          onTabChange={(tabKey: string) => {
            setCurrentTabKey(tabKey);
          }}
          selectedTabKey={currentTabKey}
        >
          <Pager.Content
            key={BalanceHistoryKey}
            tabKey={BalanceHistoryKey}
            titleValue={i`Marketing Balance`}
          />
          {showCredits && (
            <Pager.Content
              key={CreditHistoryKey}
              tabKey={CreditHistoryKey}
              titleValue={i`Marketing Credit`}
            />
          )}
        </Pager>
      </PlusWelcomeHeader>
      <PageGuide>
        <TransactionHistory
          currentTabKey={currentTabKey}
          dailyBudgetEnabled={dailyBudgetEnabled}
          className={css(styles.content)}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStyleSheet = () => {
  const { pageGuideBottom } = useDeviceStore();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: `20px 0px ${pageGuideBottom} 0px`,
        },
        headerText: {
          marginTop: 8,
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
        column: {
          lineHeight: 1.4,
          flex: 0.5,
          maxWidth: "50%",
        },
        textStatsTitle: {
          fontSize: 16,
          fontWeight: fonts.weightMedium,
        },
        textStatsBody: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          wordWrap: "break-word",
          userSelect: "text",
        },
        statsContainer: {
          display: "flex",
          maxWidth: 600,
          transform: "translateZ(0)",
          marginTop: 16,
        },
      }),
    [pageGuideBottom],
  );
};

export default observer(PlusBoostWalletContainer);
