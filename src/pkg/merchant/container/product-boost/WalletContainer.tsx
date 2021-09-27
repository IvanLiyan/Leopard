import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import TransactionHistory from "@merchant/component/product-boost/wallet/TransactionHistory";
import ProductBoostHeader from "@merchant/component/product-boost/ProductBoostHeader";
import { StatsColumnItem } from "@merchant/component/product-boost/ProductBoostHeader";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

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

type WalletPageProps = {
  readonly initialData: InitialData;
};

const WalletContainer = ({ initialData }: WalletPageProps) => {
  const styles = useStyleSheet();
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();

  const [currentTabKey, setCurrentTabKey] = useState<string>(BalanceHistoryKey);

  const {
    showCredits,
    dailyBudgetEnabled,
    spending: { promotionCredit, promotionBalance },
  } = initialData.marketing.currentMerchant;

  const statsColumns = useMemo((): ReadonlyArray<StatsColumnItem> => {
    const statsColumns: StatsColumnItem[] = [];
    statsColumns.push({
      columnTitle: i`Available balance(${promotionBalance.currencyCode})`,
      columnStats: promotionBalance.display,
    });
    if (showCredits) {
      statsColumns.push({
        columnTitle: i`Available credit(${promotionCredit.currencyCode})`,
        columnStats: promotionCredit.display,
      });
    }
    return statsColumns;
  }, [promotionCredit, promotionBalance, showCredits]);

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.header)}>
        <ProductBoostHeader
          title={i`ProductBoost Wallet`}
          body={() => (
            <div className={css(styles.headerContainer)}>
              <Markdown
                className={css(styles.text)}
                openLinksInNewTab
                text={
                  dailyBudgetEnabled
                    ? i`View the balance you can use for promoting products, ` +
                      i`including free ProductBoost credits.`
                    : i`View the balance you can use for creating campaigns, ` +
                      i`including free ProductBoost credits.`
                }
              />
              <PrimaryButton
                className={css(styles.rechargeButton)}
                href="/buy-product-boost-credits"
                openInNewTab
              >
                Recharge balance
              </PrimaryButton>
            </div>
          )}
          statsColumns={statsColumns}
          paddingX={pageX}
          hideBorder
        />
        <Pager
          className={css(styles.tabs)}
          onTabChange={(tabKey: string) => {
            setCurrentTabKey(tabKey);
          }}
          selectedTabKey={currentTabKey}
        >
          <Pager.Content
            key={BalanceHistoryKey}
            tabKey={BalanceHistoryKey}
            titleValue={i`ProductBoost Balance`}
          />
          {showCredits && (
            <Pager.Content
              key={CreditHistoryKey}
              tabKey={CreditHistoryKey}
              titleValue={i`ProductBoost Credit`}
            />
          )}
        </Pager>
      </div>
      <TransactionHistory
        currentTabKey={currentTabKey}
        dailyBudgetEnabled={dailyBudgetEnabled}
        className={css(styles.content)}
      />
    </div>
  );
};

const useStyleSheet = () => {
  const { pageBackground, surfaceLightest, primary, textBlack } = useTheme();
  const {
    pageGuideXForPageWithTable: pageX,
    pageGuideBottom,
  } = useDimenStore();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        content: {
          padding: `20px ${pageX} ${pageGuideBottom} ${pageX}`,
        },
        tabs: {
          padding: `0px ${pageX}`,
        },
        header: {
          backgroundColor: surfaceLightest,
        },
        headerContainer: {
          display: "flex",
          justifyContent: "space-between",
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          fontWeight: fonts.weightNormal,
          color: textBlack,
          maxWidth: 750,
        },
        rechargeButton: {
          backgroundColor: primary,
          borderRadius: "4px",
          fontSize: 16,
          lineHeight: 1.5,
        },
      }),
    [
      pageBackground,
      surfaceLightest,
      primary,
      textBlack,
      pageX,
      pageGuideBottom,
    ]
  );
};

export default observer(WalletContainer);
