/*
 * ProductListingPlanContainer.tsx
 *
 * Created by Jonah Dlin on Fri Jul 23 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Layout, Markdown, Pager } from "@ContextLogic/lego";

/* Components */
import About from "@merchant/component/products/product-listing-plan/About";
import Dashboard from "@merchant/component/products/product-listing-plan/Dashboard";
import { WelcomeHeader } from "@merchant/component/core";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

/* Toolkit */
import { PlpInitialData } from "@toolkit/products/product-listing-plan";
import { usePathParams } from "@toolkit/url";

type Props = {
  readonly initialData: PlpInitialData;
};

const ProductListingPlanContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const routeStore = useRouteStore();
  const dimenStore = useDimenStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const styles = useStylesheet({ pageX });
  const { currentTab } = usePathParams("/product-listing-plan/:currentTab");

  // TODO: link TBD
  const learnMoreLink = "";

  return (
    <Layout.FlexColumn style={styles.root}>
      <WelcomeHeader
        title={i`Product Listing Plan`}
        body={() => (
          <Markdown
            style={styles.headerBody}
            text={
              i`View Product Listing Plans based on the number of active product ` +
              i`listings you have. [Learn more](${learnMoreLink})`
            }
          />
        )}
        illustration="productListingPlanHeader"
        maxIllustrationWidth={325}
        maxIllustrationHeight={130}
        hideBorder
        paddingX={pageX}
      />
      <Pager
        onTabChange={(tab: string) => {
          routeStore.pushPath(`/product-listing-plan/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${pageX}`,
        }}
        hideHeaderBorder
      >
        <Pager.Content
          titleValue={i`Your Product Listing Plan`}
          tabKey="dashboard"
        >
          <Dashboard
            className={css(styles.pagerContent)}
            initialData={initialData}
          />
        </Pager.Content>
        <Pager.Content titleValue={i`All Plans`} tabKey="about">
          <About
            className={css(styles.pagerContent)}
            initialData={initialData}
          />
        </Pager.Content>
      </Pager>
    </Layout.FlexColumn>
  );
};

export default observer(ProductListingPlanContainer);

const useStylesheet = ({ pageX }: { readonly pageX: number | string }) => {
  const { pageBackground, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
        },
        headerBody: {
          marginTop: 8,
          maxWidth: 580,
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
          ":not(:last-child)": {
            marginBottom: 4,
          },
        },
        pagerContent: {
          padding: `32px ${pageX} 65px ${pageX}`,
        },
      }),
    [pageBackground, textDark, pageX]
  );
};
