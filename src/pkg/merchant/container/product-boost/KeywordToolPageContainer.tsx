import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Text } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as dimen from "@toolkit/lego-legacy/dimen";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import Keywords from "@merchant/component/product-boost/keyword-tool/Keywords";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { useRequest } from "@toolkit/api";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const KeywordToolPageContainer = () => {
  const styles = useStylesheet();

  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  const [lastUpdateResponse] = useRequest(
    productBoostApi.getProductBoostKeywordLastUpdate({})
  );

  const lastUpdate = lastUpdateResponse?.data?.last_update || "";

  const renderTitle = () => {
    return (
      <div className={css(styles.titleContainer)}>
        <Text
          weight="bold"
          className={css(styles.titleText)}
          style={{ float: "left" }}
        >
          Keyword Tool
        </Text>
        <Text
          weight="medium"
          className={css(styles.lastUpdated)}
          style={{ float: "left" }}
        >
          Updated on {lastUpdate}
        </Text>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <WelcomeHeader
        title={() => renderTitle()}
        body={
          i`Using the right keywords in your ProductBoost campaigns ` +
          i`will increase the reach for your products.`
        }
        paddingX={pageX}
        illustration="productBoostKeywords"
      >
        <div
          style={{
            fontSize: 20,
            marginTop: 10,
          }}
        >
          <Link href={zendeskURL("360026153833")} openInNewTab>
            Learn more
          </Link>
        </div>
      </WelcomeHeader>
    );
  };

  return (
    <div className={css(styles.root)}>
      {renderHeader()}
      <Keywords last_update={lastUpdate} className={css(styles.content)} />
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
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
          color: palettes.textColors.Ink,
          marginBottom: 20,
        },
        lastUpdated: {
          fontSize: 16,
          color: palettes.textColors.LightInk,
          marginTop: 8,
          marginLeft: 15,
        },
      }),
    [pageX]
  );
};

export default observer(KeywordToolPageContainer);
