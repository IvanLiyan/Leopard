/* eslint-disable local-rules/no-empty-link */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton, LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

/* Merchant Model */
import MerchantAppWebhookState from "@merchant/model/external/merchant-apps/MerchantAppWebhookState";
import {
  MerchantAppWebhookInitialData,
  PickedWebhookSubscriptionSchema,
} from "@toolkit/external/webhook";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import _ from "lodash";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative imports */
import CreateWebhookModal from "./webhooks/CreateWebhookModal";
import WebhookTable from "./webhooks/WebhookTable";

const GET_WEBHOOK_SUBSCRIPTIONS_QUERY = gql`
  query MerchantAppWebhookState_GetWebhookSubscription {
    webhook {
      allowWebhookUi
      topics {
        id
        name
        apiVersion
      }
      subscriptions {
        id
        topic {
          id
          name
          apiVersion
        }
        endpoint
        deactivated
        deactivateReasonBrief
        deactivateReasonDetail
      }
    }
  }
`;

export type Props = BaseProps & {
  readonly infoText: string;
};

const WebhookTableSection = (props: Props) => {
  const { className, style, infoText } = props;
  const styles = useStylesheet();
  const [webhookState] = useState(new MerchantAppWebhookState());

  const { data, loading } = useQuery<MerchantAppWebhookInitialData, void>(
    GET_WEBHOOK_SUBSCRIPTIONS_QUERY,
  );

  const webhookTopics = data?.webhook?.topics || [];
  const webhookSubscriptionsActive = useMemo(
    () =>
      _.sortBy(
        (data?.webhook?.subscriptions || []).filter(
          ({ deactivated }) => !deactivated,
        ),
        (webhook) => webhook.topic.name,
      ) as PickedWebhookSubscriptionSchema[],
    [data],
  );
  const webhookSubscriptionsInactive = useMemo(
    () =>
      _.sortBy(
        (data?.webhook?.subscriptions || []).filter(
          ({ deactivated }) => deactivated,
        ),
        (webhook) => webhook.topic.name,
      ) as PickedWebhookSubscriptionSchema[],
    [data],
  );
  const allowWebhookUi = data?.webhook?.allowWebhookUi || false;

  const upsertWebhook = async () =>
    new CreateWebhookModal({
      isNew: true,
      state: webhookState,
      topicOptions: webhookTopics,
    }).render();

  if (!allowWebhookUi) {
    return null;
  }

  return (
    <div className={css(className, style)}>
      <div className={css(styles.webhooksContainer)}>
        <div className={css(styles.buttonRowApart)}>
          <div className={css(styles.cardTitle, styles.webhooksTitle)}>
            Webhooks
          </div>
          <PrimaryButton
            onClick={upsertWebhook}
            className={css(styles.actionButton)}
            style={{ padding: "7px 13px" }}
          >
            Create webhook
          </PrimaryButton>
        </div>
        <div>{infoText}</div>
        {loading && <LoadingIndicator />}
        {!loading && webhookSubscriptionsActive.length > 0 && (
          <div className={css(styles.table)}>
            <WebhookTable
              topics={webhookTopics}
              subscriptions={webhookSubscriptionsActive}
              state={webhookState}
            />
          </div>
        )}
        {!loading && webhookSubscriptionsActive.length === 0 && (
          <div className={css(styles.card)}>
            <div className={css(styles.cardRowCenter, styles.cartEmpty)}>
              <div className={css(styles.config)}>
                You haven’t created any webhooks yet.
              </div>
              <PrimaryButton
                onClick={upsertWebhook}
                className={css(styles.actionButton)}
                style={{ padding: "7px 13px" }}
              >
                Create webhook
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
      {webhookSubscriptionsInactive.length > 0 && (
        <div className={css(styles.webhooksContainer)}>
          <div className={css(styles.buttonRowApart)}>
            <div className={css(styles.cardTitle, styles.webhooksTitle)}>
              Inactive webhooks
            </div>
          </div>
          <div>
            Update inactive webhooks to resume your subscription to events via
            push notifications sent to URLs specified by you.
          </div>
          <div className={css(styles.table)}>
            <WebhookTable
              topics={webhookTopics}
              subscriptions={webhookSubscriptionsInactive}
              state={webhookState}
              inactive
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(WebhookTableSection);

const useStylesheet = () => {
  const { textWhite, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          padding: 20,
          backgroundColor: textWhite,
          marginTop: 20,
        },
        cartEmpty: {
          padding: "120px 24px",
        },
        cardRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
        },
        cardRowCenter: {
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        buttonRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          minWidth: 237,
          height: 35,
        },
        buttonRowApart: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        },
        actionButton: {
          height: 25,
          marginRight: 5,
        },
        cardTitle: {
          color: textBlack,
          fontWeight: fonts.weightBold,
          fontSize: 18,
          marginBottom: 20,
          marginRight: 20,
        },
        config: {
          color: textBlack,
          fontSize: "14px",
          ":not(:last-child)": {
            marginBottom: 10,
          },
        },
        webhooksContainer: {
          marginTop: 44,
        },
        webhooksTitle: {
          margin: 0,
        },
        table: {
          marginTop: 24,
        },
      }),
    [textWhite, textBlack],
  );
};
