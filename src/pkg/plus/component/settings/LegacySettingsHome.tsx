/*
 * SettingsHome.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/02/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { NavigationNode } from "@toolkit/chrome";

import { Layout } from "@ContextLogic/lego";
import { useNavigationStore } from "@stores/NavigationStore";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import SettingsGroup from "@plus/component/settings/settings-home/SettingsGroup";

import SettingsPageCard from "@plus/component/settings/settings-home/SettingsPageCard";

import { SettingsHomeInitialData } from "@toolkit/settings-home";

type Props = {
  readonly initialData: SettingsHomeInitialData;
};

const SettingsHome: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const { userGraph } = useNavigationStore();

  const moreNode = useMemo(
    () => userGraph?.children.find((node) => node.nodeid == "more"),
    [userGraph],
  );

  const nonGroupChildren = useMemo(
    () =>
      moreNode?.children.filter(
        (node) =>
          node.show_in_side_menu &&
          (node.url || node.path) &&
          node.children.find((item) => item.show_in_side_menu) == null,
      ),
    [moreNode],
  );

  const groupChildren = useMemo(
    () =>
      moreNode?.children.filter(
        (node) =>
          node.show_in_side_menu &&
          node.children.find((item) => item.show_in_side_menu) != null,
      ),
    [moreNode],
  );

  if (moreNode == null || nonGroupChildren == null || groupChildren == null) {
    return null;
  }

  return (
    <PageRoot>
      <PageGuide>
        <Layout.FlexColumn>
          <Layout.GridRow templateColumns="1fr 1fr 1fr" gap={30}>
            {nonGroupChildren.map((node: NavigationNode) => {
              return (
                <SettingsPageCard
                  key={node.label}
                  node={node}
                  initialData={initialData}
                />
              );
            })}
          </Layout.GridRow>
          {groupChildren.map((node: NavigationNode) => {
            return (
              <SettingsGroup
                key={node.label}
                node={node}
                initialData={initialData}
                className={css(styles.group)}
              />
            );
          })}
        </Layout.FlexColumn>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        group: {
          marginTop: 40,
        },
      }),
    [],
  );
};

export default observer(SettingsHome);
