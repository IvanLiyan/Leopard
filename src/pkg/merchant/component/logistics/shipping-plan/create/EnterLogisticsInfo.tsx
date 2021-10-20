/*
 * EnterLogisticsInfo.tsx
 *
 * Created by Sola Ogunsakin on Thurs Apr 29 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

import { ci18n } from "@legacy/core/i18n";

import {
  Text,
  Table,
  Layout,
  CellInfo,
  NumericInput,
  SimpleSelect,
  PageIndicator,
} from "@ContextLogic/lego";
import { RequiredValidator } from "@toolkit/validators";
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

const EnterLogisticsInfo: React.FC<Props> = ({
  state,
  style,
  className,
}: Props) => {
  const styles = useStylesheet();
  const [limit, setLimit] = useState(LimitOptions[0]);
  const [offset, setOffset] = useState(0);

  const { selectedVariations } = state;
  const totalVariationCount = selectedVariations.length;
  const visibleVariations = selectedVariations.slice(offset, offset + limit);

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  return (
    <Layout.FlexColumn style={[style, className]}>
      <Layout.FlexColumn alignItems="flex-start">
        <Text weight="bold">Specify logistics info</Text>
        <Text style={styles.description}>
          Having accurate logistics information ensures that the FBW warehouse
          receives your product in a timely and efficient manner, helping you
          get your inventory on shelf faster for sale. It also ensures that you
          are charged the correct amount for shipments to your customers.
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
            <div className={css({ marginLeft: VARIATION_ICON_WIDTH * 2 })}>
              Variation SKU
            </div>
          )}
        >
          {({
            row: variationState,
          }: CellInfo<VariationState, VariationState>) => (
            <VariationSKUColumn
              variation={variationState.variation}
              onCopy={() => {
                state.updateAllVariations(variationState);
              }}
              copyDisabled={!variationState.canCopy}
            />
          )}
        </Table.Column>
        <Table.Column
          columnKey="variation.productName"
          title={i`Product name`}
        />
        <Table.Column
          columnKey="length"
          title={ci18n("Length dimension of a package", "Length (cm)")}
          width={120}
          align="center"
        >
          {({ row: state }: CellInfo<VariationState, VariationState>) => {
            return (
              <NumericInput
                value={state.length}
                incrementStep={1}
                onChange={({ valueAsNumber }) => {
                  state.length = Math.max(valueAsNumber || 0, 0);
                }}
                validators={[new RequiredValidator()]}
                style={styles.numericInput}
              />
            );
          }}
        </Table.Column>

        <Table.Column
          columnKey="width"
          title={ci18n("Width dimension of a package", "Width (cm)")}
          width={120}
          align="center"
        >
          {({ row: state }: CellInfo<VariationState, VariationState>) => {
            return (
              <NumericInput
                value={state.width}
                incrementStep={1}
                onChange={({ valueAsNumber }) => {
                  state.width = Math.max(valueAsNumber || 0, 0);
                }}
                validators={[new RequiredValidator()]}
                style={styles.numericInput}
              />
            );
          }}
        </Table.Column>
        <Table.Column
          columnKey="height"
          title={ci18n("Height dimension of a package", "Height (cm)")}
          width={120}
          align="center"
        >
          {({ row: state }: CellInfo<VariationState, VariationState>) => {
            return (
              <NumericInput
                value={state.height}
                incrementStep={1}
                onChange={({ valueAsNumber }) => {
                  state.height = Math.max(valueAsNumber || 0, 0);
                }}
                validators={[new RequiredValidator()]}
                style={styles.numericInput}
              />
            );
          }}
        </Table.Column>
        <Table.Column
          columnKey="weight"
          title={ci18n("Weight dimension of a package", "Weight (kg)")}
          width={120}
          align="center"
        >
          {({ row: state }: CellInfo<VariationState, VariationState>) => {
            return (
              <NumericInput
                value={state.weight}
                incrementStep={1}
                onChange={({ valueAsNumber }) => {
                  state.weight = Math.max(valueAsNumber || 0, 0);
                }}
                validators={[new RequiredValidator()]}
                style={styles.numericInput}
              />
            );
          }}
        </Table.Column>
      </Table>
    </Layout.FlexColumn>
  );
};

export default observer(EnterLogisticsInfo);

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
