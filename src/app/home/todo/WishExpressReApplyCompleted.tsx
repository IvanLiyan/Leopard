import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Markdown } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";
import Illustration from "@core/components/Illustration";
import Icon from "@core/components/Icon";
import { Heading } from "@ContextLogic/atlas-ui";
import { merchFeURL } from "@core/toolkit/router";

export type WishCompletedProps = BaseProps & {
  readonly closeModal: () => unknown;
};

const WishExpressReApplyCompleted = (props: WishCompletedProps) => {
  const styles = useStylesheet();
  const { closeModal, className, style } = props;

  const { textDark, positive } = useTheme();
  const learnMoreUrl = zendeskURL("231264967");

  return (
    <div className={css(styles.root, className, style)}>
      <Illustration
        name="todoWishExpressWithText"
        alt="wish-express-logo"
        className={css(styles.wishLogo)}
      />
      <div className={css(styles.modalContentContainer)}>
        <div className={css(styles.headerContainer)}>
          <Icon
            name="checkCircle"
            color={positive}
            className={css(styles.greenCheck)}
          />
          <Heading variant="h2">Congrats! Let&#39;s keep going.</Heading>
        </div>
        <div className={css(styles.innerContentContainer)}>
          <div className={css(styles.firstSentenceInInnerContent)}>
            You have successfully signed up for Wish Express!
          </div>
          <div className={css(styles.secondSentenceInInnerContent)}>
            You can add Wish Express warehouses for the destination countries
            where you offer expedited shipping.
          </div>
          <div className={css(styles.actionButtonContainer)}>
            <PrimaryButton
              className={css(styles.actionButton)}
              href={merchFeURL("/product#show_add_warehouse_modal=1")}
            >
              Add a Wish Express warehouse
            </PrimaryButton>
          </div>
          <div className={css(styles.secondaryAction)} onClick={closeModal}>
            <Link style={{ color: textDark }} href="/">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
      <div className={css(styles.footer)}>
        <Markdown
          openLinksInNewTab
          className={css(styles.footerMainText)} // eslint-disable-next-line local-rules/no-links-in-i18n
          text={i`How to enable Wish Express for your products? [Learn more](${learnMoreUrl})`}
        />
      </div>
    </div>
  );
};

export default observer(WishExpressReApplyCompleted);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: "4px",
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          backgroundColor: "#ffffff",
        },
        exitButton: {
          position: "absolute",
          right: 0,
          top: 0,
          paddingTop: 16,
          paddingRight: 24,
          width: 24,
          backgroundColor: "ffffff",
          cursor: "pointer",
        },
        wishLogo: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 192,
          objectFit: "contain",
          paddingTop: 40,
          position: "absolute",
          top: 0,
          left: 0,
          paddingLeft: 52,
        },
        footer: {
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          borderRadius: "4px",
          boxShadow: "inset 0 1px 0 0 #c4cdd5",
          backgroundColor: "#f8fafb",
          paddingBottom: 20,
        },
        footerMainText: {
          paddingTop: 20,
          fontSize: 16,
          paddingRight: 20,
        },
        modalContentContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          paddingLeft: 52,
          paddingRight: 52,
          paddingTop: 60,
        },
        headerContainer: {
          display: "flex",
          justifyContent: "center",
          marginBottom: 32,
          paddingTop: 42,
        },
        greenCheck: {
          paddingRight: 10,
        },
        innerContentContainer: {
          textAlign: "center",
          paddingLeft: 40,
          paddingRight: 40,
          maxWidth: 550,
        },
        actionButton: {
          marginBottom: 10,
          paddingTop: 10,
        },
        actionButtonContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 18,
        },
        firstSentenceInInnerContent: {
          marginBottom: 20,
          fontSize: 16,
          color: textBlack,
        },
        secondSentenceInInnerContent: {
          marginBottom: 32,
          fontSize: 16,
          color: textBlack,
        },
        secondaryAction: {
          color: "#4a5f6e",
          fontSize: "16px",
          marginBottom: 42,
          cursor: "pointer",
        },
      }),
    [textBlack],
  );
};
