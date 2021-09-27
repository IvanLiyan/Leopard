/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";

type PillProps = BaseProps & {
  readonly illustrationName?: IllustrationName;
  readonly text: string;
  readonly height?: number;
};

const Pill = (props: PillProps) => {
  const { illustrationName, text, className, height, style } = props;
  const styles = useStylesheet(height);

  return (
    <div className={css(styles.container, className, style)}>
      {illustrationName && (
        <Illustration
          name={illustrationName}
          alt="pill icon"
          className={css(styles.iconContainer)}
        />
      )}
      <div className={css(styles.textContainer)} title={text}>
        {text}
      </div>
    </div>
  );
};

export default observer(Pill);

const useStylesheet = (height: number | undefined) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "row",
          borderRadius: 16,
          border: "solid 1px rgba(175, 199, 209, 0.2)",
          backgroundColor: palettes.greyScaleColors.LightGrey,
          alignItems: "center",
          height: height || 32,
          paddingRight: 8,
        },
        iconContainer: {
          width: height || 32,
          borderRadius: 16,
          backgroundColor: palettes.greyScaleColors.Grey,
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
    [height],
  );
};
