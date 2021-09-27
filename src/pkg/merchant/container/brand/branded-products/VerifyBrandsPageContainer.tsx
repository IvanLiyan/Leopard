import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";
import { Breadcrumbs, BreadcrumbItem } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import VerifyBrandsPage from "@merchant/component/brand/branded-products/verify-brands/VerifyBrandsPage";

const VerifyBrandsPageContainer = () => {
  const styles = useStylesheet();

  const breadcrumbs: ReadonlyArray<BreadcrumbItem> = [
    {
      name: i`Branded Products`,
      href: "/branded-products",
    },
    {
      name: i`Verify Brands`,
      href: "/branded-products/verify-brands",
    },
  ];

  return (
    <PageGuide>
      <Breadcrumbs items={breadcrumbs} />
      <H4Markdown className={css(styles.title)} text={i`Verify Brands`} />
      <VerifyBrandsPage />
    </PageGuide>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        title: {
          marginTop: 16,
          marginBottom: 24,
          height: 32,
          lineHeight: 1.33,
        },
      }),
    []
  );

export default observer(VerifyBrandsPageContainer);
