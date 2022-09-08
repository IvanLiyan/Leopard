/*
 * CardHeader.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly icon?: IllustrationName;
  readonly title: string;
  readonly subtitle?: string;
};

const CardHeader: React.FC<Props> = ({
  className,
  style,
  icon,
  title,
  subtitle,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      {icon != null && (
        <div className={css(styles.iconCircle)}>
          <Illustration className={css(styles.icon)} name={icon} alt="" />
        </div>
      )}
      <Text className={css(styles.title)} weight="semibold">
        {title}
      </Text>
      {subtitle != null && (
        <Text className={css(styles.subtitle)}>{subtitle}</Text>
      )}
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          alignItems: "center",
          columnGap: "16px",
        },
        iconCircle: {
          backgroundColor: surfaceLight,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 32,
          width: 32,
        },
        icon: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: 20,
          maxWidth: 20,
        },
        title: {
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
        },
        subtitle: {
          fontSize: 16,
          lineHeight: "24px",
          color: textBlack,
          gridColumn: 2,
          gridRow: 2,
        },
      }),
    [textBlack, surfaceLight]
  );
};

export default CardHeader;
