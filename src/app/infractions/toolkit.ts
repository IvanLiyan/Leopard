import { ci18n } from "@core/toolkit/i18n";
import { zendeskSectionURL, zendeskURL } from "@core/toolkit/url";
import {
  CommerceTransactionState,
  MerchantWarningImpactType,
  MerchantWarningProofDisputeStatus,
  MerchantWarningProofType,
  MerchantWarningReason,
  MerchantWarningState,
  TrackingDisputeState,
} from "@schema";

const deprecatedInfractionData = {
  title: "",
  body: i`Wish has deprecated this infraction, which means you cannot receive it again moving forward. However, this infraction may still impact your account.`,
  policy: undefined,
  faq: undefined,
};

export const MerchantWarningReasonData: {
  readonly [reason in MerchantWarningReason]: {
    readonly title: string;
    readonly body: string;
    readonly policy: string | undefined;
    readonly faq: string | undefined;
  };
} = {
  REQUEST_USER_EMAIL: {
    title: i`Requesting Customer's Personal Information`,
    body: i`You asked a customer for their personal information, i.e.: email address, payment information, etc.`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  REQUEST_MONEY: {
    title: i`Requesting Customer Payment Outside Wish`,
    body: i`You asked a customer for payment outside of Wish, or requested a direct payment from a customer`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  BAD_CUSTOMER_SERVICE: {
    title: i`Discourteous Customer Service`,
    body: i`Wish customers expect timely, courteous, and effective support`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  DISINGENUOUS_CUSTOMER_SERVICE: {
    title: i`Disingenuous Customer Service`,
    body: i`Wish has found that you have been disingenuous to customers`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  TAKE_USER_OUTSIDE_WISH: {
    title: i`Directing Customers Off of Wish`,
    body: i`You asked customers to visit stores outside of Wish, or generally redirected customers off Wish`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  VIOLATE_POLICY: {
    title: i`Policy Violation`,
    body: i`You have violated [Wish Merchant Policies](${"https://merchant.wish.com/policy"})`,
    policy: undefined,
    faq: undefined,
  },
  FINE_FOR_COUNTERFEIT_GOODS: {
    title: i`Intellectual Property Violation`,
    body: i`This product is counterfeit or infringes on another entity's [IP](${"https://www.wish.com/intellectual-property?hide_login_modal=true"})`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[How to Avoid Intellectual Property Violations](${zendeskURL(
      "1260801319309",
    )})`,
  },
  PRODUCT_HIGH_REFUND_RATIO: {
    title: i`High Product Quality Refund Rate`,
    body: i`This product has a refund rate of more than ${5}% and/or an extremely low average rating`,
    policy: i`[Returns Policy](${"https://merchant.wish.com/policy#returns"})`,
    faq: undefined,
  },
  FINE_PRODUCT_SWAPPED: {
    title: i`Material Listing Change`,
    body: i`Changes to this listing (e.g., product name, description, images) misrepresent the product, set false customer expectations, and/or don't comply with Wish Merchant Policies`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  SUSPECTED_FRAUD: {
    title: i`Suspected Fraud`,
    body: i`Wish has found that your account violated our Terms of Service](${"https://www.wish.com/en-terms"}) with deceptive, fraudulent, or illegal activity`,
    policy: i`[Terms of Service](${"https://merchant.wish.com/terms-of-service"})`,
    faq: undefined,
  },
  PRODUCT_IS_INAPPROPRIATE: {
    title: i`Prohibited Content`,
    // TODO: handle this case
    body: i`"This product listing contains [prohibited content](${zendeskURL(
      "205211777",
    )}) (e.g.: unacceptable images, titles, descriptions, etc.)

    IMPORTANT: This infraction has many parent categories and sub-reasons (see sub-reason page below). Please ensure that the sub-reason copy is correctly displayed below the infraction description."`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: "", // TODO
  },
  REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER: {
    title: i`Repeat Intellectual Property Infringement`,
    body: i`Wish has found that you sell products that infringe on another entity's IP`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[Intellectual Property Violations FAQ](${zendeskURL(
      "1260801319309",
    )})`,
  },
  MERCHANT_CONTACT_INFO_INVALID: {
    title: i`Invalid Contact Information`,
    body: i`Your contact information is missing or inaccurate`,
    policy: i`[Registration Policy](${"https://merchant.wish.com/policy"})`,
    faq: undefined,
  },
  LEGAL_TRO_TAKEDOWN: {
    title: i`Intellectual Property Violation`,
    // TODO: handle this properly with zendesk
    body: i`You have received a Temporary Restraining Order as the result of a lawsuit from the entity that owns a product's IP. <a href="https://merchantfaq.wish.com/hc/en-us/articles/360008058353-Temporary-Restraining-Order-FAQ">Learn more about TROs.</a> `,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[Temporary Restraining Order FAQ](${zendeskURL("360008058353")})`,
  },
  MISLEADING_VARIATION: {
    title: i`Misleading Product Variations`,
    body: i`This listing contains product variations that substantially differ from one another`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: i`[Misleading Listings FAQ](${zendeskURL("360003237193")})`,
  },
  WISHPOST_NEGATIVE_BALANCE: {
    title: i`WishPost Negative Balance`,
    body: i`Wish will withhold your WishPost payments due to a current negative balance`,
    policy: undefined,
    faq: undefined,
  },
  HIGH_IP_INFRINGEMENT: {
    title: i`Suspension - Repeat Intellectual Property Infringements`,
    body: i`Wish has suspended your account due to multiple IP infringements`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: undefined,
  },
  CN_PROHIBITED_PRODUCTS: {
    title: i`Prohibited Product Imported/Exported From China`,
    body: i`This product does not comply with China Customs Policy for import and/or export from China`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  STRIKE_BASED_HIGH_RISK_PROHIBITED: {
    title: i`High Risk Prohibited Product`,
    body: i`This listing contains a product prohibited from sale on Wish. [View prohibited products list](${"https://merchant.wish.com/policy/inappropriate-reasons/1"})`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  PRODUCT_GEOBLOCK: {
    title: i`Regionally Restricted Product Listing`,
    body: i`This product appears available for sale in a region where it is prohibited`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: i`[Regional Requirements FAQ](${zendeskSectionURL("4411071551259")})`,
  },
  WAREHOUSE_FULFILLMENT_POLICY_VIOLATION: {
    title: i`Order Delivered Later Than Set Max Delivery Days`,
    body: i`This order is confirmed delivered late per your max delivery days setting`,
    policy: i`[Warehouse Fulfillment Policy](${"https://merchant.wish.com/policy#warehouse_fulfillment"})`,
    faq: undefined,
  },
  BRANDED_PRODUCT_GEOBLOCK: {
    title: i`Intellectual Property Violation - Regionally Restricted Listing`,
    body: i`This product may be counterfeit, or its sale infringes on an entity's IP in a region where they have rights to it`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[Regional Requirements FAQ](${zendeskSectionURL("4411071551259")})`,
  },
  FAKE_TRACKING: {
    title: i`Misleading Tracking Number`,
    body: i`The tracking number on this order is inaccurate`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  MERCHANT_CANCELLATION_VIOLATION: {
    title: i`Cancelled Order`,
    body: i`You cancelled or refunded this order prior to confirmed fulfillment`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  LATE_CONFIRMED_FULFILLMENT_VIOLATION: {
    title: i`Late Confirmed Fulfillment`,
    body: i`This order was not confirmed fulfilled by the carrier within ${7} days (for an order less than $100) or ${14} days (for an order greater than or equal to $100)`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  UNFULFILLED_ORDER: {
    title: i`Unfulfilled Order`,
    body: i`You did not fulfill the order within ${5} calendar days`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  INACTIVE_ACCOUNT: {
    title: i`Inactive Account`,
    body: i`Wish has detected that your account has been [inactive](${"https://merchantfaq.wish.com/hc/en-us/articles/9358114053787-Inactive-account-infractions"} for some time`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: i`[Inactive Account Infractions FAQ](${zendeskURL("9358114053787")})`,
  },
  ORDER_NOT_DELIVERED: {
    title: i`Order Not Delivered`,
    body: i`"Based on confirmed tracking information, this order did not arrive before (max TTD + ${7} days).
    Note: Wish will automatically reverse this infraction if the order is confirmed delivered or gets paid out."`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  //
  // below infractions are deprecated, may be returned when viewing old infractions
  //
  REUPLOADING_COUNTERFEITS: deprecatedInfractionData,
  PRODUCT_LOW_RATING_NO_REMOVE: deprecatedInfractionData,
  VIOLATION_OF_TERMS: deprecatedInfractionData,
  STORE_VALIDATION_INCOMPLETE: deprecatedInfractionData,
  TAX_SETTING_NOT_UPDATED: deprecatedInfractionData,
  MERCHANT_HARASSMENT: deprecatedInfractionData,
  COUNTERFEIT_GOODS: deprecatedInfractionData,
  CS_LOW_CSAT_SCORE: deprecatedInfractionData,
  LATE_FULFILLMENT_RATE: deprecatedInfractionData,
  DECEPTIVE_FULFILLMENT: deprecatedInfractionData,
  REPEAT_PRODUCT_SWAPPING: deprecatedInfractionData,
  WISHPOST_ID_NOT_COMPLETE_FACE_RECOGNITION: deprecatedInfractionData,
  HIGH_GMV_FROM_MISLEADING_PRODUCTS: deprecatedInfractionData,
  PRODUCT_HIGH_CANCEL_ORDER_RATE: deprecatedInfractionData,
  BAN_EARLY_STAGE_MERCHANT: deprecatedInfractionData,
  HIGH_REFUND_RATIO: deprecatedInfractionData,
  POLICY_TIER_DEMOTION: deprecatedInfractionData,
  MERCHANT_HIGH_QUALITY_REFUND_RATIO: deprecatedInfractionData,
  US_TAX_INFO_UNVALIDATED: deprecatedInfractionData,
  PENALTY_FOR_AUTO_REFUND: deprecatedInfractionData,
  FINAL_JUDGEMENT_ORDER: deprecatedInfractionData,
  CONFIRMED_DELIVERY_POLICY: deprecatedInfractionData,
  UNCONFIRMED_TRACKING_NUMBERS: deprecatedInfractionData,
  FINE_WISH_EXPRESS_POLICY_VIOLATION: deprecatedInfractionData,
  PRODUCT_HIGH_REFUND_RATIO_NO_REMOVE: deprecatedInfractionData,
  RESPOND_TO_ADMIN: deprecatedInfractionData,
  WISH_EXPRESS_POLICY_PRODUCT: deprecatedInfractionData,
  PRODUCT_HIGH_QUALITY_REFUND_RATIO: deprecatedInfractionData,
  MERCHANT_HIGH_REFUND_EAT_COST: deprecatedInfractionData,
  DEP_FINE_DISABLE_PROMOTED_PRODUCT: deprecatedInfractionData,
  CS_LATE_RESPONSE_RATE: deprecatedInfractionData,
  WISH_EXPRESS_POLICY_VIOLATION: deprecatedInfractionData,
  HIGH_AUTO_REFUND: deprecatedInfractionData,
  MERCHANT_HIGH_CANCEL_ORDER_RATE: deprecatedInfractionData,
  HIGH_GMV_FROM_GAMING_FREEZE: deprecatedInfractionData,
  WISH_EXPRESS_POLICY_MERCHANT: deprecatedInfractionData,
  EMPTY_PACKAGES: deprecatedInfractionData,
  VIOLATION_OF_POLICY_TIER: deprecatedInfractionData,
  PRODUCT_LOW_RATING: deprecatedInfractionData,
  FINE_UPDATE_TO_COUNTERFEIT: deprecatedInfractionData,
  RELATED_ACCOUNT_IS_BANNED: deprecatedInfractionData,
  DEP_FINE_DISABLE_PROMOTED_PRODUCT_FOR_COUNTRY: deprecatedInfractionData,
  DUPLICATE_ACCOUNTS: deprecatedInfractionData,
  EXTREMELY_HIGH_PRICE_SPREAD: deprecatedInfractionData,
  HIGH_GMV_FROM_GAMING_BAN: deprecatedInfractionData,
  HIGH_CHARGEBACK_AND_FRAUD_REFUND_RATIO: deprecatedInfractionData,
  HIGH_GMV_FROM_GAMING_AUDIT: deprecatedInfractionData,
  INVALID_EU_RESPONSIBLE_PERSON: deprecatedInfractionData,
  FAKE_RATING: deprecatedInfractionData,
  DEP_BAIT_VARIABLE_PRICING: deprecatedInfractionData,
  INVALID_TRACKING_NUMBERS: deprecatedInfractionData,
  HIGH_CHARGEBACK_RATIO: deprecatedInfractionData,
  VIOLATE_TS_POLICY: deprecatedInfractionData,
  DUPLICATE_PRODUCTS: deprecatedInfractionData,
};

export const CommerceTransactionStateDisplayText: {
  readonly [state in CommerceTransactionState]: string;
} = {
  APPROVED: ci18n(
    "a label showing a merchant the status of an order, this order is ready to be shipped",
    "Ready to be shipped",
  ),
  SHIPPED: ci18n(
    "a label showing a merchant the status of an order, this order has been shipped",
    "Shipped",
  ),
  REFUNDED: ci18n(
    "a label showing a merchant the status of an order, this order has been refunded",
    "Refunded",
  ),
  REQUIRE_REVIEW: ci18n(
    "a label showing a merchant the status of an order, this order is under review",
    "Under Review",
  ),
  EXCEPTION: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  LABEL_GENERATED: ci18n(
    "a label showing a merchant the status of an order, this order's shipping label has been generated",
    "Shipping label generated",
  ),
  LABEL_DOWNLOADED: ci18n(
    "a label showing a merchant the status of an order, this order's shipping label has been downloaded",
    "Shipping label downloaded",
  ),
  DELAYING: ci18n(
    "a label showing a merchant the status of an order, this order is being delayed",
    "Delaying",
  ),
  PENDING: ci18n(
    "a label showing a merchant the status of an order, payment is pending for this order",
    "Payment Pending",
  ),
  DECLINED: ci18n(
    "a label showing a merchant the status of an order, payment has been declined for this order",
    "Payment Declined",
  ),
  //
  // below states are deprecated and should not be returned
  //
  ACKNOWLEDGED: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  GIFT_WAITING_FOR_ACCEPT: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  C2C_ACCEPTED: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  C2C_DELIVERED: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  C2C_ON_DELIVERY: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
};

export type DisputeStatus =
  | TrackingDisputeState
  | MerchantWarningProofDisputeStatus;

export const DisputeStatusDisplayText: {
  readonly [state in DisputeStatus]: string;
} = {
  AWAITING_ADMIN: ci18n(
    "a label showing a merchant the status of a dispute",
    "Awaiting Admin",
  ),
  CANCELLED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Cancelled",
  ),
  AWAITING_MERCHANT: ci18n(
    "a label showing a merchant the status of a dispute",
    "Awaiting Merchant",
  ),
  APPROVED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Approved",
  ),
  DECLINED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Declined",
  ),
  DISPUTING: ci18n(
    "a label showing a merchant the status of a dispute",
    "Disputing",
  ),
  DISPUTE_FAILED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Dispute Failed",
  ),
  NOT_DISPUTED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Not Disputed",
  ),
  DISPUTE_SUCCESS: ci18n(
    "a label showing a merchant the status of a dispute",
    "Dispute Success",
  ),
};

export const MerchantWarningImpactTypeDisplayText: {
  readonly [impact in MerchantWarningImpactType]: (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => string;
} = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  PRODUCT_PAYMENT_HOLD: (startDate, endDate) => "TODO",
  ORDER_PAYMENT_HOLD: (startDate, endDate) => "TODO",
  AUTO_REFUND: (startDate, endDate) =>
    i`Wish refunded this order on ${startDate}.`,
  MERCHANT_IMPRESSION_BLOCK: (startDate, endDate) => "TODO",
  MERCHANT_PAYMENT_HOLD: (startDate, endDate) => "TODO",
  PRODUCT_TAKEDOWN: (startDate, endDate) =>
    i`Wish removed this product listing on ${startDate}.`,
  EAT_COST_FOR_PRODUCT: (startDate, endDate) => "TODO",
  PRODUCT_IMPRESSION_BLOCK: (startDate, endDate) =>
    i`Wish will block impressions for you account until ${endDate}.`,
  VARIATION_TAKEDOWN: (startDate, endDate) =>
    i`Wish removed this variation on ${startDate}.`,
  /* eslint-enable @typescript-eslint/no-unused-vars */
};

export const MerchantWarningStateDisplayText: {
  readonly [state in MerchantWarningState]: string;
} = {
  AWAITING_AUTH_TAGGING_HIGH_GMV: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  US_BD_REVIEW_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  CN_BD_REVIEW_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  REQUEST_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  AWAITING_ADMIN: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  REQUIRES_ADMIN_REVIEW: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  AWAITING_ADMIN_BOT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  CLOSED: ci18n(
    "a label showing a merchant the state of an infraction",
    "Closed",
  ),
  CANCELLED: ci18n(
    "a label showing a merchant the state of an infraction",
    "Cancelled",
  ),
  NEW: ci18n("a label showing a merchant the state of an infraction", "New"),
  AWAITING_MERCHANT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  AWAITING_AUTH_TAGGING_LOW_GMV: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
};

export const MerchantWarningProofTypeDisplayText: {
  readonly [type in MerchantWarningProofType]: string;
} = {
  MERCHANT: ci18n("a type of evidence for an infraction", "Merchant"),
  PRODUCT: ci18n("a type of evidence for an infraction", "Product"),
  VARIATION: ci18n("a type of evidence for an infraction", "Variation"),
  PRODUCT_RATING: ci18n(
    "a type of evidence for an infraction",
    "Product Rating",
  ),
  TICKET: ci18n("a type of evidence for an infraction", "Ticket"),
  ORDER: ci18n("a type of evidence for an infraction", "Order"),
};
