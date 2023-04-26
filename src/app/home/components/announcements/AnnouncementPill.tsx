/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import Illustration, { IllustrationName } from "@core/components/Illustration";

type AnnouncementPillProps = BaseProps & {
  readonly illustrationName?: IllustrationName;
  readonly text: string;
  readonly height?: number;
};

const AnnouncementPill = (props: AnnouncementPillProps) => {
  const { illustrationName, text, className, height, style } = props;
  const styles = useStylesheet(height);

  return (
    <div className={css(styles.container, className, style)}>
      {illustrationName && (
        <Illustration
          name={illustrationName}
          alt={text}
          style={styles.iconContainer}
        />
      )}
      <div className={css(styles.textContainer)} title={text}>
        {text}
      </div>
    </div>
  );
};

export default observer(AnnouncementPill);

const useStylesheet = (height: number | undefined) => {
  const { surfaceLight, surface, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "row",
          borderRadius: 16,
          border: `solid 1px ${borderPrimary}`,
          backgroundColor: surfaceLight,
          alignItems: "center",
          height: height || 32,
          paddingRight: 8,
        },
        iconContainer: {
          width: height || 32,
          borderRadius: 16,
          backgroundColor: surface,
          padding: 6,
          boxSizing: "border-box",
        },
        textContainer: {
          marginLeft: 8,
          height: 20,
          lineHeight: "20px",
          cursor: "default",
          maxWidth: 100,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    [height, surfaceLight, surface, borderPrimary],
  );
};
