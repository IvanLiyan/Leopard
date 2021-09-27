import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ABSUnverifiedContentProps = BaseProps;

const ABSUnverifiedContent = ({ style }: ABSUnverifiedContentProps) => {
  const styles = useStylesheet();
  return (
    <Card style={style} contentContainerStyle={css(styles.root)}>
      <div className={css(styles.contentContainer)}>
        <H4Markdown text={i`Validate Your Store`} />
        <Markdown
          className={css(styles.welcomeText)}
          text={i`You can apply to become an Authentic Brand Seller after you validate your store.`}
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

export default observer(ABSUnverifiedContent);

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
      }),
    []
  );
