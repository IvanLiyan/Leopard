/* Revamp of @merchant/component/products/add-product-demo/RejectionReasonList.tsx */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { H6, Layout, Ul } from "@ContextLogic/lego";
import Icon from "@merchant/component/core/DEPRECATED_Icon";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
  readonly list: ReadonlyArray<string>;
};

const RejectionReasonList: React.FC<Props> = ({
  className,
  style,
  list,
  title,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="flex-start"
    >
      <Icon className={css(styles.icon)} name="redXSolid" />
      <Layout.FlexColumn>
        <H6 style={styles.title}>{title}</H6>
        <Ul>
          {list.map((reason) => (
            <Ul.Li key={reason} style={styles.item}>
              {reason}
            </Ul.Li>
          ))}
        </Ul>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

export default observer(RejectionReasonList);

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
          height: "fit-content",
          padding: 20,
          borderRadius: 4,
        },
        title: {
          marginBottom: 3,
        },
        item: {
          margin: "5px 0",
        },
        icon: {
          width: 20,
          minWidth: 20,
          marginTop: 2,
          marginRight: 10,
        },
      }),
    [surfaceLightest]
  );
};
