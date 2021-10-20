/*
 * SelectSKUs.tsx
 *
 * Created by Sola Ogunsakin on Wed Apr 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import { css } from "@toolkit/styling";

import {
  Text,
  Table,
  Layout,
  Popover,
  CellInfo,
  NumericInput,
  SimpleSelect,
  PageIndicator,
  PrimaryButton,
} from "@ContextLogic/lego";
import { RequiredValidator } from "@toolkit/validators";
import EmptyState from "./EmptyState";
import VariationSKUColumn, { VARIATION_ICON_WIDTH } from "./VariationSKUColumn";
import SelectVariationsModal from "./SelectVariationsModal";
import CreateShippingPlanState, {
  VariationState,
} from "@merchant/model/fbw/CreateShippingPlanState";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly state: CreateShippingPlanState;
};

const InputHeight = 30;
const LimitOptions = [10, 50, 100, 250];

const SelectSKUs: React.FC<Props> = ({ state, style, className }: Props) => {
  const styles = useStylesheet();
  const [limit, setLimit] = useState(LimitOptions[0]);
  const [offset, setOffset] = useState(0);

  const { selectedWarehouses, selectedVariations } = state;
  const totalVariationCount = selectedVariations.length;
  const visibleVariations = selectedVariations.slice(offset, offset + limit);

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  return (
    <Layout.FlexColumn style={[style, className]}>
      <Layout.FlexColumn alignItems="flex-start">
        <Text weight="bold">Select SKUs</Text>
        <Text style={styles.description}>
          Select the product SKUs you would like to include in this shipping
          plan. Note that SKUs that are approved and enabled are eligible to be
          added to a shipping plan.
        </Text>
        <PrimaryButton
          onClick={async () => new SelectVariationsModal({ state }).render()}
        >
          Select SKUs
        </PrimaryButton>
      </Layout.FlexColumn>
      <Layout.FlexRow justifyContent="space-between" style={styles.controlsRow}>
        <Text weight="bold">Selected SKUs: {selectedVariations.length}</Text>
        <Layout.FlexRow justifyContent="flex-end">
          <PageIndicator
            style={styles.pageIndicator}
            rangeStart={offset + 1}
            rangeEnd={Math.min(
              totalVariationCount ?? 0,
              offset + visibleVariations.length,
            )}
            hasNext={
              totalVariationCount != null &&
              offset + visibleVariations.length < totalVariationCount
            }
            hasPrev={offset > 0}
            currentPage={Math.ceil(offset / limit)}
            totalItems={totalVariationCount}
            onPageChange={onPageChange}
          />
          <SimpleSelect
            options={LimitOptions.map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(value: string) => {
              setLimit(parseInt(value));
            }}
            style={styles.limitSelect}
            selectedValue={limit.toString()}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>

      <Table
        data={visibleVariations}
        noDataMessage={() => <EmptyState />}
        actions={[
          {
            key: "remove",
            name: i`Remove`,
            apply([{ variation }]: ReadonlyArray<VariationState>) {
              state.deselectVariation(variation);
            },
            canApplyToRow: () => true,
          },
        ]}
      >
        <Table.Column
          columnKey="variation.sku"
          title={() => (
            <div className={css({ marginLeft: VARIATION_ICON_WIDTH })}>
              Variation SKU
            </div>
          )}
        >
          {({
            row: { variation },
          }: CellInfo<VariationState, VariationState>) => (
            <VariationSKUColumn variation={variation} />
          )}
        </Table.Column>
        <Table.Column
          columnKey="variation.productName"
          title={i`Product name`}
        />
        {selectedWarehouses.map((warehouse) => (
          <Table.Column
            key={warehouse.id}
            columnKey="inventoryByWarehouseId"
            title={warehouse.name}
            width={120}
            align="center"
          >
            {({ row: state }: CellInfo<VariationState, VariationState>) => {
              return (
                <Layout.GridRow
                  alignItems="center"
                  gap={5}
                  templateColumns="4fr 1fr"
                >
                  <NumericInput
                    value={state.inventoryByWarehouseId.get(warehouse.id)}
                    incrementStep={1}
                    onChange={({ valueAsNumber }) =>
                      state.inventoryByWarehouseId.set(
                        warehouse.id,
                        Math.max(valueAsNumber || 0, 0),
                      )
                    }
                    validators={[new RequiredValidator()]}
                    style={styles.numericInput}
                  />

                  <Popover
                    popoverContent={i`Quantity of active inventory for this SKU currently stocked in ${warehouse.name}`}
                    position="top center"
                    popoverMinWidth={200}
                    popoverMaxWidth={250}
                  >
                    <Text style={styles.activeInventoryCount}>
                      {`(${numeral(state.getActiveInventory(warehouse.id))
                        .format("0,0")
                        .toString()})`}
                    </Text>
                  </Popover>
                </Layout.GridRow>
              );
            }}
          </Table.Column>
        ))}
      </Table>
    </Layout.FlexColumn>
  );
};

export default observer(SelectSKUs);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        description: {
          margin: "10px 0",
        },
        pageIndicator: {
          height: InputHeight,
        },
        limitSelect: {
          marginLeft: 10,
          flex: 0,
          minWidth: 60, // hack for Safari, which is having flexbox issues. TODO (lliepert): figure out the root cause
          textAlignLast: "center", // `last` required for <select>, see https://stackoverflow.com/questions/45215504/text-align-not-working-on-select-control-on-chrome/45215594
        },
        controlsRow: {
          margin: "10px 0",
        },
        activeInventoryCount: {
          color: textLight,
          fontSize: 15,
        },
        numericInput: {
          width: 120,
        },
      }),
    [textLight],
  );
};
