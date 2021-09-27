import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { Text } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly title: ReadonlyArray<string>;
  readonly list: ReadonlyArray<string>;
};

const RejectionReasonList: React.FC<Props> = ({
  className,
  style,
  list,
  title,
}: Props) => {
  const styles = useStylesheet();

  // ul and li are needed to satisfy mocks.
  /* eslint-disable local-rules/unnecessary-list-usage */
  return (
    <div className={css(className, style, styles.root)}>
      <Icon className={css(styles.icon)} name="redXSolid" />
      <div className={css(styles.content)}>
        <Text className={css(styles.title)} weight="semibold">
          {title}
        </Text>
        <ul>
          {list.map((reason) => (
            <li key={reason} className={css(styles.item)}>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default observer(RejectionReasonList);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          marginBottom: 10,
        },
        item: {
          margin: "5px 0",
        },
        icon: {
          width: 12,
          minWidth: 12,
          marginRight: 5,
          marginTop: 5,
        },
      }),
    []
  );
};
