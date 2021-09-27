import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import CreateWebhookModalContent from "./CreateWebhookModalContent";

/* Model */
import {
  PickedWebhookTopicSchema,
  PickedWebhookSubscriptionSchema,
} from "@toolkit/external/webhook";
import MerchantAppWebhookState from "@merchant/model/external/merchant-apps/MerchantAppWebhookState";

export type CreateWebhookModalProps = {
  readonly isNew: boolean;
  readonly topicOptions: ReadonlyArray<PickedWebhookTopicSchema> | undefined;
  readonly state: MerchantAppWebhookState;
  readonly subscription?: PickedWebhookSubscriptionSchema | undefined;
};

export default class CreateWebhookModal extends Modal {
  parentProps: CreateWebhookModalProps;

  constructor(props: CreateWebhookModalProps) {
    super(() => null);
    this.parentProps = props;
    const { isNew = true } = this.parentProps;

    this.setHeader({
      title: isNew ? i`Create a webhook` : i`Update your webhook`,
    });
    this.setNoMaxHeight(true);
    this.setWidthPercentage(0.5);
  }

  renderContent() {
    const { state, topicOptions, isNew, subscription } = this.parentProps;

    if (topicOptions == null || topicOptions.length <= 0) {
      return null;
    }

    return (
      <CreateWebhookModalContent
        onClose={() => this.close()}
        state={state}
        topicOptions={topicOptions}
        subscription={subscription}
        isNew={isNew}
      />
    );
  }
}
