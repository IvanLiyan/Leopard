import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { H6 } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import NewTrueBrandRequestModal from "@merchant/component/brand/branded-products/NewTrueBrandRequestModal";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type NoBrandsFoundProps = BaseProps & {
  readonly brand: string;
};

const NoBrandsFound = ({ style, brand }: NoBrandsFoundProps) => {
  const styles = useStylesheet();

  return (
    <Card style={style}>
      <div className={css(styles.container)}>
        <H6 style={css(styles.text)}>No results for "{brand}"</H6>
        <div className={css(styles.text)}>
          Make sure this brand name is correct, or provide brand details to add
          it as a new brand.
        </div>
        <Link
          className={css(styles.link)}
          onClick={() => {
            new NewTrueBrandRequestModal({}).render();
          }}
          isRouterLink
        >
          Request new brand
        </Link>
      </div>
    </Card>
  );
};

export default NoBrandsFound;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        text: {
          maxWidth: 400,
          textAlign: "center",
          marginBottom: 8,
        },
        link: {
          marginTop: 12,
        },
      }),
    []
  );
