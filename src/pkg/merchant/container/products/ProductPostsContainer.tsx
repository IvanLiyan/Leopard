/*
 * ProductPostsContainer.tsx
 *
 * Created by Jonah Dlin on Wed Apr 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";

import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

import { Pager, Markdown } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { usePathParams } from "@toolkit/url";

import Performance from "@merchant/component/products/product-posts/Performance";
import ManagePosts from "@merchant/component/products/product-posts/ManagePosts";
import BestPractices from "@merchant/component/products/product-posts/BestPractices";

const ProductPostsContainer: React.FC<{}> = () => {
  const routeStore = useRouteStore();
  const dimenStore = useDimenStore();
  const { currentTab } = usePathParams("/product-posts/:currentTab");
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Social Posts`}
        body={() => (
          <Markdown
            className={css(styles.bannerParagraph)}
            text={
              i`Promote your products by adding 30-second or less vertical ` +
              i`videos that highlight seasonal promotions, show off special ` +
              i`product details, and engage customers with stories about ` +
              i`your product.`
            }
          />
        )}
        maxIllustrationWidth={240}
        illustration="socialPostsBanner"
        hideBorder
      />
      <Pager
        onTabChange={(tab: string) => {
          routeStore.pushPath(`/product-posts/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${dimenStore.pageGuideX}`,
        }}
        hideHeaderBorder
      >
        <Pager.Content titleValue={i`Performance`} tabKey="performance">
          <Performance className={css(styles.pagerContent)} />
        </Pager.Content>
        <Pager.Content titleValue={i`Manage posts`} tabKey="manage-posts">
          <ManagePosts className={css(styles.pagerContent)} />
        </Pager.Content>
        <Pager.Content titleValue={i`Best practices`} tabKey="best-practices">
          <BestPractices className={css(styles.pagerContent)} />
        </Pager.Content>
      </Pager>
    </div>
  );
};

export default observer(ProductPostsContainer);

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
        pagerContent: {
          padding: "64px 15%",
        },
      }),
    [pageBackground]
  );
};
