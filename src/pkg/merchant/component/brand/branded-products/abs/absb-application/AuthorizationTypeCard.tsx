import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H5 } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { IllustrationName } from "@merchant/component/core";

type AuthorizationTypeCardProps = {
  readonly title: string;
  readonly body: string;
  readonly illustration: IllustrationName;
  readonly illustrationAlt: string;
  readonly active: boolean;
  readonly onClick: () => unknown;
};

const AuthorizationTypeCard = ({
  title,
  body,
  illustration,
  illustrationAlt,
  active,
  onClick,
}: AuthorizationTypeCardProps) => {
  const styles = useStylesheet(active);

  return (
    <Card style={css(styles.card)} onClick={onClick}>
      <H5 className={css(styles.title)}>{title}</H5>
      <div className={css(styles.row)}>
        <Markdown style={css(styles.body)} text={body} openLinksInNewTab />
        <Illustration name={illustration} alt={illustrationAlt} />
      </div>
    </Card>
  );
};

export default observer(AuthorizationTypeCard);

const useStylesheet = (active: boolean) => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          margin: "0px 24px 24px 24px",
          width: "calc(100% - 48px)",
          ":hover": {
            borderColor: primary,
            boxShadow: "0 4px 8px 0 rgba(175, 199, 209, 0.4)",
          },
          ...(!active ? { opacity: 0.5 } : {}),
        },
        title: {
          margin: "16px 24px 8px 24px",
        },
        row: {
          display: "flex",
          justifyContent: "space-between",
          margin: "0px 24px",
        },
        body: {
          marginBottom: 24,
          maxWidth: 680,
        },
      }),
    [active, primary],
  );
};
