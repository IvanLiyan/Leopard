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
import { usePathParams, zendeskURL } from "@toolkit/url";

import VideoList from "@merchant/component/products/add-product-demo/VideoList";
import BestPractices from "@merchant/component/products/add-product-demo//BestPractices";

const AddProductDemo: React.FC<{}> = () => {
  const routeStore = useRouteStore();
  const dimenStore = useDimenStore();
  const { currentTab } = usePathParams("/demo-videos/:currentTab");
  const styles = useStylesheet();
  const faqLink = zendeskURL("360056495994");

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Add Demo Videos to your Products`}
        body={() => (
          <Markdown
            className={css(styles.bannerParagraph)}
            text={
              i`Add Demo Videos to your active product listings that show ` +
              i`your item in use, allowing customers to envision using it ` +
              i`themselves. [Learn more](${faqLink})`
            }
          />
        )}
        maxIllustrationWidth={318}
        illustration="productDemoBannerImage"
        hideBorder
      />
      <Pager
        onTabChange={(tab: string) => {
          routeStore.pushPath(`/demo-videos/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${dimenStore.pageGuideX}`,
        }}
        hideHeaderBorder
      >
        <Pager.Content titleValue={i`Upload Videos`} tabKey="list">
          <div className={css(styles.pagerContent)}>
            <VideoList />
          </div>
        </Pager.Content>
        <Pager.Content titleValue={i`Best Practices`} tabKey="best-practices">
          <div className={css(styles.pagerContent)}>
            <BestPractices />
          </div>
        </Pager.Content>
      </Pager>
    </div>
  );
};

export default observer(AddProductDemo);

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
          display: "flex",
          flexDirection: "column",
          padding: "32px 15% 65px 15%",
        },
      }),
    [pageBackground],
  );
};
