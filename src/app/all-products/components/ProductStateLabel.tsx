/*
 * ProductStateLabel.tsx
 *
 * Created by Jonah Dlin on Wed Apr 27 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Label, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import {
  CommerceProductListingState,
  CommerceProductListingStateReason,
} from "@schema";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import Icon from "@core/components/Icon";
import { PickedProduct } from "@all-products/toolkit";
import { merchFeUrl } from "@core/toolkit/router";

const LabelTitle: { readonly [T in CommerceProductListingState]: string } = {
  ACTIVE: ci18n(
    "Status of a product, means the product is active on Wish",
    "Active",
  ),
  WISH_INACTIVE: ci18n(
    "Status of a product, means the product is not active on wish because it was taken off by an action from Wish",
    "Wish Inactive",
  ),
  MERCHANT_INACTIVE: ci18n(
    "Status of a product, means the product is not active on wish because it was taken off by an action from the merchant",
    "Merchant Inactive",
  ),
  REMOVED_BY_WISH: ci18n(
    "Status of a product, means the product is not currently displayed on Wish",
    "Removed by Wish",
  ),
  REMOVED_BY_MERCHANT: ci18n(
    "Status of a product, means the product is not currently displayed on Wish",
    "Removed by Merchant",
  ),
};

const ReasonText: {
  readonly [T in CommerceProductListingStateReason]: (
    product: PickedProduct,
  ) => string;
} = {
  // disabling lint, naming convention here forced by types.ts
  /* eslint-disable @typescript-eslint/naming-convention */
  NEW_LISTING_UNDER_REVIEW: () =>
    i`The new listing is currently under review. It will be available for ` +
    i`sale once it is approved.`,
  LISTING_UNDER_REVIEW: () =>
    i`The listing is currently under review. It will be available for sale ` +
    i`once it is approved.`,
  NEW_LISTING_BLOCKED: () =>
    i`New listing was blocked and is not available for sale.`,
  LISTING_BLOCKED: (product) =>
    i`Listing was blocked and is not available for sale. [View blocked reason](${merchFeUrl(
      `/products/listing-status/${product.id}`,
    )})`,
  REMOVED_BY_WISH: () => i`Wish has removed the listing.`,
  REMOVED_BY_MERCH: () => i`You have removed the listing.`,
  MERCH_INACTIVE: () =>
    i`You took action to make this listing unavailable for sale.`,
  MERCH_INACTIVE_AND_PENDING_EDIT: () =>
    i`You took action to make this listing unavailable for sale. Pending ` +
    i`edits are under review.`,
  // MERCH_INACTIVE_AND_BLOCKED_EDIT to be deprecated
  MERCH_INACTIVE_AND_BLOCKED_EDIT: () =>
    i`Listing is not available for sale per merchant ` +
    i`action. Last listing edit was blocked.`,
  NOT_AVAILABLE: () => i`Listing is not available for sale.`,
  AVAILABLE: () => i`Listing is approved and available for sale.`,
  AVAILABLE_AND_PENDING_EDIT: () =>
    i`The listing is available for sale, but some edits may still be under review.`,
  AVAILABLE_AND_BLOCKED_EDIT: (product) =>
    i`The listing is available for sale, but the last listing edit was ` +
    i`blocked. [View blocked reason](${merchFeUrl(
      `/products/listing-status/${product.id}`,
    )})`,
  /* eslint-enable @typescript-eslint/naming-convention */
};

type Props = BaseProps & {
  readonly product: PickedProduct;
  readonly state: CommerceProductListingState;
  readonly reason?: CommerceProductListingStateReason | null;
};

const ProductStateLabel: React.FC<Props> = ({
  className,
  style,
  product,
  state,
  reason,
}) => {
  const styles = useStylesheet();

  const { warning, positiveDark, negativeDarker, textDark, surfaceLight } =
    useTheme();

  const labelCircleColor: {
    readonly [T in CommerceProductListingState]: string;
  } = {
    ACTIVE: positiveDark,
    WISH_INACTIVE: warning,
    MERCHANT_INACTIVE: warning,
    REMOVED_BY_WISH: negativeDarker,
    REMOVED_BY_MERCHANT: negativeDarker,
  };

  return (
    <Label
      style={[styles.root, className, style]}
      borderRadius={4}
      backgroundColor={surfaceLight}
      textColor={textDark}
      popoverContent={reason == null ? undefined : ReasonText[reason](product)}
    >
      <Layout.FlexRow style={styles.content}>
        <div
          className={css(styles.circle, {
            backgroundColor: labelCircleColor[state],
          })}
        />
        <Text style={styles.text} weight="semibold">
          {LabelTitle[state]}
        </Text>
        <Icon name="help" color={textDark} size={16} />
      </Layout.FlexRow>
    </Label>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "4px 8px",
        },
        content: {
          gap: 4,
        },
        circle: {
          width: 8,
          height: 8,
          borderRadius: "50%",
        },
        text: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
      }),
    [textDark],
  );
};

export default observer(ProductStateLabel);
