/*
 * ResponsiblePersonContainer.tsx
 *
 * Created by Betty Chen on Apr 21 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown, Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { zendeskURL } from "@toolkit/url";

/* Merchant Components */
import {
  WelcomeHeader,
  PageGuide,
  DEPRECATEDIcon as Icon,
} from "@merchant/component/core";
import ManageResponsiblePersonsSection from "@merchant/component/products/responsible-person/overview/ManageResponsiblePersonsSection";
import EuComplianceProductsSection from "@merchant/component/products/responsible-person/overview/EuComplianceProductsSection";
import InfoCards from "@merchant/component/products/responsible-person/overview/InfoCards";
import ResponsiblePersonAgreementModal from "@merchant/component/products/responsible-person/widgets/ResponsiblePersonAgreementModal";

/* Model */
import { ResponsiblePersonInitialData } from "@toolkit/products/responsible-person";
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";

type Props = BaseProps & {
  readonly initialData: ResponsiblePersonInitialData;
};

const ResponsiblePersonContainer = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const [state] = useState(new ResponsiblePersonState());

  const newRegulationLink =
    "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32019R1020";
  const learnMoreLink = zendeskURL("1260805801570");

  const needsToAcceptTerms =
    initialData.currentMerchant.merchantTermsAgreed == null ||
    !initialData.currentMerchant.merchantTermsAgreed?.agreedToEuComplianceTos;

  if (needsToAcceptTerms) {
    new ResponsiblePersonAgreementModal({
      state,
    }).render();
  }

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <WelcomeHeader
        title={i`EU Product Compliance`}
        illustration="thirdPartyBrandedGoodsDeclaration"
        body={() => (
          <>
            <Markdown
              text={
                i`Starting July 2021, a new regulation called [Market Surveillance Regulation ` +
                i`(EU) 2019/1020](${newRegulationLink}) will take effect. This new regulation requires the ` +
                i`presence of a Responsible Person located in the European Union (EU) as the ` +
                i`point of contact for each CE-marked product. [Learn more](${learnMoreLink})`
              }
              className={css(styles.markdown)}
              openLinksInNewTab
            />
            <Layout.FlexRow className={css(styles.warning)}>
              <Icon name="warningFilled" className={css(styles.icon)} />
              <Text>
                Your product impressions (and in effect, sales) in the EU and
                Northern Ireland for CE-marked or relevant products will be
                blocked if a Responsible Person has not been linked by July 9,
                2021.
              </Text>
            </Layout.FlexRow>
          </>
        )}
        hideBorder
      />
      <PageGuide>
        <InfoCards className={css(styles.sectionTop)} />
        <ManageResponsiblePersonsSection
          initialData={initialData}
          state={state}
          className={css(styles.section)}
        />
        <EuComplianceProductsSection
          initialData={initialData}
          state={state}
          className={css(styles.section)}
        />
      </PageGuide>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
          color: textBlack,
        },
        sectionTop: {
          marginTop: 38,
        },
        section: {
          marginTop: 64,
        },
        markdown: {
          marginTop: 9,
        },
        warning: {
          backgroundColor: pageBackground,
          padding: 16,
          marginTop: 16,
        },
        icon: {
          height: 15,
          marginRight: 16,
        },
      }),
    [pageBackground, textBlack]
  );
};

export default observer(ResponsiblePersonContainer);
