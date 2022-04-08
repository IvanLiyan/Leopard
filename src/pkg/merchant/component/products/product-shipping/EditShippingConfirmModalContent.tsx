/*
 *
 * EditShippingConfirmModalContent.tsx
 *
 * Created by Joyce Ji on 9/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import CountryFlagsGroup from "@merchant/component/products/product-shipping/CountryFlagsGroup";

/* Type Imports */
import ProductShippingEditState from "@merchant/model/products/ProductShippingEditState";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly editState: ProductShippingEditState;
};

const EditShippingConfirmModalContent: React.FC<Props> = ({
  editState,
}: Props) => {
  const styles = useStylesheet();
  const {
    showDefaultShippingConfirmation,
    showDisableDomesticShippingConfirmation,
    showTTDColumn,
    unityEffectiveDateStandardWarehouse,
  } = editState;

  const { productId } = usePathParams(
    "/product-shipping/:productId/:warehouseId"
  );

  const unityDescription = unityEffectiveDateStandardWarehouse
    ? i`By disabling shipping to the following destination ` +
      i`countries included in the unification initiative, you ` +
      i`will stop receiving orders from these countries for this ` +
      i`product (ID: ...${productId.substring(19)}) starting ` +
      i`${unityEffectiveDateStandardWarehouse} as the effective date indicates.`
    : i`By disabling shipping to the following destination ` +
      i`countries included in the unification initiative, you will no longer ` +
      i`receive orders from these countries for this product (ID: ...${productId.substring(
        19
      )}), ` +
      i`including high-GMV countries supported by the Advanced Logistics Program. ` +
      i`You will no longer be able to leverage Wish's unique logistics setup ` +
      i`that helps you ship to these countries speedily and at a competitive price.`;

  return (
    <div className={css(styles.root)}>
      {showDefaultShippingConfirmation != null && showTTDColumn && (
        <p>
          The customized Shipping Price and customized Max Delivery Days will be
          applied for that corresponding enabled destination country. The
          Default Shipping Price is used for new destination countries added or
          for enabled countries where the Shipping Price has not been
          customized.
        </p>
      )}
      {showDefaultShippingConfirmation != null && !showTTDColumn && (
        <p>
          The customized Shipping Price will be applied for that corresponding
          enabled destination country. The Default Shipping Price is used for
          new destination countries added or for enabled countries where the
          Shipping Price has not been customized.
        </p>
      )}

      {showDisableDomesticShippingConfirmation && (
        <>
          <div className={css(styles.graph)}>{unityDescription}</div>
          <Text weight="bold">
            Destination countries included in Wish’s shipping unification
            initiative:
          </Text>
          <CountryFlagsGroup editState={editState} />{" "}
        </>
      )}
    </div>
  );
};

export default observer(EditShippingConfirmModalContent);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 20,
        },
        graph: {
          paddingBottom: 20,
        },
      }),
    []
  );
};
