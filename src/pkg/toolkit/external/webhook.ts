import {
  WebhookTopicSchema,
  WebhookSubscriptionSchema,
  WebhookTopicName,
  WebhookSchema,
} from "@schema/types";

export type PickedWebhookTopicSchema = Pick<
  WebhookTopicSchema,
  "id" | "name" | "apiVersion"
>;

export type PickedWebhookSubscriptionSchema = Pick<
  WebhookSubscriptionSchema,
  | "id"
  | "endpoint"
  | "deactivated"
  | "deactivateReasonBrief"
  | "deactivateReasonDetail"
> & {
  readonly topic: PickedWebhookTopicSchema;
};

export type PickedWebhookSchema = Pick<WebhookSchema, "allowWebhookUi"> & {
  readonly topics: Array<PickedWebhookTopicSchema>;
  readonly subscriptions?: Array<PickedWebhookSubscriptionSchema>;
};

export const MerchantAppWebhookTopicName: {
  [type in WebhookTopicName]: string;
} = {
  ORDER_ALL: i`Order all`,
  ORDER_RELEASE: i`Order release`,
  ORDER_FULFILLMENT_DEADLINE: i`Order fulfillment deadline`,
  ORDER_ADDRESS_CHANGE: i`Order address change`,
  ORDER_PENALTY: i`Order penalty`,
  ORDER_TRACKING_UPDATE: i`Order tracking update`,
  ORDER_REFUND: i`Order refund`,
  ORDER_TAX: i`Order tax`,

  POLICY_PENALTY_ISSUE: i`Policy penalty issue`,
  POLICY_PENALTY_REVERSE: i`Policy penalty reverse`,
  POLICY_PENALTY_CANCEL: i`Policy penalty cancel`,

  TICKET_AWAITING_MERCHANT: i`Ticket awaiting merchant`,

  PRODUCT_BOOST_CAMPAIGN_STATS_UPDATE: i`Product boost campaign stats update`,
  PRODUCT_BOOST_CAMPAIGN_CREATION: i`Product boost campaign creation`,
  PRODUCT_BOOST_CAMPAIGN_ATTRIBUTE_UPDATE: i`Product boost campaign attribute update`,
  PRODUCT_BOOST_CAMPAIGN_PRODUCT_STATS_UPDATE: i`Product boost campaign product stats update`,
  PRODUCT_BOOST_CAMPAIGN_PRODUCT_LOW_PERFORMANCE: i`Product boost campaign product low performance`,
  PRODUCT_BOOST_TRENDING_CATEGORIES: i`Product boost trending categories`,
  PRODUCT_BOOST_ACCOUNT_BALANCE_UPDATE: i`Product boost account balance update`,
  PRODUCT_UPDATE: i`Product and variation update`,
  PRODUCT_IMAGE_JOB_STATUS_UPDATE: i`Product image job status update`,
};

export type MerchantAppWebhookInitialData = {
  readonly webhook?: PickedWebhookSchema;
};
