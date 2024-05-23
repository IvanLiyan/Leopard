import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@core/components/Illustration";
import { css } from "@core/toolkit/styling";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly text?: string;
};

const LaunchToQmsBtn: React.FC<Props> = (props: Props) => {
  const { className, style, text } = props;

  const styles = useStylesheet();

  return (
    <Layout.FlexRow className={css(className, style)} alignItems="flex-end">
      <Illustration
        name="launchToQms"
        animate={false}
        alt={text || ci18n("alt label for image", "Wish for Merchants")}
        style={styles.launchBtn}
      />
    </Layout.FlexRow>
  );
};

export default observer(LaunchToQmsBtn);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        launchBtn: {
          width: 172,
          minHeight: 42,
          marginRight: 10,
          flexShrink: 0,
        },
      }),
    [],
  );
};
