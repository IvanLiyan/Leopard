/*
 * EuComplianceProductsSection.tsx
 *
 * Created by Betty Chen on Apr 21 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { zendeskURL } from "@toolkit/url";

import Icon from "@merchant/component/core/DEPRECATED_Icon";

/* Relative Imports */
import EuProductsTable from "./EuProductsTable";

/* Model */
import { ResponsiblePersonInitialData } from "@toolkit/products/responsible-person";
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";

type Props = BaseProps & {
  readonly initialData: ResponsiblePersonInitialData;
  readonly state: ResponsiblePersonState;
};

const EuComplianceProductsSection = (props: Props) => {
  const { className, style, initialData, state } = props;
  const styles = useStylesheet();

  if (initialData.policy?.productCompliance == null) {
    return null;
  }

  const { productsWithRpCount, productsNoRpCount } =
    initialData.policy.productCompliance;

  const learnMoreLink = zendeskURL("1260805801570");

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Text weight="semibold" className={css(styles.title)}>
        Relevant Products
      </Text>
      <Layout.FlexColumn
        justifyContent="flex-start"
        className={css(styles.container)}
      >
        <Layout.GridRow
          templateColumns="1fr 1fr"
          smallScreenTemplateColumns="1fr"
          alignItems="stretch"
          className={css(styles.borderBottom)}
        >
          <Layout.FlexColumn className={css(styles.column)}>
            <Markdown
              text={
                i`Link each product below to an already-added Responsible Person, per steps ` +
                i`above. [Learn More](${learnMoreLink})`
              }
              openLinksInNewTab
            />
          </Layout.FlexColumn>
          <Layout.FlexColumn className={css(styles.borderLeft, styles.column)}>
            <Layout.FlexRow className={css(styles.innerRow)}>
              <Layout.FlexRow className={css(styles.iconGroup)}>
                <Icon name="greenCheckmarkSolid" className={css(styles.icon)} />
                <Text weight="semibold">Products with Responsible Persons</Text>
              </Layout.FlexRow>
              <Text className={css(styles.iconGroup)}>
                {productsWithRpCount}
              </Text>
            </Layout.FlexRow>

            <Layout.FlexRow>
              <Layout.FlexRow className={css(styles.iconGroup)}>
                <Icon name="warningFilled" className={css(styles.icon)} />
                <Text weight="semibold">
                  Products without Responsible Persons*
                </Text>
              </Layout.FlexRow>
              <Text className={css(styles.iconGroup)}>{productsNoRpCount}</Text>
            </Layout.FlexRow>
            <Text style={[styles.subText]}>
              *Toys, Electronics, Electrical Products, and PPE products subject
              to impression block without Responsible Person.
            </Text>
          </Layout.FlexColumn>
        </Layout.GridRow>

        <EuProductsTable initialData={initialData} state={state} />
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textWhite, borderPrimary, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        container: {
          backgroundColor: textWhite,
          borderRadius: 4,
          border: `1px solid ${borderPrimary}`,
        },
        title: {
          fontSize: 24,
          lineHeight: "28px",
          letterSpacing: "0.01em",
          marginBottom: 16,
        },
        subText: {
          fontSize: 12,
          lineHeight: "16px",
          marginTop: 8,
        },
        borderLeft: {
          borderLeft: `1px solid ${borderPrimary}`,
          "@media (max-width: 900px)": {
            borderLeft: 0,
          },
        },
        borderBottom: {
          borderBottom: `1px solid ${borderPrimary}`,
        },
        icon: {
          marginRight: 9,
          width: 16,
          height: 16,
        },
        iconGroup: {
          flex: 1,
        },
        column: {
          flex: 1,
          padding: 24,
        },
        innerRow: {
          ":not(:last-child)": {
            marginBottom: 30,
          },
        },
      }),
    [textWhite, borderPrimary, textBlack]
  );
};

export default observer(EuComplianceProductsSection);
