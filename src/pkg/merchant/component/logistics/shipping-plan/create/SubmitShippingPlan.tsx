/*
 * SubmitShippingPlan.tsx
 *
 * Created by Sola Ogunsakin on Thurs Apr 29 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

import {
  Text,
  Table,
  Layout,
  CellInfo,
  SimpleSelect,
  PageIndicator,
} from "@ContextLogic/lego";
import VariationSKUColumn, { VARIATION_ICON_WIDTH } from "./VariationSKUColumn";
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

const SubmitShippingPlan: React.FC<Props> = ({
  state,
  style,
  className,
}: Props) => {
  const styles = useStylesheet();
  const [limit, setLimit] = useState(LimitOptions[0]);
  const [offset, setOffset] = useState(0);

  const { selectedVariations, selectedWarehouses } = state;
  const totalVariationCount = selectedVariations.length;
  const visibleVariations = selectedVariations.slice(offset, offset + limit);

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  return (
    <Layout.FlexColumn style={[style, className]}>
      <Layout.FlexColumn alignItems="flex-start">
        <Text weight="bold">Submit shipping plan</Text>
        <Text style={styles.description}>
          Before submitting your shipping plan, carefully review all details
          below or return to previous steps to modify any information as needed.
          Once submitted, this shipping plan cannot be edited.
        </Text>
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
        noDataMessage={i`Add products by clicking on the select SKUs button`}
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
            title={i`Quantity (${warehouse.code})`}
            width={120}
            align="right"
          >
            {({ row: state }: CellInfo<VariationState, VariationState>) =>
              state.inventoryByWarehouseId.get(warehouse.id)
            }
          </Table.Column>
        ))}
        <Table.Column
          columnKey="dimensions"
          title={i`Dimensions`}
          width={140}
          align="right"
        />
        <Table.Column
          columnKey="weight"
          title={i`Weight (kg)`}
          width={80}
          align="right"
        />
      </Table>
    </Layout.FlexColumn>
  );
};

export default observer(SubmitShippingPlan);

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
      }),
    [textLight],
  );
};
