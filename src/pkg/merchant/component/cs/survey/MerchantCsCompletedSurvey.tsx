import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type MerchantCsCompletedSurveyProps = BaseProps;

const MerchantCsCompletedSurvey = ({
  style,
}: MerchantCsCompletedSurveyProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(style)}>
      <Card contentContainerStyle={css(styles.card, style)}>
        <Icon name="greenCheckmarkSolid" className={css(styles.icon)} />
        <H4Markdown className={css(styles.titleText)} text={i`Thank you!`} />
        <Markdown
          className={css(styles.mainText)}
          text={
            i`You have successfully joined the waitlist! We will notify you when ` +
            i`the new Customer Service Program is available. In the meantime, please ` +
            i`use the links below to communicate with your customers:`
          }
        />
        <div className={css(styles.linksSection)}>
          <Link className={css(styles.link)} href="/tickets/action_required">
            Post Purchase Tickets
          </Link>
          <Link className={css(styles.link)} href="/tickets/pre-purchase">
            Pre-Purchase Questions
          </Link>
          <Link
            className={css(styles.link)}
            href="/tickets/post-customer-support"
          >
            Post Customer Support Questions
          </Link>
          <Link className={css(styles.link)} href="/tickets/awaiting_user">
            Awaiting User
          </Link>
          <Link className={css(styles.link)} href="/tickets/closed">
            Closed
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default observer(MerchantCsCompletedSurvey);

const useStylesheet = () => {
  const { textBlack, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: textBlack,
          fontFamily: fonts.proxima,
        },
        icon: {
          height: 28,
          marginBottom: 30,
        },
        titleText: {
          marginBottom: 20,
        },
        mainText: {
          maxWidth: 720,
          marginBottom: 30,
          textAlign: "center",
        },
        linksSection: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        link: {
          ":not(:first-child)": {
            borderLeft: "1px solid",
            borderLeftColor: borderPrimary,
            paddingLeft: 20,
          },
          ":not(:last-child)": {
            paddingRight: 20,
          },
        },
      }),
    [textBlack, borderPrimary],
  );
};
