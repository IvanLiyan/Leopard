import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Card, Link, LoadingIndicator, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import MerchantTroCard from "@merchant/component/brand/merchant-tro/MerchantTroCard";

/* MerchantStore */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant API */
import * as troApi from "@merchant/api/brand/merchant-tro";

/* Toolkit */
import { zendeskCategoryURL } from "@toolkit/url";
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type MerchantTroCardsProps = BaseProps;

const MerchantTroCards = (props: MerchantTroCardsProps) => {
  const styles = useStylesheet(props);
  const { className, style } = props;
  const request = troApi.getMerchantTros({});
  const resultData = request.response?.data;
  if (resultData == null) {
    return <LoadingIndicator />;
  }
  const injunctionResults = resultData.injunction_results;
  return (
    <div className={css(styles.root, className, style)}>
      <Text weight="bold" className={css(styles.title)}>
        {ci18n("refers to court case", "Cases")}
      </Text>

      <div className={css(styles.body, className, style)}>
        <div className={css(styles.cardArray)}>
          {injunctionResults.length === 0 ? (
            <div> {ci18n("refers to court case", "No case found")} </div>
          ) : (
            injunctionResults.map((injunctionResult) => {
              return (
                <MerchantTroCard
                  className={css(styles.card)}
                  injunctionResult={injunctionResult}
                  onUpdate={() => {
                    request.refresh();
                  }}
                />
              );
            })
          )}
        </div>
        <Card className={css(styles.resource)}>
          <Text weight="bold" className={css(styles.title)}>
            Resources
          </Text>
          <Text weight="bold" className={css(styles.title)}>
            Resources
          </Text>
          <Link
            className={css(styles.link)}
            href={zendeskURL("360008058353")}
            openInNewTab
          >
            <Text weight="medium">Injunction FAQ</Text>
          </Link>
          <Link
            className={css(styles.link)}
            href={zendeskURL("360040662814")}
            openInNewTab
          >
            <Text weight="medium">List of attorneys for TROs</Text>
          </Link>
          <Link
            className={css(styles.lastLink)}
            href={zendeskCategoryURL("200474797")}
            openInNewTab
          >
            <Text weight="medium">Prevent future injunctions</Text>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default observer(MerchantTroCards);

const useStylesheet = (props: MerchantTroCardsProps) => {
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          justifyItems: "stretch",
        },
        cardArray: {
          display: "flex",
          flexDirection: "column",
          width: "65%",
          paddingRight: `${pageX}`,
        },
        resource: {
          display: "flex",
          flexDirection: "column",
          width: "30%",
          height: 230,
        },
        root: {
          display: "flex",
          flexDirection: "column",
          padding: `10px ${pageX} 10px ${pageX}`,
          ":nth-child(1n) > *": {
            padding: `20px ${pageX} 30px ${pageX}`,
          },
        },
        card: {
          marginBottom: 20,
        },
        link: {
          fontSize: 16,
          display: "flex",
          justifyContent: "flex-start",
          padding: `10px ${pageX} 20px ${pageX}`,
        },
        lastLink: {
          fontSize: 16,
          display: "flex",
          justifyContent: "flex-start",
          padding: `10px ${pageX} 40px ${pageX}`,
        },
        title: {
          fontSize: 22,
          lineHeight: 1.33,
          color: textBlack,
          marginRight: 25,
          display: "flex",
          justifyContent: "flex-start",
          padding: `20px ${pageX} 10px ${pageX}`,
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
        },
        filterButton: {
          alignSelf: "stretch",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        pageIndicatorLoading: {
          marginRight: 25,
        },
        filterImg: {
          width: 13,
          height: 13,
          marginRight: 8,
        },
      }),
    [pageX, textBlack]
  );
};
