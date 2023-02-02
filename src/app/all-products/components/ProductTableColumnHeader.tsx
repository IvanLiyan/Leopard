/*
 * ProductTableColumnHeader.tsx
 *
 * Created by Jonah Dlin on Thu Apr 28 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Layout, Popover, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
  readonly subtitle?: string;
  readonly titleDescription?: string;
  readonly subtitleDescription?: string;
};

const ProductTableColumnHeader: React.FC<Props> = ({
  className,
  style,
  title,
  subtitle,
  titleDescription,
  subtitleDescription,
}) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      style={[className, style]}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Popover openContentLinksInNewTab popoverContent={titleDescription}>
        <Text weight="semibold" style={styles.title}>
          {title}
        </Text>
      </Popover>
      {subtitle && (
        <Popover openContentLinksInNewTab popoverContent={subtitleDescription}>
          <Text weight="regular" style={styles.subtitle}>
            {subtitle}
          </Text>
        </Popover>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: 16,
          lineHeight: "24px",
          color: textBlack,
        },
        subtitle: {
          fontSize: 14,
          lineHeight: "20px",
          color: textLight,
        },
      }),
    [textBlack, textLight],
  );
};

export default observer(ProductTableColumnHeader);
