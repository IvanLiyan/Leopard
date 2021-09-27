/*
 * RefundAssuranceContainer.tsx
 *
 * Created by Jonah Dlin on Tue Mar 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";

import { useTheme } from "@merchant/stores/ThemeStore";

import { Markdown, Pager } from "@ContextLogic/lego";
import { PageGuide, WelcomeHeader } from "@merchant/component/core";
import RefundAssurance from "@merchant/component/product-boost/refund-assurance/RefundAssurance";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { usePathParams } from "@toolkit/url";
import {
  RefundAssuranceInitialData,
  RefundAssuranceTooltip,
} from "@toolkit/product-boost/refund-assurance";

type Props = {
  readonly initialData: RefundAssuranceInitialData;
};

const RefundAssuranceContainer: React.FC<Props> = ({
  initialData: {
    marketing: {
      currentMerchant: {
        refundAssuranceConstants: { guaranteedRefundRate, spendDiscountFactor },
      },
    },
  },
}: Props) => {
  const styles = useStylesheet();

  const routeStore = useRouteStore();
  const dimenStore = useDimenStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const { currentTab } = usePathParams(
    "/product-boost/refund-assurance/:currentTab",
  );

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`ProductBoost Refund Assurance`}
        body={() => (
          <Markdown
            className={css(styles.bannerParagraph)}
            text={RefundAssuranceTooltip.HEADER_DESC}
          />
        )}
        maxIllustrationWidth={318}
        illustration="refundAssurance"
        hideBorder
        paddingX={pageX}
      />
      <Pager
        onTabChange={(tab: string) => {
          routeStore.pushPath(`/product-boost/refund-assurance/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${pageX}`,
        }}
        hideHeaderBorder
      >
        <Pager.Content titleValue={i`Eligible Products`} tabKey="insured">
          <PageGuide mode="page-with-table">
            <RefundAssurance
              className={css(styles.content)}
              refundAssuranceType="ELIGIBLE"
              hiddenColumns={["REFUND_RATE", "REFUND_GMV"]}
              guaranteedRefundRate={guaranteedRefundRate}
              spendDiscountFactor={spendDiscountFactor}
            />
          </PageGuide>
        </Pager.Content>
        <Pager.Content titleValue={i`Other Products`} tabKey="uninsured">
          <PageGuide mode="page-with-table">
            <RefundAssurance
              className={css(styles.content)}
              refundAssuranceType="OTHER"
              hiddenColumns={["PB_SPEND", "CREDIT_RECEIVED"]}
              hiddenMonthlyStatsColumns={["PB_SPEND", "CREDIT_RECEIVED"]}
              guaranteedRefundRate={guaranteedRefundRate}
              spendDiscountFactor={spendDiscountFactor}
            />
          </PageGuide>
        </Pager.Content>
      </Pager>
    </div>
  );
};

export default observer(RefundAssuranceContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        bannerParagraph: {
          paddingTop: 8,
          fontSize: 16,
          lineHeight: "24px",
        },
        content: {
          marginTop: 16,
        },
      }),
    [pageBackground],
  );
};
