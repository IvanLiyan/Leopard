import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Merchant Components */
import { RestrictedProductCategoryProps } from "@merchant/component/policy/restricted-product/RestrictedProduct";
import RPApplicationState from "@merchant/model/policy/restricted-product/RPApplicationState";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { whiteCheckmarkBlueFill } from "@assets/icons";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ProductCategoryCardProps = BaseProps & {
  readonly productCategory: RestrictedProductCategoryProps;
  readonly currentApplication: RPApplicationState;
};

const ProductCategoryCard = ({
  productCategory,
  currentApplication,
}: ProductCategoryCardProps) => {
  const active: boolean = useMemo(() => {
    return productCategory.state == null || productCategory.state == "REJECTED";
  }, [productCategory]);

  const [illustrationName, setIllustrationName] = useState(
    productCategory.rawImage
  );

  const [selected, setSelected] = useState(
    currentApplication.categories.includes(productCategory.category)
  );

  const onMouseEnter = () => {
    if (active && !selected) {
      setIllustrationName(productCategory.colorImage);
    }
  };
  const onMouseLeave = () => {
    if (active && !selected) {
      setIllustrationName(productCategory.rawImage);
    }
  };

  const selectProdcutToggle = () => {
    if (!active) {
      return;
    }
    setSelected(!selected);
  };

  useEffect(() => {
    if (selected) {
      setIllustrationName(productCategory.colorImage);
      currentApplication.addCategory(productCategory.category);
    } else {
      currentApplication.removeCategory(productCategory.category);
    }
  }, [
    selected,
    currentApplication,
    productCategory.category,
    productCategory.colorImage,
  ]);

  const styles = useStylesheet(active);

  return (
    <Card
      className={css(styles.card)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => selectProdcutToggle()}
    >
      <div className={css(styles.content)}>
        {selected && (
          <img src={whiteCheckmarkBlueFill} className={css(styles.checked)} />
        )}
        <Illustration
          className={css(styles.image)}
          name={illustrationName}
          alt={productCategory.title}
        />
        <div className={css(styles.tableText)}>{productCategory.title}</div>
      </div>
    </Card>
  );
};

export default ProductCategoryCard;

const useStylesheet = (active: boolean) => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          ...(!active
            ? {
                opacity: 0.5,
              }
            : {
                ":hover": {
                  borderColor: primary,
                  boxShadow: "0 4px 8px 0 rgba(175, 199, 209, 0.4)",
                },
              }),
        },
        content: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 10,
        },
        checked: {
          position: "absolute",
          top: "6px",
          right: "6px",
        },
        image: {
          maxHeight: 80,
          maxWidth: 80,
        },
        tableText: {
          fontSize: 14,
          padding: "8px 0px",
        },
      }),
    [active, primary]
  );
};
