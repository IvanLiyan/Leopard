/* React, Mobx and Aphrodite */
import React, { Component } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { CurrencyInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium, proxima } from "@toolkit/fonts";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CurrencyCode } from "@toolkit/currency";

const priceRegex = /^\$?[0-9]+(\.[0-9]{1,2})?$|^\$?[\.]([\d][\d]?)$/;

export type BudgetTextInputProps = BaseProps & {
  readonly campaignId: string;
  readonly currentBudget: number;
  readonly onCampaignUpdated: (() => unknown) | null | undefined;
  readonly onUpdateAllowedSpending: (() => unknown) | undefined;
  readonly onFocus: (() => unknown) | null | undefined;
  readonly addBudgetOnly: boolean;
  readonly fieldDisabled: boolean;
  readonly currency: CurrencyCode | null | undefined;
};

@observer
class BudgetTextInput extends Component<BudgetTextInputProps> {
  @observable
  rawFutureBudget: string | null | undefined;

  @observable
  showMerchantBudget = false;

  @observable
  isBudgetValid = false;

  @computed
  get styles() {
    return StyleSheet.create({
      inputContainerStyle: {
        overflowX: "hidden",
        fontFamily: proxima,
      },
    });
  }

  @computed
  get futureBudget(): string {
    const { rawFutureBudget } = this;
    const { currentBudget } = this.props;

    if (!rawFutureBudget) {
      return Math.round(currentBudget).toFixed(2);
    } else if (rawFutureBudget.indexOf("$") === 0) {
      return parseFloat(rawFutureBudget.substring(1)).toFixed(2);
    }
    return parseFloat(rawFutureBudget).toFixed(2);
  }

  @computed
  get displayedBudget(): string | null | undefined {
    const { campaignId } = this.props;
    const productBoostStore: ProductBoostStore = AppStore.instance()
      .productBoostStore;
    const campaign: Campaign | null | undefined = productBoostStore.getCampaign(
      campaignId
    );
    if (!campaign) {
      // Should never happen.
      return "";
    }
    if (this.showMerchantBudget) {
      return campaign.merchantBudget;
    }
    return campaign.budget;
  }

  render() {
    const {
      campaignId,
      currentBudget,
      onCampaignUpdated,
      onUpdateAllowedSpending,
      fieldDisabled,
      onFocus,
      addBudgetOnly,
      currency,
    } = this.props;

    // If pass in as CSSStyleDeclaration, `padding: -20` will be ignored.
    // TODO: Negative padding is hacky, need a better way here.
    const currencySymbolStyle: CSSProperties = {
      marginRight: 5,
      padding: -20,
      fontSize: 14,
      fontWeight: weightMedium,
    };

    const currencyInputStyle: CSSProperties = {
      minWidth: 90,
      maxWidth: 215,
      width: "100%",
    };

    const productBoostStore: ProductBoostStore = AppStore.instance()
      .productBoostStore;
    const campaign: Campaign | null | undefined = productBoostStore.getCampaign(
      campaignId
    );
    if (!campaign) {
      // Should never happen.
      return null;
    }
    return (
      <CurrencyInput
        value={this.displayedBudget}
        style={currencyInputStyle}
        height={35}
        inputContainerStyle={css(this.styles.inputContainerStyle)}
        currencySymbolStyle={
          this.isBudgetValid
            ? currencySymbolStyle
            : {
                marginTop: 10,
                ...currencySymbolStyle,
              }
        }
        currencyCode={currency || "USD"}
        onFocus={() => {
          this.showMerchantBudget = true;
          if (onFocus) {
            onFocus();
          }
        }}
        onChange={
          addBudgetOnly
            ? () => {}
            : ({ text }: OnTextChangeEvent) => {
                if (text.length < 10 && this.showMerchantBudget) {
                  if (this.isBudgetValid && priceRegex.test(text)) {
                    this.rawFutureBudget = text;
                  } else {
                    this.rawFutureBudget = null;
                  }
                  campaign.merchantBudget = text;
                }
              }
        }
        onBlur={
          addBudgetOnly
            ? () => {
                this.showMerchantBudget = false;
              }
            : async () => {
                if (
                  this.rawFutureBudget &&
                  currentBudget.toFixed(2) !== this.futureBudget
                ) {
                  const { toastStore } = AppStore.instance();
                  toastStore.info(i`Budget is being updated.`);
                  try {
                    campaign.merchantBudget = this.futureBudget;
                    await productBoostStore.commitCampaign(campaignId);
                  } catch (e) {
                    campaign.merchantBudget = currentBudget.toFixed(2);
                    this.showMerchantBudget = false;
                    return;
                  }
                  if (onCampaignUpdated) {
                    // prevent reading from the secondary db before it updates
                    setTimeout(onCampaignUpdated, 500);
                  }
                  if (onUpdateAllowedSpending) {
                    // prevent reading from the secondary db before it updates
                    setTimeout(onUpdateAllowedSpending, 500);
                  }
                  toastStore.positive(i`Budget updated successfully!`);
                } else {
                  campaign.merchantBudget = currentBudget.toFixed(2);
                }
                this.showMerchantBudget = false;
              }
        }
        onValidityChanged={(isValid: boolean) => {
          this.isBudgetValid = isValid;
        }}
        padding={-20}
        disabled={fieldDisabled}
      />
    );
  }
}
export default BudgetTextInput;
