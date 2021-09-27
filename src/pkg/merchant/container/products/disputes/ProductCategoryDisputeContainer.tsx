/*
 * ProductCategoryDisputeContainer.tsx
 *
 * Created by Betty Chen on June 24 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { zendeskURL } from "@toolkit/url";

/* Merchant Components */
import { WelcomeHeader, PageGuide } from "@merchant/component/core";
import ProductCategoryDisputesTable from "@merchant/component/products/disputes/ProductCategoryDisputesTable";

/* Model */
import { ProductCategoryDisputeInitialData } from "@toolkit/products/product-category-dispute";
import { RoleType } from "@schema/types";

type Props = {
  readonly initialData: ProductCategoryDisputeInitialData;
};

const REVIEW_ROLES: readonly RoleType[] = [
  "ADMIN",
  "IN_HOUSE_TAGGER",
  "TAGGER_LEAD",
  "ACCENTURE_TAGGER_LEAD",
  "ACCENTURE_DETAIL_WORKER",
  "ACCENTURE_DETAIL_LEAD",
];

const ProductCategoryDisputeContainer = (props: Props) => {
  const styles = useStylesheet();

  const {
    initialData: {
      currentUser: { roles },
    },
  } = props;

  const learnMoreLink = zendeskURL("4403535077403");
  const canReview =
    roles != null &&
    roles.map((role) => role.id).some((name) => REVIEW_ROLES.includes(name));

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <WelcomeHeader
        title={i`Product Category Disputes`}
        body={
          canReview
            ? undefined
            : () => (
                <Markdown
                  text={i`Track the status of your product category disputes below. [Learn more](${learnMoreLink})`}
                  style={[styles.text]}
                  openLinksInNewTab
                />
              )
        }
        illustration={canReview ? null : "palaceBlueDispute"}
        hideBorder
      />
      <PageGuide>
        <ProductCategoryDisputesTable
          canReview={canReview}
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
        section: {
          marginTop: 64,
        },
        text: {
          marginTop: 8,
        },
      }),
    [pageBackground, textBlack]
  );
};

export default observer(ProductCategoryDisputeContainer);
