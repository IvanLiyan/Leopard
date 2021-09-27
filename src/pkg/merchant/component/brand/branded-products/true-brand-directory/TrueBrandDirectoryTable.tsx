import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import TrueBrandDirectoryItem from "./TrueBrandDirectoryItem";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TrueBrandObject } from "@merchant/component/brand/branded-products/BrandSearch";

export type TrueBrandDirectoryTableProps = BaseProps & {
  readonly absBrandIds: ReadonlyArray<string>;
  readonly brands: ReadonlyArray<TrueBrandObject>;
};

const TrueBrandDirectoryTable = ({
  style,
  brands,
  absBrandIds,
}: TrueBrandDirectoryTableProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(style, styles.table)}>
      {brands.map((brand) => (
        <TrueBrandDirectoryItem
          key={brand.id}
          brand_id={brand.id}
          brand_name={brand.displayName}
          logo_url={brand.logoUrl}
          showAbsb={absBrandIds.includes(brand.id)}
        />
      ))}
    </div>
  );
};

export default TrueBrandDirectoryTable;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        table: {
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
          placeItems: "stretch",
        },
      }),
    []
  );
