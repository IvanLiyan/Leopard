import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { usePathParams, zendeskURL } from "@toolkit/url";

import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";
import { useNavigationStore } from "@stores/NavigationStore";

import { Pager, Markdown } from "@ContextLogic/lego";
import WelcomeHeader from "@merchant/component/core/WelcomeHeader";

import VideoList from "@merchant/component/products/add-product-demo/VideoList";
import BestPractices from "@merchant/component/products/add-product-demo//BestPractices";

const AddProductDemo: React.FC<Record<string, never>> = () => {
  const navigationStore = useNavigationStore();
  const deviceStore = useDeviceStore();
  const { currentTab } = usePathParams("/videos/:currentTab");
  const faqLink = zendeskURL("360056495994");

  const paddingX = deviceStore.pageGuideXForPageWithTable;
  const styles = useStylesheet({ paddingX });

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Add Videos to your Products`}
        body={() => (
          <Markdown
            className={css(styles.bannerParagraph)}
            text={
              i`Add videos to your active product listings that show ` +
              i`your item in use, allowing customers to envision using it ` +
              i`themselves. [Learn more](${faqLink})`
            }
          />
        )}
        maxIllustrationWidth={318}
        illustration="productDemoBannerImage"
        hideBorder
        paddingX={paddingX}
      />
      <Pager
        onTabChange={(tab: string) => {
          navigationStore.pushPath(`/videos/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${paddingX}`,
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

const useStylesheet = ({
  paddingX,
}: {
  readonly paddingX: string | number;
}) => {
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
          padding: `32px ${paddingX} 65px ${paddingX}`,
        },
      }),
    [pageBackground, paddingX],
  );
};
