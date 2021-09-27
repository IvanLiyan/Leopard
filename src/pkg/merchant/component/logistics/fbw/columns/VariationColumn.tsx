//
//  logistics/fbw/columns/VariationColumn.js
//
//  Created by Nicholas Huang on 11/27/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { ObjectId } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

import { BasicColumnProps } from "@ContextLogic/lego";

export type VariationColumnProps = BasicColumnProps & {
  readonly imageSize?: number | null | undefined;
  readonly fontSize?: number | null | undefined;
  readonly productKey: string;
  readonly variationKey: string;
  readonly variationNameKey: string;
};

const VariationColumn = observer((props: VariationColumnProps) => {
  const {
    imageSize,
    fontSize,
    productKey,
    variationKey,
    variationNameKey,
    ...otherProps
  } = props;
  const styles = useStylesheet(props);

  // _.get() is needed here because of the nested dynamic access.
  // Can't be accomplished with optional chaining.

  /* eslint-disable local-rules/no-unnecessary-use-of-lodash */
  return (
    <Table.Column {...otherProps}>
      {({ row }) => (
        <div className={css(styles.productVariation)}>
          <ProductImage
            className={css(styles.productImage)}
            productId={_.get(row, productKey)}
          />
          <section className={css(styles.identifiers)}>
            <div className={css(styles.identifier)}>
              <ObjectId
                id={_.get(row, variationKey)}
                style={{ paddingTop: 0 }}
                showFull
              />
            </div>
            <div className={css(styles.identifier)}>
              {_.get(row, variationNameKey)}
            </div>
          </section>
        </div>
      )}
    </Table.Column>
  );
});

export default VariationColumn;

const useStylesheet = ({ imageSize, fontSize }: VariationColumnProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        productVariation: {
          display: "flex",
          flexDirection: "row",
          padding: "10px 0px",
        },
        productImage: {
          width: imageSize || 55,
          height: imageSize || 55,
        },
        identifiers: {
          display: "flex",
          flexDirection: "column",
          marginLeft: 8,
          verticalAlign: "top",
        },
        identifier: {
          color: palettes.textColors.Ink,
          fontSize: fontSize || 14,
          textOverflow: "ellipsis",
        },
      }),
    [imageSize, fontSize]
  );
};
