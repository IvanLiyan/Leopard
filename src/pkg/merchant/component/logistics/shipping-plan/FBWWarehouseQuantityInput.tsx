import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnChangeEvent } from "@ContextLogic/lego";

import { BlacklistReason } from "@merchant/api/fbw";

export type WarehouseQuantityChangeArgs = {
  readonly event: OnChangeEvent;
  readonly variationId: string;
  readonly warehouseCode: string;
};

export type FBWWarehouseQuantityInputProps = BaseProps & {
  readonly quantity: number;
  readonly warehouseCode: string;
  readonly variationId: string;
  readonly blocked: boolean;
  readonly blockReason: BlacklistReason;
  readonly onWarehouseQuantityChange: (
    args: WarehouseQuantityChangeArgs,
  ) => unknown;
  readonly replaceActiveFBWWarehouseQuantityInput: (
    args: FBWWarehouseQuantityInput | null | undefined,
  ) => unknown;
};

const getBlacklistString = (code: BlacklistReason) => {
  if (code === "POOR_PERF") {
    return (
      i`Sorry. The SKU is temporarily ineligible to be shipped ` +
      i`to this FBW warehouse because of poor performance`
    );
  } else if (code === "HIGH_PRICE") {
    return (
      i`Sorry. The SKU is temporarily ineligible to be shipped to ` +
      i`this FBW warehouse because price is too high`
    );
  } else if (code === "LOW_PRICE") {
    return (
      i`Sorry. The SKU is temporarily ineligible to be shipped to ` +
      i`this FBW warehouse because price is too low`
    );
  }
  return i`Invalid blacklist code`;
};

@observer
class FBWWarehouseQuantityInput extends Component<FBWWarehouseQuantityInputProps> {
  @observable
  isActive = false;

  @computed
  get styles() {
    return StyleSheet.create({
      warehouseQuantity: {
        width: 100,
        height: 42,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      warehouseQuantityBlocked: {
        width: 100,
        height: 42,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        color: palettes.textColors.LightInk,
      },
      quantity: {
        width: "100%",
        height: "100%",
        textAlign: "center",
        verticalAlign: "middle",
        display: "flex",
        flexDirection: "row",
      },
      quantityText: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: "35%",
        width: "84%",
      },
      blockedInfo: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 12,
      },
    });
  }

  mouseLeave() {
    const { replaceActiveFBWWarehouseQuantityInput } = this.props;
    replaceActiveFBWWarehouseQuantityInput(null);
  }

  mouseEnter() {
    const { replaceActiveFBWWarehouseQuantityInput } = this.props;
    replaceActiveFBWWarehouseQuantityInput(this);
  }

  render() {
    const {
      blocked,
      quantity,
      variationId,
      warehouseCode,
      blockReason,
      onWarehouseQuantityChange,
    } = this.props;
    const textStyle = blocked
      ? css(this.styles.warehouseQuantityBlocked)
      : css(this.styles.warehouseQuantity);
    return (
      <div
        className={textStyle}
        onMouseLeave={() => this.mouseLeave()}
        onMouseEnter={() => this.mouseEnter()}
      >
        {!this.isActive || quantity === 0 || blocked ? (
          <div className={css(this.styles.quantity)}>
            <div className={css(this.styles.quantityText)}>{quantity}</div>
            {blocked && (
              <Info
                className={css(this.styles.blockedInfo)}
                text={getBlacklistString(blockReason)}
                sentiment="warning"
                position="top center"
              />
            )}
          </div>
        ) : (
          <NumericInput
            value={!blocked ? Number(quantity) : 0}
            incrementStep={1}
            onChange={(event) => {
              onWarehouseQuantityChange({
                event,
                variationId,
                warehouseCode,
              });
            }}
            disabled={blocked}
          />
        )}
      </div>
    );
  }
}

export default FBWWarehouseQuantityInput;
