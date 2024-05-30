import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Card, Text, H4Markdown, PrimaryButton } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";

const title = "Expanding sales channels through Wish - Qoo10 integration";

const redirectToQoo10 = () => {
  window.open("https://plus.wish.com/welcome_wish_merchant", "_blank");
};

const buttonStyle = { borderRadius: 4, marginTop: 18 };
const Qoo10IntegrationCard = () => {
  const styles = useStylesheet();
  return (
    <Card className={css(styles.card)}>
      <div className={css(styles.contentContainer)}>
        <H4Markdown text={title} className={css(styles.title)} />
        <Text weight="medium" className={css(styles.contextText)}>
          {i`Through the Wish - Qoo10 Sales Integration Service, you can enjoy the following benefits:`}
        </Text>
        <ul className={css(styles.ul)}>
          <li className={css(styles.ulText)}>
            {i`Expanded global exposure: Display your products on various global sites operated by Qoo10, including Korea and Singapore.`}
          </li>
          <li>
            {i`Increased sales: Expand your sales channels to increase revenue.`}
          </li>
          <li>
            {i`Automatic product management: Simply apply for the Wish - Qoo10 Sales Integration Service and your Wish products will be automatically copied ` +
              i`and registered on Qoo10 without the need for separate product registration, along with convenient management services.`}
          </li>
        </ul>
        <PrimaryButton
          style={buttonStyle}
          className={css(styles.linkToQoo10Btn)}
          onClick={() => redirectToQoo10()}
        >
          {ci18n(
            "button text, click to qoo10",
            "Qoo10 integration registration",
          )}
        </PrimaryButton>
      </div>
    </Card>
  );
};
export default observer(Qoo10IntegrationCard);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          border: 0,
        },
        contentContainer: {
          padding: 48,
          display: "flex",
          flexDirection: "column",
          zIndex: 5,
        },
        title: {
          fontSize: 28,
          fontWeight: 700,
          textAlign: "center",
        },
        contextText: {
          color: "#0E161C",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "24px",
          marginTop: 16,
        },
        ul: {
          paddingLeft: 16,
          marginTop: 12,
        },
        ulText: {
          color: "#0E161C",
          fontWeight: 400,
          fontSize: 16,
        },
        bodyText: {
          fontSize: 16,
          color: textDark,
          marginTop: 8,
          marginBottom: 20,
          maxWidth: 610,
        },
        linkToQoo10Btn: {
          width: 296,
          height: 40,
          weight: 700,
          borderRadius: 4,
          margin: "0 auto",
        },
      }),
    [textDark],
  );
};
