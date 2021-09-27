import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { css } from "@toolkit/styling";
import { Text } from "@ContextLogic/lego";

type Props = BaseProps & {
  readonly title: string;
  readonly description: string;
};

const RequiredAttribute: React.FC<Props> = ({
  className,
  style,
  title,
  description,
}: Props) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className, style)}>
      <Icon className={css(styles.icon)} name="greenCheckmarkSolid" />
      <div className={css(styles.content)}>
        <Text className={css(styles.title)} weight="semibold">
          {title}
        </Text>
        <Text className={css(styles.description)}>{description}</Text>
      </div>
    </div>
  );
};

export default observer(RequiredAttribute);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          // We want to limit these cards
          // eslint-disable-next-line local-rules/validate-root
          maxWidth: 280,
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          wordWrap: "break-word",
        },
        description: {
          margin: "10px 0px",
          wordWrap: "break-word",
          height: 63,
        },
        icon: {
          height: 12,
          marginRight: 5,
          marginTop: 5,
        },
      }),
    [],
  );
};
