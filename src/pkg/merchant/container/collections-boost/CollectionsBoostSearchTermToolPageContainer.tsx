import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Utils */
import { css } from "@toolkit/styling";
import * as dimen from "@toolkit/lego-legacy/dimen";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Components */
import Keywords from "@merchant/component/product-boost/keyword-tool/Keywords";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { useRequest } from "@toolkit/api";

const CollectionsBoostSearchTermToolPageContainer = () => {
  const styles = useStylesheet();

  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = useStore();

  // Reuse PB API is temparory for now
  const [lastUpdateResponse] = useRequest(
    productBoostApi.getProductBoostKeywordLastUpdate({})
  );

  const lastUpdateTime = lastUpdateResponse?.data?.last_update || "";

  const headerTitle = useMemo(() => {
    return (
      <div className={css(styles.titleContainer)}>
        <Text weight="bold" className={css(styles.titleText)}>
          Search Term Tool
        </Text>
        <Text weight="medium" className={css(styles.lastUpdated)}>
          Updated on {lastUpdateTime}
        </Text>
      </div>
    );
  }, [styles, lastUpdateTime]);

  const renderHeader = () => {
    return (
      <WelcomeHeader
        title={() => headerTitle}
        body={
          i`Using the right terms in your CollectionsBoost campaigns ` +
          i`will increase the reach for your collections.`
        }
        paddingX={pageX}
        illustration="productBoostKeywords"
      ></WelcomeHeader>
    );
  };

  return (
    <div className={css(styles.root)}>
      {renderHeader()}
      <Keywords last_update={lastUpdateTime} className={css(styles.content)} />
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground, textLight, textBlack } = useTheme();
  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = useStore();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        content: {
          padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
        },
        titleContainer: {
          overflow: "hidden",
        },
        titleText: {
          fontSize: 24,
          lineHeight: 1.25,
          color: textBlack,
          marginBottom: 20,
          float: "left",
        },
        lastUpdated: {
          fontSize: 16,
          color: textLight,
          marginTop: 8,
          marginLeft: 15,
          float: "left",
        },
      }),
    [pageX, pageBackground, textLight, textBlack]
  );
};

export default observer(CollectionsBoostSearchTermToolPageContainer);
