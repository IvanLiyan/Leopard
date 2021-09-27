import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, H4Markdown, Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const RestrictedProductUnverifiedContent = ({ style }: BaseProps) => {
  const styles = useStylesheet();
  return (
    <Card style={style} contentContainerStyle={css(styles.root)}>
      <div className={css(styles.contentContainer)}>
        <H4Markdown
          className={css(styles.header)}
          text={i`Validate your store to sell restricted product categories`}
        />
        <Markdown
          className={css(styles.welcomeText)}
          text={
            i`We need a few more details from you to validate your store's ` +
            i`ownership and help you best sell restricted products.`
          }
        />
        <PrimaryButton
          popoverStyle={css(styles.button)}
          href={"/settings#seller-profile"}
        >
          Validate store
        </PrimaryButton>
      </div>
      <Illustration
        name={"buildingsUnderDome"}
        alt={i`building under dome illustration`}
        className={css(styles.illustrationContainer)}
      />
    </Card>
  );
};

export default observer(RestrictedProductUnverifiedContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 24,
        },
        button: {
          maxWidth: 200,
          minHeight: 40,
          marginTop: 32,
          marginBottom: 32,
        },
        contentContainer: {
          display: "flex",
          flexDirection: "column",
        },
        illustrationContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        welcomeText: {
          fontSize: 16,
          lineHeight: 1.4,
          padding: "8px 0px",
          maxWidth: 680,
        },
        header: {
          fontSize: 20,
        },
      }),
    []
  );
