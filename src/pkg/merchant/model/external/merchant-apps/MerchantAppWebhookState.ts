import gql from "graphql-tag";
import { observable, action } from "mobx";

import {
  UpsertWebhookSubscriptionInput,
  UpsertWebhookSubscription,
  DeleteWebhookSubscriptionInput,
  DeleteWebhookSubscription,
  SendTestMessageInput,
  SendTestMessage,
  SubscriptionEndpointType,
} from "@schema/types";
import { PickedWebhookSubscriptionSchema } from "@toolkit/external/webhook";

import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

const UPSERT_WEBHOOK_SUBSCRIPTION_MUTATION = gql`
  mutation MerchantAppWebhookState_UpsertWebhookSubscription(
    $input: UpsertWebhookSubscriptionInput!
  ) {
    webhook {
      upsertSubscription(input: $input) {
        ok
        message
      }
    }
  }
`;

const DELETE_WEBHOOK_SUBSCRIPTION_MUTATION = gql`
  mutation MerchantAppWebhookState_DeleteWebhookSubscription(
    $input: DeleteWebhookSubscriptionInput!
  ) {
    webhook {
      deleteSubscription(input: $input) {
        ok
        message
      }
    }
  }
`;

const SEND_TEST_MESSAGE_MUTATION = gql`
  mutation MerchantAppWebhookState_SendTestMessage(
    $input: SendTestMessageInput!
  ) {
    webhook {
      sendTestMessage(input: $input) {
        ok
        message
      }
    }
  }
`;

type UpsertWebhookSubscriptionResponseType = {
  readonly webhook: {
    readonly upsertSubscription: Pick<
      UpsertWebhookSubscription,
      "ok" | "message"
    >;
  };
};

type DeleteWebhookSubscriptionResponseType = {
  readonly webhook: {
    readonly deleteSubscription: Pick<
      DeleteWebhookSubscription,
      "ok" | "message"
    >;
  };
};

type SendTestMessageResponseType = {
  readonly webhook: {
    readonly sendTestMessage: Pick<SendTestMessage, "ok" | "message">;
  };
};

export default class MerchantAppWebhookState {
  @observable
  isSubmitting: boolean = false;

  @action
  async sendTestMessage(subscription: PickedWebhookSubscriptionSchema) {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    const input = {
      subscription: {
        id: subscription.id,
        topic: {
          id: subscription.topic.id,
          name: subscription.topic.name,
          apiVersion: subscription.topic.apiVersion,
        },
        endpoint: subscription.endpoint,
        endpointType: "URL" as SubscriptionEndpointType,
      },
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      SendTestMessageResponseType,
      { input: SendTestMessageInput }
    >({
      mutation: SEND_TEST_MESSAGE_MUTATION,
      variables: { input },
    });

    const ok = data?.webhook.sendTestMessage.ok;
    const message = data?.webhook.sendTestMessage.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`,
      );
      return;
    }

    toastStore.positive(i`A test notification was sent to your given URL.`, {
      timeoutMs: 7000,
    });
  }

  @action
  async delete(subscriptionId: string) {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

    const input = {
      subscriptionId,
    };

    this.isSubmitting = true;

    const { data } = await client.mutate<
      DeleteWebhookSubscriptionResponseType,
      { input: DeleteWebhookSubscriptionInput }
    >({
      mutation: DELETE_WEBHOOK_SUBSCRIPTION_MUTATION,
      variables: { input },
    });

    const ok = data?.webhook.deleteSubscription.ok;
    const message = data?.webhook.deleteSubscription.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`,
      );
      return;
    }

    await navigationStore.reload();
    toastStore.positive(i`Your webhook is deleted.`, {
      timeoutMs: 7000,
    });
  }

  @action
  async submit(input: UpsertWebhookSubscriptionInput) {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

    this.isSubmitting = true;

    const { data } = await client.mutate<
      UpsertWebhookSubscriptionResponseType,
      { input: UpsertWebhookSubscriptionInput }
    >({
      mutation: UPSERT_WEBHOOK_SUBSCRIPTION_MUTATION,
      variables: { input },
    });

    const ok = data?.webhook.upsertSubscription.ok;
    const message = data?.webhook.upsertSubscription.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`,
      );
      return;
    }

    await navigationStore.reload();
    toastStore.positive(i`Your webhook is saved successfully.`, {
      timeoutMs: 7000,
    });
  }
}
