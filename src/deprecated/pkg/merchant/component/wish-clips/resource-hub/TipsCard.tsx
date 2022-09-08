import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { H5, Layout, Text } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
  readonly text: string;
  readonly illustration: IllustrationName;
};

const TipsCard: React.FC<Props> = ({
  className,
  style,
  text,
  title,
  illustration,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow alignItems="center">
        <Illustration
          name={illustration}
          alt={`${title} icon`}
          style={styles.icon}
        />
        <H5 style={styles.title}>{title}</H5>
      </Layout.FlexRow>

      <Text>{text}</Text>
    </Layout.FlexColumn>
  );
};

export default observer(TipsCard);

const useStylesheet = () => {
  const { surfaceLighter } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLighter,
          height: "fit-content",
          padding: 20,
          borderRadius: 15,
          gap: 8,
        },
        title: {
          marginBottom: 3,
        },
        icon: {
          minWidth: 30,
          marginRight: 10,
        },
      }),
    [surfaceLighter]
  );
};
