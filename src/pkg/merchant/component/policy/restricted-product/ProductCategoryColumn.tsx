import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Components */
import { RestrictedProductCategoryProps } from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ProductCategoryColumnProps = BaseProps &
  Pick<RestrictedProductCategoryProps, "title" | "circleImage">;

const ProductCategoryColumn = ({
  title,
  circleImage,
}: ProductCategoryColumnProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <Illustration
        name={circleImage}
        alt={title}
        className={css(styles.icon)}
      />
      {title}
    </div>
  );
};

export default ProductCategoryColumn;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        icon: {
          margin: "12px 6px 12px 0px",
          height: "100%",
        },
      }),
    []
  );
};
