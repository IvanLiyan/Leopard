import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

import { zendeskURL } from "@toolkit/url";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import BoostedProducts from "@plus/component/marketing/boosted-products/BoostedProducts";

import { BoostedProductsInitialData } from "@toolkit/marketing/boosted-products";

type Props = {
  readonly initialData: BoostedProductsInitialData;
};

const PlusBoostedProductsContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const {
    marketing: { currentMerchant: marketingProperty },
  } = initialData;
  const budgetAvailable =
    marketingProperty?.spending.budgetAvailable.amount ?? 0;

  const isFreeBudgetMerchant = marketingProperty?.isFreeBudgetMerchant;
  const styles = useStylesheet();

  const emptyBalance = budgetAvailable <= 0;
  const walletLink = "/plus/marketing/wallet";
  const actions = (
    <PrimaryButton
      href="/plus/marketing/manage"
      minWidth
      isDisabled={emptyBalance}
      popoverContent={
        emptyBalance
          ? i`Please load your [marketing wallet](${walletLink}) ` +
            i`to begin boosting products.`
          : undefined
      }
    >
      Boost products
    </PrimaryButton>
  );

  const freeBudgetFAQLink = zendeskURL("360058530133");

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Boosted products`}
        actions={actions}
        className={css(styles.header)}
        breadcrumbs={[
          { name: i`Marketing`, href: window.location.href },
          { name: i`Boosted products`, href: window.location.href },
        ]}
      >
        <Markdown
          className={css(styles.headerText)}
          text={
            isFreeBudgetMerchant
              ? i`Boost your products’ impressions in the Wish app and strategically ` +
                i`attract more customers! [Learn More](${freeBudgetFAQLink})`
              : i`Boost your products’ impressions in the Wish app and strategically ` +
                i`attract more customers!`
          }
        />
      </PlusWelcomeHeader>
      <PageGuide>
        <BoostedProducts initialData={initialData} />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        headerText: {
          marginTop: 8,
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
      }),
    [],
  );
};

export default observer(PlusBoostedProductsContainer);
