/*
 * SelectWarehouseRegion.tsx
 *
 * Created by Sola Ogunsakin on Wed Apr 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";

import {
  H5,
  Text,
  Table,
  Layout,
  CellInfo,
  Accordion,
} from "@ContextLogic/lego";
import CreateShippingPlanState from "@merchant/model/fbw/CreateShippingPlanState";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedAvailableWarehouse } from "@toolkit/fbw/create-shipping-plan";

import WarehouseRegionButton from "./WarehouseRegionButton";

type Props = BaseProps & {
  readonly state: CreateShippingPlanState;
};

const SelectWarehouseRegion: React.FC<Props> = ({
  state,
  style,
  className,
}: Props) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const styles = useStylesheet();
  const { availableWarehouses } = state;

  return (
    <Layout.FlexColumn className={css(style, className)}>
      <H5>Select warehouse region</H5>
      <Text className={css(styles.paragraph)}>
        FBW offers multiple warehouses across the U.S. and European regions, so
        you can choose the right warehouse(s) to receive and store your
        inventory. If you ship your products to various countries across the
        U.S. and Europe, consider selecting multiple FBW warehouses to stock
        inventory for faster logistics and lower shipping costs.
      </Text>
      <Layout.GridRow
        gap={10}
        templateColumns="repeat(4, 1fr)"
        className={css(styles.buttonsGrid)}
      >
        {availableWarehouses.map((warehouse) => (
          <WarehouseRegionButton
            key={warehouse.id}
            warehouse={warehouse}
            state={state}
          />
        ))}
      </Layout.GridRow>
      <Accordion
        isOpen={detailsOpen}
        onOpenToggled={setDetailsOpen}
        header={i`Show more details`}
        chevronLocation="left"
        chevronSize={12}
      >
        <Table data={availableWarehouses}>
          <Table.Column title={i`Region`} align="center" columnKey="region" />
          <Table.Column title={i`Warehouse`} align="center" columnKey="name" />
          <Table.NumeralColumn
            title={i`Estimated Fulfillment Time (days)`}
            align="center"
            columnKey="estimatedFulfillTime.days"
          />
          <Table.NumeralColumn
            title={i`Max Weight (kg)`}
            align="center"
            columnKey="maxWeight.kg"
          />
          <Table.LinkColumn
            title={i`Fee`}
            text={i`Click to View Fees`}
            columnKey="feeLink"
            href={({ value }: CellInfo<string, PickedAvailableWarehouse>) =>
              value
            }
            openInNewTab
          />
        </Table>
      </Accordion>
    </Layout.FlexColumn>
  );
};

export default observer(SelectWarehouseRegion);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        description: {
          margin: "15px 0px 25px 0px",
        },
        paragraph: {
          margin: "10px 0",
        },
        buttonsGrid: {
          margin: "15px 0",
        },
      }),
    []
  );
};
