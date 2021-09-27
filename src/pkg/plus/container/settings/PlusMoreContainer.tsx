/*
 * PlusMoreContainer.tsx
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

import { Card, Layout, Link, Text } from "@ContextLogic/lego";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

import {
  OverviewCategoryIcons,
  SettingsHomeInitialData,
} from "@toolkit/settings-home";
import { Icon } from "@merchant/component/core";
import { useTheme } from "@merchant/stores/ThemeStore";
import LegacySettingsHome from "@plus/component/settings/LegacySettingsHome";

type Props = {
  readonly initialData: SettingsHomeInitialData;
};

const PlusMoreContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const { userGraph } = useNavigationStore();

  const overviewNode = useMemo(
    () => userGraph?.children.find((node) => node.nodeid == "overview"),
    [userGraph]
  );

  const moreNode = useMemo(
    () => userGraph?.children.find((node) => node.nodeid == "more"),
    [userGraph]
  );

  if (moreNode != null) {
    return <LegacySettingsHome initialData={initialData} />;
  }

  if (overviewNode == null) {
    return null;
  }

  return (
    <PageRoot>
      <PageGuide className={css(styles.pageContent)}>
        <Layout.FlexColumn>
          <Text className={css(styles.pageHeader)} weight="bold">
            Overview
          </Text>
          {overviewNode.children.map((metaNode) => (
            <Layout.FlexColumn
              key={metaNode.label}
              className={css(styles.metaCategorySection)}
            >
              <Text className={css(styles.metaCategoryHeader)} weight="bold">
                {metaNode.label}
              </Text>
              <Card>
                <Layout.FlexColumn className={css(styles.cardInterior)}>
                  {metaNode.children.map((categoryNode, index) => (
                    <>
                      <Layout.GridRow
                        key={categoryNode.nodeid}
                        templateColumns="calc(20% - 18px + 20px) calc(80% - 18px)"
                        alignItems="flex-start"
                        gap={8}
                      >
                        <Layout.GridRow
                          templateColumns="20px 1fr"
                          alignItems="center"
                          gap={12}
                        >
                          {categoryNode.nodeid != null &&
                            OverviewCategoryIcons[categoryNode.nodeid] !=
                              null && (
                              <Icon
                                name={
                                  OverviewCategoryIcons[categoryNode.nodeid]
                                }
                              />
                            )}
                          <Text
                            className={css(styles.categoryHeader)}
                            weight="semibold"
                          >
                            {categoryNode.label}
                          </Text>
                        </Layout.GridRow>
                        <Layout.GridRow
                          templateColumns="1fr 1fr 1fr"
                          gap="8px 16px"
                          style={{
                            gridAutoFlow: "column",
                            gridTemplateRows: `repeat(${Math.ceil(
                              categoryNode.children.length / 3
                            )}, max-content)`,
                          }}
                        >
                          {categoryNode.children.map((linkNode) => {
                            if (linkNode.children.length > 0) {
                              return (
                                <Layout.FlexColumn key={linkNode.label}>
                                  <Text
                                    className={css(
                                      styles.linkNodeSubLabel,
                                      styles.subLinkNodeMargin
                                    )}
                                  >
                                    {linkNode.overview_label || linkNode.label}
                                  </Text>
                                  {linkNode.children.map((subLinkNode) => (
                                    <Link
                                      key={subLinkNode.label}
                                      href={subLinkNode.path}
                                      className={css(styles.subLinkNodeMargin)}
                                    >
                                      <Text
                                        className={css(styles.pageLinkText)}
                                      >
                                        {subLinkNode.overview_label ||
                                          subLinkNode.label}
                                      </Text>
                                    </Link>
                                  ))}
                                </Layout.FlexColumn>
                              );
                            }
                            return (
                              <Link href={linkNode.path}>
                                <Text className={css(styles.pageLinkText)}>
                                  {linkNode.overview_label || linkNode.label}
                                </Text>
                              </Link>
                            );
                          })}
                        </Layout.GridRow>
                      </Layout.GridRow>
                      {index != metaNode.children.length - 1 && (
                        <div className={css(styles.horizontalSeparator)} />
                      )}
                    </>
                  ))}
                </Layout.FlexColumn>
              </Card>
            </Layout.FlexColumn>
          ))}
        </Layout.FlexColumn>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  const { textBlack, borderPrimary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pageContent: {
          paddingTop: 64,
        },
        pageHeader: {
          fontSize: 28,
          lineHeight: "32px",
          color: textBlack,
          marginBottom: 32,
        },
        metaCategoryHeader: {
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
          marginBottom: 16,
        },
        categoryHeader: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        cardInterior: {
          padding: 32,
        },
        metaCategorySection: {
          ":not(:last-child)": {
            marginBottom: 64,
          },
        },
        horizontalSeparator: {
          boxSizing: "border-box",
          height: 1,
          borderBottom: `1px solid ${borderPrimary}`,
          margin: "32px 0px",
        },
        pageLinkText: {
          fontSize: 14,
          lineHeight: "20px",
        },
        linkNodeSubLabel: {
          color: textDark,
          textTransform: "uppercase",
          fontSize: 12,
          lineHeight: "16px",
        },
        subLinkNodeMargin: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
      }),
    [textBlack, borderPrimary, textDark]
  );
};

export default observer(PlusMoreContainer);
