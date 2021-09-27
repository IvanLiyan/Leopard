/*
 *
 * ShippingProfileOption.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Link } from "@ContextLogic/lego";

import RadioSection from "@plus/component/products/edit-product/sections/RadioSection";
import ShippingProfileSummary from "@plus/component/settings/shipping-settings/shipping-profile/ShippingProfileSummary";
import EditShippingProfileModal from "@plus/component/settings/shipping-settings/shipping-profile/EditShippingProfileModal";
import CreateShippingProfileModal from "@plus/component/settings/shipping-settings/shipping-profile/CreateShippingProfileModal";

import { PickedShippingProfileSchema } from "@toolkit/product-edit";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly shippingProfile: PickedShippingProfileSchema;
};

const ShippingProfileOption = (props: Props) => {
  const {
    className,
    style,
    shippingProfile: { id, name, description },
  } = props;

  const styles = useStylesheet();
  return (
    <RadioSection
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
      checked
    >
      <ShippingProfileSummary name={name} description={description} isExpress />
      <div className={css(styles.rightSide)}>
        <Link
          onClick={() =>
            new EditShippingProfileModal({
              profileId: id,
            }).render()
          }
        >
          Edit
        </Link>
        <div className={css(styles.spacer)}>∙</div>
        <Link
          onClick={() =>
            new CreateShippingProfileModal({
              sourceProfileId: id,
            }).render()
          }
        >
          Duplicate
        </Link>
      </div>
    </RadioSection>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        },
        rightSide: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "10px 0px",
        },
        spacer: {
          margin: "0px 5px",
        },
      }),
    [],
  );
};

export default observer(ShippingProfileOption);
