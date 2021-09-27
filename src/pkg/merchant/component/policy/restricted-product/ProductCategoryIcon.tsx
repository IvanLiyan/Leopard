import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Merchant Components */
import { RestrictedProductCategoryProps } from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ProductCategoryIconProps = BaseProps & {
  readonly restrictedProductCategory: RestrictedProductCategoryProps;
};

const ProductCategoryIcon = ({
  className,
  style,
  restrictedProductCategory,
}: ProductCategoryIconProps) => {
  const styles = useStylesheet();

  return (
    <div
      key={restrictedProductCategory.category}
      className={css(className, style)}
    >
      <Illustration
        name={restrictedProductCategory.circleImage}
        alt={restrictedProductCategory.title}
      />
      <div className={css(styles.tableText)}>
        {restrictedProductCategory.title}
      </div>
    </div>
  );
};

export default ProductCategoryIcon;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        tableText: {
          fontSize: 14,
          padding: "8px 0px",
        },
      }),
    [],
  );
