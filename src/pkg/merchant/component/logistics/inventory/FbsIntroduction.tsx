import React, { useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

/* SVGs */
import closeIcon from "@assets/img/black-close.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const FbsIntroduction = (props: BaseProps) => {
  const styles = useStylesheet();

  const [showTab, setShowTab] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fbwApi.getSeenFBSIntroduction({}).call();
      const { data } = resp;
      if (!data) {
        return;
      }
      const seenFBSIntroduction = data.seen_fbs_intro;
      setShowTab(!seenFBSIntroduction);
    };
    fetchData();
  }, [setShowTab]);

  const dismissFBSIntroduction = async () => {
    setShowTab(false);
    await fbwApi.dismissFBSIntroduction({}).call();
  };

  return (
    <div className={css(styles.root)}>
      {showTab && (
        <Card className={css(styles.closeCard)}>
          <div className={css(styles.card)}>
            <Text weight="bold" className={css(styles.intro)}>
              Introducing Fulfillment By Store (FBS)
            </Text>
            <Markdown
              className={css(styles.description)}
              text={
                i`Our new FBS program allows you to stock products not only ` +
                i`in FBW warehouses but also in our partner pickup stores in ` +
                i`close proximity to your customers!`
              }
            />
            <div className={css(styles.list)}>
              <div className={css(styles.feature)}>
                <Illustration
                  name="fbsIntro1"
                  className={css(styles.featureImg)}
                  alt="illustration"
                />
                <Text weight="bold" className={css(styles.featureTitle)}>
                  Closer to customers
                </Text>
                <Markdown
                  className={css(styles.featureContent)}
                  text={
                    i`Products stocked in local partner stores are in close ` +
                    i`proximity to your customers, shortening the overall ` +
                    i`time needed for the customers to receive products.`
                  }
                />
              </div>
              <div className={css(styles.feature)}>
                <Illustration
                  name="fbsIntro2"
                  className={css(styles.featureImg)}
                  alt="illustration"
                />
                <Text weight="bold" className={css(styles.featureTitle)}>
                  Exposure in Wish app
                </Text>
                <Markdown
                  className={css(styles.featureContent)}
                  text={
                    i`Eligible FBS products will appear under the **Same-` +
                    i`day Pickup tab** in Wish app and will be easier for ` +
                    i`customers to discover as a result.`
                  }
                />
              </div>
              <div className={css(styles.feature)}>
                <Illustration
                  name="fbsIntro3"
                  className={css(styles.featureImg)}
                  alt="illustration"
                />
                <Text weight="bold" className={css(styles.featureTitle)}>
                  Higher visibility of your products
                </Text>
                <Markdown
                  className={css(styles.featureContent)}
                  text={
                    i`By stocking inventory in-store, FBS showcases your ` +
                    i`products in ${`**1,000+**`} stores across the world and helps ` +
                    i`you expand your offline customer base.`
                  }
                />
              </div>
            </div>
            <div className={css(styles.btn)}>
              <PrimaryButton onClick={dismissFBSIntroduction}>
                Got it!
              </PrimaryButton>
            </div>
          </div>
          <div className={css(styles.close)} onClick={dismissFBSIntroduction}>
            <img src={closeIcon} alt="close icon" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default FbsIntroduction;

const useStylesheet = () => {
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      left: 0,
      top: 0,
      textAlign: "center",
    },
    closeCard: {
      paddingTop: 24,
      paddingBottom: 28,
    },
    card: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      cursor: "default",
      justifyContent: "center",
      alignItems: "center",
      userSelect: "none",
      fontStyle: "normal",
      fontStretch: "normal",
      overflow: "hidden",
      textOverflow: "ellipsis",
      paddingLeft: 10,
      paddingRight: 10,
    },
    intro: {
      fontSize: 20,
      lineHeight: 1.4,
      color: palettes.textColors.Ink,
    },
    description: {
      fontSize: 16,
      lineHeight: 1.25,
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      maxWidth: 640,
    },
    close: {
      cursor: "pointer",
      fill: palettes.textColors.DarkInk,
      opacity: 0.5,
      width: 24,
      position: "absolute",
      right: 24,
      top: 24,
      ":hover": {
        opacity: 1,
      },
    },
    list: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      marginLeft: 200,
      marginRight: 200,
      marginTop: 20,
      marginBottom: 24,
    },
    feature: {
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginLeft: 20,
      marginRight: 20,
    },
    featureTitle: {
      fontSize: 16,
      lineHeight: 1.5,
      color: palettes.textColors.DarkInk,
      marginTop: 16,
    },
    featureContent: {
      fontSize: 14,
      lineHeight: 1.43,
      fontWeight: fonts.weightMedium,
      color: palettes.textColors.DarkInk,
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
    },
    featureImg: {
      width: 80,
      height: 80,
    },
    tip: {
      marginTop: 40,
      fontSize: 14,
      marginBottom: 20,
    },
    btn: {},
  });
};
