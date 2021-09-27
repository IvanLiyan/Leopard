import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Markdown, H4Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Components */
import {
  RestrictedProductCategoryProps,
  startApplication,
} from "@merchant/component/policy/restricted-product/RestrictedProduct";
import ProductCategoryIcon from "@merchant/component/policy/restricted-product/ProductCategoryIcon";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type RestrictedProductUnverifiedContentProps = BaseProps & {
  readonly restrictedProductCategories: RestrictedProductCategoryProps[];
};

const RestrictedProductVerifiedContent = ({
  style,
  restrictedProductCategories,
}: RestrictedProductUnverifiedContentProps) => {
  const styles = useStylesheet();
  return (
    <Card style={style} contentContainerStyle={css(styles.root)}>
      <H4Markdown
        className={css(styles.header)}
        text={i`Apply to sell restricted product categories`}
      />
      <Markdown
        className={css(styles.welcomeText)}
        text={
          i`If you are interested in selling products from the following categories, ` +
          i`fill out the application and add your restricted product listings.`
        }
      />
      <div className={css(style, styles.table)}>
        {restrictedProductCategories.map(
          (restrictedProductCategory: RestrictedProductCategoryProps) => (
            <ProductCategoryIcon
              restrictedProductCategory={restrictedProductCategory}
            />
          )
        )}
      </div>
      <PrimaryButton
        popoverStyle={css(styles.button)}
        onClick={startApplication}
      >
        Apply
      </PrimaryButton>
    </Card>
  );
};

export default observer(RestrictedProductVerifiedContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 24,
          alignItems: "center",
          textAlign: "center",
        },
        header: {
          fontSize: 20,
        },
        welcomeText: {
          fontSize: 16,
          lineHeight: 1.4,
          padding: "8px 0px",
          maxWidth: 680,
        },
        table: {
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, 80px)",
          gap: 20,
          placeItems: "stretch",
          justifyContent: "center",
        },
        tableText: {
          fontSize: 14,
          padding: "8px 0px",
        },
        button: {
          display: "flex",
          maxWidth: 200,
          minHeight: 40,
          marginTop: 32,
          marginBottom: 32,
          alignItems: "center",
        },
      }),
    []
  );
