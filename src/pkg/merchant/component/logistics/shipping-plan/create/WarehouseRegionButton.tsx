/*
 * WarehouseRegionButton.tsx
 *
 * Created by Sola Ogunsakin on Wed Apr 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";

import { useTheme } from "@stores/ThemeStore";

import { Text, Layout, Checkbox } from "@ContextLogic/lego";
import { PickedAvailableWarehouse } from "@toolkit/fbw/create-shipping-plan";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import CreateShippingPlanState from "@merchant/model/fbw/CreateShippingPlanState";

type Props = BaseProps & {
  readonly state: CreateShippingPlanState;
  readonly warehouse: PickedAvailableWarehouse;
};

const WarehouseRegionButton: React.FC<Props> = ({
  style,
  state,
  warehouse,
  className,
}: Props) => {
  const { id, name, address } = warehouse;
  const isSelected = state.isSelectedWarehouse(id);
  const styles = useStylesheet({
    isSelected,
  });

  const toggleSelection = () => {
    if (isSelected) {
      state.deselectWarehouse(id);
    } else {
      state.selectWarehouse(id);
    }
  };

  const cityDisplay = address.city ? `${address.city}, ` : "";
  const stateDisplay = address.state ? `${address.state} ` : "";

  return (
    <Layout.FlexRow
      className={css(styles.root, style, className)}
      onClick={toggleSelection}
    >
      <Checkbox
        checked={isSelected}
        onChange={(newValue) => {
          toggleSelection();
        }}
        className={css(styles.checkbox)}
      />
      <Layout.FlexColumn>
        <Text weight="bold" className={css(styles.address)}>
          {name}
        </Text>
        {address.streetAddress1 && (
          <Text className={css(styles.address)}>{address.streetAddress1}</Text>
        )}
        {address.streetAddress2 && (
          <Text className={css(styles.address)}>{address.streetAddress2}</Text>
        )}
        {(cityDisplay || stateDisplay || address.zipcode) && (
          <Text className={css(styles.address)}>
            {`${cityDisplay}${stateDisplay}${address.zipcode}`}
          </Text>
        )}
        {address.country.name && (
          <Text className={css(styles.address)}>{address.country.name}</Text>
        )}
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

export default observer(WarehouseRegionButton);

const useStylesheet = ({ isSelected }: { readonly isSelected: boolean }) => {
  const { primary, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 10,
          borderRadius: 4,
          border: `1px solid ${isSelected ? primary : borderPrimary}`,
          cursor: "pointer",
          opacity: isSelected ? 1 : 0.7,
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 1,
          },
        },
        checkbox: {
          marginRight: 15,
        },
        address: {
          fontSize: 12,
        },
      }),
    [primary, borderPrimary, isSelected],
  );
};
