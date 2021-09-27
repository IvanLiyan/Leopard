import React, { ReactNode } from "react";
import { computed } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Merchant Components */
import AddBudgetModalContent, {
  AddBudgetModalContentProps,
} from "@merchant/component/product-boost/modals/AddBudgetModalContent";
import EnableAutomatedModalContent, {
  EnableAutomatedModalContentProps,
} from "@merchant/component/product-boost/modals/EnableAutomatedModalContent";
import DuplicateAutomatedModalContent, {
  DuplicateAutomatedModalContentProps,
} from "@merchant/component/product-boost/modals/DuplicateAutomatedModalContent";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { CurrencyCode } from "@toolkit/currency";

export type CampaignActions =
  | "AddBudget"
  | "DuplicateAutomated"
  | "EnabledAutomated";

export type CampaignActionModalProps = AddBudgetModalContentProps &
  DuplicateAutomatedModalContentProps &
  EnableAutomatedModalContentProps & {
    readonly action: CampaignActions;
    readonly startDate?: string;
    readonly endDate?: string;
    readonly discount?: number;
    readonly hasMaxboostProduct?: boolean;
    readonly currencyCode?: CurrencyCode;
    readonly productCount?: number;
  };

export default class CampaignActionModal extends Modal {
  parentProps: CampaignActionModalProps;

  constructor(props: CampaignActionModalProps) {
    super(() => null);

    this.parentProps = props;
    this.setNoMaxHeight(true);
    this.setWidthPercentage(0.43);
  }

  @computed
  get modalPadding(): string {
    const { dimenStore } = AppStore.instance();
    return dimenStore.isSmallScreen ? "60px 0px 90px 0px" : "0px";
  }

  @computed
  get addBudgetModalContent() {
    const {
      action,
      discount,
      endDate,
      hasMaxboostProduct,
      startDate,
      currencyCode,
      productCount,
      minStartDate,
      maxStartDate,
      maxNumWeeks,
      allowMaxboost,
      ...otherProps
    } = this.parentProps;
    return (
      <AddBudgetModalContent
        {...otherProps}
        onClose={() => {
          this.close();
        }}
      />
    );
  }

  @computed
  get duplicateAutomatedModalContent() {
    const {
      action,
      discount,
      fromNoti,
      hasMaxboostProduct,
      showSuggestedBudget,
      suggestedBudget,
      flexibleBudgetEnabled,
      flexibleBudgetType,
      ...otherProps
    } = this.parentProps;
    return (
      <DuplicateAutomatedModalContent
        {...otherProps}
        dupSource={3}
        onClose={() => this.close()}
      />
    );
  }

  @computed
  get enabledAutomatedModalContent() {
    const {
      action,
      fromNoti,
      showSuggestedBudget,
      suggestedBudget,
      productCount,
      flexibleBudgetEnabled,
      flexibleBudgetType,
      ...otherProps
    } = this.parentProps;
    return (
      <EnableAutomatedModalContent
        {...otherProps}
        onClose={() => this.close()}
      />
    );
  }

  renderContent() {
    let modal: ReactNode = null;
    switch (this.parentProps.action) {
      case "AddBudget":
        modal = this.addBudgetModalContent;
        break;
      case "EnabledAutomated":
        modal = this.enabledAutomatedModalContent;
        break;
      case "DuplicateAutomated":
        modal = this.duplicateAutomatedModalContent;
    }

    return <div style={{ padding: this.modalPadding }}>{modal}</div>;
  }
}
