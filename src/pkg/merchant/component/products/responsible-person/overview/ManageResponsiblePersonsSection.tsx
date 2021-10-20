/*
 * ManageResponsiblePersonsSection.tsx
 *
 * Created by Betty Chen on Apr 21 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Card,
  Layout,
  Text,
  Markdown,
  PrimaryButton,
  Accordion,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Relative Imports */
import ResponsiblePersonsTable from "./ResponsiblePersonsTable";

/* Merchant Imports */
import ResponsiblePersonAgreementModal from "@merchant/component/products/responsible-person/widgets/ResponsiblePersonAgreementModal";
import ResponsiblePersonModal from "@merchant/component/products/responsible-person/widgets/ResponsiblePersonModal";

/* Model */
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";
import { ResponsiblePersonInitialData } from "@toolkit/products/responsible-person";

type Props = BaseProps & {
  readonly initialData: ResponsiblePersonInitialData;
  readonly state: ResponsiblePersonState;
};

const ManageResponsiblePersonsSection = (props: Props) => {
  const { className, style, initialData, state } = props;
  const styles = useStylesheet();
  const { textWhite } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  if (initialData.policy?.productCompliance == null) {
    return null;
  }

  const { rpCompletedCount, rpPendingCount, rpRejectedCount } =
    initialData.policy.productCompliance;

  const marketSurveillanceLink =
    "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32019R1020";

  const needsToAcceptTerms =
    initialData.currentMerchant.merchantTermsAgreed == null ||
    !initialData.currentMerchant.merchantTermsAgreed?.agreedToEuComplianceTos;

  const onCreateRPClick = async () => {
    if (needsToAcceptTerms) {
      new ResponsiblePersonAgreementModal({
        state,
      }).render();
    } else {
      new ResponsiblePersonModal({
        isNew: true,
        state,
      }).render();
    }
  };

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <Text weight="semibold" className={css(styles.title)}>
        Responsible Persons
      </Text>
      <Card contentContainerStyle={css(styles.card)}>
        <Layout.GridRow
          templateColumns="1fr 1fr"
          smallScreenTemplateColumns="1fr"
          alignItems="stretch"
          className={css(styles.borderBottom)}
        >
          <Layout.FlexColumn className={css(styles.section)}>
            <Markdown
              className={css(styles.innerRow)}
              text={
                i`First add Responsible Persons required by [Market Surveillance Regulation ` +
                i`(EU) 2019/1020](${marketSurveillanceLink}), and then link them to your products.`
              }
              openLinksInNewTab
            />
            <PrimaryButton
              onClick={onCreateRPClick}
              className={css(styles.button, styles.innerRow)}
            >
              Add new Responsible Person
            </PrimaryButton>
          </Layout.FlexColumn>
          <Layout.FlexColumn className={css(styles.section, styles.borderLeft)}>
            <Layout.FlexRow className={css(styles.innerRow)}>
              <Layout.FlexRow className={css(styles.iconGroup)}>
                <Icon name="greenCheckmarkSolid" className={css(styles.icon)} />
                <Text weight="semibold">Completed Responsible Persons</Text>
              </Layout.FlexRow>
              <Text className={css(styles.iconGroup)}>{rpCompletedCount}</Text>
            </Layout.FlexRow>

            <Layout.FlexRow className={css(styles.innerRow)}>
              <Layout.FlexRow className={css(styles.iconGroup)}>
                <Icon name="clock" className={css(styles.icon)} />
                <Text weight="semibold">
                  Responsible Persons Pending Review
                </Text>
              </Layout.FlexRow>
              <Text className={css(styles.iconGroup)}>{rpPendingCount}</Text>
            </Layout.FlexRow>

            <Layout.FlexRow className={css(styles.innerRow)}>
              <Layout.FlexRow className={css(styles.iconGroup)}>
                <Icon name="redXSolid" className={css(styles.icon)} />
                <Text weight="semibold">Rejected Responsible Persons</Text>
              </Layout.FlexRow>
              <Text className={css(styles.iconGroup)}>{rpRejectedCount}</Text>
            </Layout.FlexRow>
          </Layout.FlexColumn>
        </Layout.GridRow>
        <Accordion
          header={i`View all Responsible Persons`}
          onOpenToggled={(isOpen) => {
            setIsOpen(isOpen);
          }}
          isOpen={isOpen}
          headerPadding="12px 25px"
          hideLines={false}
          backgroundColor={textWhite}
        >
          <ResponsiblePersonsTable initialData={initialData} state={state} />
        </Accordion>
      </Card>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        card: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        section: {
          flex: 1,
          padding: 24,
        },
        innerRow: {
          ":not(:last-child)": {
            marginBottom: 30,
          },
        },
        title: {
          fontSize: 24,
          lineHeight: "28px",
          letterSpacing: "0.01em",
          marginBottom: 16,
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
        button: {
          width: "50%",
        },
      }),
    [borderPrimary, textBlack],
  );
};

export default observer(ManageResponsiblePersonsSection);
