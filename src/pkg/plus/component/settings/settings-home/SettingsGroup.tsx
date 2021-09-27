/*
 * SettingsGroup.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 4/02/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout, H5 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import SettingsPageCard from "@plus/component/settings/settings-home/SettingsPageCard";
import { NavigationNode } from "@toolkit/chrome";
import { SettingsHomeInitialData } from "@toolkit/settings-home";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly initialData: SettingsHomeInitialData;
};

const SettingsGroup: React.FC<Props> = ({
  node,
  className,
  style,
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const children = useMemo(
    () => node.children.filter((child) => child.show_in_side_menu),
    [node]
  );
  if (children.length == 0) {
    return null;
  }

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <H5 className={css(styles.title)}>{node.label}</H5>
      <Layout.GridRow templateColumns="1fr 1fr 1fr" gap={30}>
        {children.map((node: NavigationNode) => (
          <SettingsPageCard
            key={node.label}
            node={node}
            initialData={initialData}
          />
        ))}
      </Layout.GridRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          marginBottom: 15,
        },
      }),
    []
  );
};

export default observer(SettingsGroup);
