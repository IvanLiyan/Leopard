import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { H5, H7, Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const AddProductsCard: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();

  return (
    <Card
      className={css(style, className)}
      contentContainerStyle={css(styles.root)}
    >
      <Illustration
        name="productsCloud"
        alt="add products"
        className={css(styles.illustration)}
      />
      <div className={css(styles.content)}>
        <H5>List multiple products with a single spreadsheet</H5>
        <H7 style={css(styles.description)}>
          Upload a spreadsheet to add multiple product listings to your store at
          a time.
        </H7>
        <PrimaryButton href="/plus/products/bulk-add-edit">
          Get Started
        </PrimaryButton>
      </div>
    </Card>
  );
};

export default AddProductsCard;

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          padding: 15,
          alignItems: "center",
        },
        illustration: {
          height: 150,
          marginRight: 15,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "flex-start",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
          },
          "@media (min-width: 900px)": {
            alignItems: "flex-start",
          },
          maxWidth: 600,
        },
        description: {
          marginTop: 10,
          marginBottom: 20,
          color: textLight,
          fontSize: 17,
        },
      }),
    [textLight]
  );
};
