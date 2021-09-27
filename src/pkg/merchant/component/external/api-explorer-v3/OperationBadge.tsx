import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";
import { redocThemeColor } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type OperationBadgeProps = BaseProps & {
  readonly type: string;
};

const OperationBadge = (props: OperationBadgeProps) => {
  const { type, className, style: styleProp } = props;
  const style = useStyleSheet(type.toLowerCase());
  const rootCSS = css(style.root, [className], styleProp);

  const formatHTTPVerb = (verb: string) =>
    (({
      delete: "DEL",
      options: "OPTS",
    } as any)[verb] || verb.toUpperCase());

  return <span className={rootCSS}>{formatHTTPVerb(type)}</span>;
};

export default observer(OperationBadge);

const useStyleSheet = (type: string) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          textAlign: "center",
          fontWeight: weightBold,
          verticalAlign: "middle",
          borderRadius: 3,
          backgroundColor:
            (redocThemeColor.http as any)[type] || redocThemeColor.http.get,
        },
      }),
    [type]
  );
};
