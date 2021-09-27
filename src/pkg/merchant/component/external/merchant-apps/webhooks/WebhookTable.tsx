import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { DeleteButton, Link, Popover, ObjectId } from "@ContextLogic/lego";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import MerchantAppWebhookState from "@merchant/model/external/merchant-apps/MerchantAppWebhookState";
import {
  PickedWebhookSubscriptionSchema,
  PickedWebhookSchema,
  MerchantAppWebhookTopicName,
} from "@toolkit/external/webhook";

import CreateWebhookModal from "@merchant/component/external/merchant-apps/webhooks/CreateWebhookModal";

type Props = BaseProps & {
  readonly topics: PickedWebhookSchema["topics"];
  readonly subscriptions: ReadonlyArray<PickedWebhookSubscriptionSchema>;
  readonly state: MerchantAppWebhookState;
  readonly inactive?: boolean;
};

const WebhookTable: React.FC<Props> = (props: Props) => {
  const { style, subscriptions, state, topics, inactive = false } = props;
  const styles = useStylesheet(props);

  const updateWebhook = async (subscription: PickedWebhookSubscriptionSchema) =>
    new CreateWebhookModal({
      isNew: false,
      state,
      topicOptions: topics,
      subscription,
    }).render();

  const sendTestNotification = async (
    subscription: PickedWebhookSubscriptionSchema
  ) => state.sendTestMessage(subscription);

  return (
    <div className={css(styles.root, style)}>
      <div className={css(styles.row, styles.header)}>
        <span>Event</span>
        <span>ID</span>
        <span>URL</span>
        {inactive && <span>Reason</span>}
        <span className={css(styles.action)}>Action</span>
      </div>
      {subscriptions.map((subscription) => (
        <div className={css(styles.row)} key={subscription.id}>
          <span>{MerchantAppWebhookTopicName[subscription.topic.name]}</span>
          <span>
            <ObjectId
              style={{ padding: 0 }}
              id={subscription.id}
              copyOnBodyClick
            />
          </span>
          <span
            className={
              subscription.deactivated ? css(styles.inactive) : undefined
            }
          >
            {subscription.endpoint}
          </span>
          {inactive && (
            <Popover
              popoverContent={subscription.deactivateReasonDetail}
              position="top center"
              popoverMaxWidth={200}
              on="hover"
            >
              <span>{subscription.deactivateReasonBrief}</span>
            </Popover>
          )}
          <div className={css(styles.buttons, styles.action)}>
            {
              <Link
                onClick={async () => {
                  subscription.deactivated
                    ? await updateWebhook(subscription)
                    : await sendTestNotification(subscription);
                }}
              >
                {subscription.deactivated
                  ? i`Update webhook`
                  : i`Send test notification`}
              </Link>
            }
            <DeleteButton
              hideBorder
              onClick={async () => {
                await state.delete(subscription.id);
              }}
              style={{ marginLeft: 5 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const useStylesheet = (props: Props) => {
  const { inactive } = props;
  const { borderPrimary, surfaceLight, surfaceLightest, negative } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: 4,
          border: `1px solid ${borderPrimary}`,
        },
        header: {
          fontWeight: fonts.weightSemibold,
          backgroundColor: surfaceLight,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        row: {
          display: "grid",
          gridTemplateColumns: inactive
            ? "1fr 1fr 2fr 2fr 1fr"
            : "1fr 1fr 3fr 1fr",
          gap: 20,
          backgroundColor: surfaceLightest,
          padding: "12px 16px",
          borderBottom: `1px solid ${surfaceLight}`,
          wordBreak: "break-word",
        },
        action: {
          textAlign: "right",
          wordBreak: "normal",
        },
        buttons: {
          display: "flex",
          justifyContent: "center",
        },
        inactive: {
          color: negative,
        },
      }),
    [inactive, borderPrimary, surfaceLight, surfaceLightest, negative]
  );
};

export default WebhookTable;
