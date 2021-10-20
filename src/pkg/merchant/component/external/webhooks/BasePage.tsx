import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Lego Components */
import { PageGuide } from "@merchant/component/core";
import { H4, Text, Markdown } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";
import { useDeciderKey } from "@stores/ExperimentStore";

/* Relative Imports */
import HeadersTable from "./HeadersTable";
import OrderEventsTable from "./OrderEventsTable";
import TicketEventsTable from "./TicketEventsTable";
import PenaltyEventsTable from "./PenaltyEventsTable";

type BasePageProps = BaseProps;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
`;

const BasePage = (props: BasePageProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const {
    decision: showTicketEventPublishing,
    isLoading: showTicketEventPublishingLoading,
  } = useDeciderKey("wh_ticket_event_publishing");
  const {
    decision: showPenaltyEventPublishing,
    isLoading: showPenaltyEventPublishingLoading,
  } = useDeciderKey("wh_penalty_event_publishing");

  useMountEffect(() => {
    if (!window) {
      return;
    }

    const htmlDiv = document.createElement("div");
    htmlDiv.innerHTML = "<style>" + CSS + "</style>";
    const [head] = document.getElementsByTagName("head");
    head.appendChild(htmlDiv);
  });

  useEffect(() => {
    configureAnchors({ offset: -80, scrollDuration: 200 });
  }, []);

  const appSettingsURL = "/merchant_app/show";
  const apiSettingsURL = "/client-settings";
  const v3WebhookDocsURL = "/documentation/api/v3/reference#tag/Webhook";

  return (
    <PageGuide className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>Webhooks</div>
      <Text className={css(styles.paragraph, styles.subSection)}>
        Webhooks are a useful tool that allow apps to receive real-time
        notifications for particular events that occur to a merchant’s store.
        These events can include a customer placing an order, or a merchant
        creating a new product.
      </Text>

      <div className={css(styles.section)}>
        <ScrollableAnchor id="why-webhooks">
          <div>
            <Text className={css(styles.subheading)} weight="bold">
              Why Webhooks?
            </Text>
            <Text className={css(styles.paragraph)}>
              Webhooks can reduce your API calls and save computing resources.
              Instead of pulling resources periodically and comparing what has
              been updated, you can trigger actions in your app upon receiving
              webhooks events.
            </Text>
            <Text className={css(styles.paragraph)}>
              Webhook event notifications are sent to you immediately after
              events occur, so your app can push changes to merchants quickly.
              Let’s say a customer cancels an order around the same time that a
              merchant is about to ship the ordered item. If your app is set up
              via webhook to receive notifications upon order cancellation, your
              app can inform the merchant of the order cancellation via
              automated phone call or SMS, allowing the merchant to avoid
              sending the item.
            </Text>
            <Markdown
              text={
                i`**Here are some other common webhook use cases:**` +
                "\n\n" +
                i`* Fulfill an order once the order is released` +
                "\n\n" +
                i`* Use the most updated shipping address when the address changes` +
                "\n\n" +
                i`* Reply to a ticket opened by a customer` +
                "\n\n" +
                i`* Analyse data when ProductBoost stats update` +
                "\n\n" +
                i`* Remove product data when the product is deleted by a merchant`
              }
            />
          </div>
        </ScrollableAnchor>
      </div>

      <div className={css(styles.section)}>
        <H4 className={css(styles.heading)}>Features</H4>
        <ScrollableAnchor id="timeliness">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Timeliness
            </Text>
            <Text className={css(styles.paragraph)}>
              In most scenarios, events should be pushed to your endpoints
              within 60 seconds after they occur.
            </Text>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="message-ordering">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Message Ordering
            </Text>
            <Text className={css(styles.paragraph)}>
              For multiple events of the same topic and same resource id (e.g.,
              order_id in ORDER related topics), we guarantee that messages will
              be delivered in a strict time order. For example, if a user
              updates shipping address twice in a 30-second gap, notifications
              for the two events will be sent to you strictly in the order these
              events occur.
            </Text>
            <Text className={css(styles.paragraph)}>
              If these multiple events happen in a very short period of time
              (i.e. in less than 10 seconds) we will skip the older events and
              always send a notification for the latest event.
            </Text>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="schema-consistency">
          <div>
            <div className={css(styles.subSection)}>
              <Text className={css(styles.subheading)} weight="bold">
                Schema Consistency
              </Text>
              <Text className={css(styles.paragraph)}>
                The schema of the webhook message is consistent with our V3
                RESTful API schema so that you can reuse the logic of RESTful
                APIs to process the pushed events.
              </Text>
            </div>
            <div className={css(styles.subSection)}>
              <Markdown
                className={css(styles.callout)}
                text={
                  i`**Disclaimer:**` +
                  "\n\n" +
                  i`Although we try our best to deliver every message for all applicable events ` +
                  i`that occur, we don't guarantee a 100% delivery rate. We recommend your ` +
                  i`application not solely rely on webhooks, and we strongly encourage you to ` +
                  i`still periodically fetch data from Wish using the GET endpoints.`
                }
              />
            </div>
          </div>
        </ScrollableAnchor>
      </div>

      <div className={css(styles.section)}>
        <H4 className={css(styles.heading)}>Managing Subscriptions</H4>
        <ScrollableAnchor id="ui">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              UI
            </Text>
            <Text className={css(styles.paragraph)}>
              Both public and private apps can manage webhook subscriptions via
              UI:
            </Text>
            <div className={css(styles.indent)}>
              <Text weight="bold">1a. Entry point for public apps:</Text>
              <Markdown
                className={css(styles.paragraph)}
                text={
                  i`Entry point for public apps: From the ERP Dashboard, go to ` +
                  i`Account > [App Settings](${appSettingsURL}) to view ` +
                  i`all available webhooks.`
                }
                openLinksInNewTab
              />
              <Text weight="bold">1b. Entry point for private apps:</Text>
              <Markdown
                className={css(styles.paragraph)}
                text={
                  i`Entry point for private apps: From the Merchant Dashboard, go to ` +
                  i`Account > [API Settings](${apiSettingsURL}) to view all available webhooks.`
                }
                openLinksInNewTab
              />
              <Text weight="bold">2. Create Webhook:</Text>
              <Markdown
                className={css(styles.paragraph)}
                text={
                  i`Click on "Create Webhook", choose a topic to subscribe to, and ` +
                  i`specify an endpoint URL to send these push notifications to. ` +
                  i`Make sure your endpoint is publicly accessible. The URL must ` +
                  i`start with \`http://\` or \`https://\`. We do not accept localhost endpoints.`
                }
              />
            </div>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="api">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              API
            </Text>
            <Markdown
              className={css(styles.paragraph)}
              text={
                i`Only private apps can manage subscriptions via API - ` +
                i`please see our [V3 Webhook documentation](${v3WebhookDocsURL}) ` +
                i`for more information.`
              }
              openLinksInNewTab
            />
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="test-endpoint">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Test Endpoint
            </Text>
            <Text className={css(styles.paragraph)}>
              Once your HTTP endpoint is running and your webhook has been
              created, you can click “Send test notification” in the
              Merchant/ERP Dashboard UI and attempt to receive a test message.
              Upon receiving the message, your application should respond with
              HTTP 200 OK to acknowledge.
            </Text>
            <Text weight="bold">Example test message:</Text>
            <div className={css(styles.paragraph, styles.code)}>
              {`
Headers:
Wish-Topic: "ORDER_RELEASE'"
Wish-Hmac-Sha256: “8edf3bbd0bfafad0d03a0d696fce0b0fece4cb21”
Wish-API-Version: “V3”
Wish-Merchant-ID: “”
Wish-Subscription-ID: “606315bc95b32786d788d396”
Wish-Retry-Attempt: “0”

Body:
[
  {
    "data": "Hello from Wish, this is a test message!”,
    "timestamp": 1615579054
  },
]
              `}
            </div>
          </div>
        </ScrollableAnchor>
      </div>

      <div className={css(styles.section)}>
        <H4 className={css(styles.heading)}>Integrating Webhooks</H4>
        <Text className={css(styles.paragraph)}>
          After you have successfully set up your webhooks, the events that
          belong to the topic you subscribe to will trigger a webhook
          notification when they occur.
        </Text>
        <ScrollableAnchor id="data-format">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Data Format
            </Text>
            <Text className={css(styles.paragraph)}>
              Each webhook notification contains:
            </Text>
            <div className={css(styles.paragraph, styles.indent)}>
              <Text>1. HTTP headers that provide context and metadata.</Text>
              <Text>
                2. A JSON payload containing a list of events happening within a
                small window of time (for the given subscription and merchant)
                returned in the header. Each event contains:
              </Text>
              <div className={css(styles.indent)}>
                <Markdown
                  className={css(styles.paragraph)}
                  text={
                    i`a. **Data.** In the same schema as the V3 RESTful API schema.` +
                    "\n\n" +
                    i`b. **Timestamp.** Representing the time when this event ` +
                    i`happened.`
                  }
                />
              </div>
            </div>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="headers">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Headers
            </Text>
            <HeadersTable />
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="body">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Body
            </Text>
            <Text weight="bold">Example payload:</Text>
            <div className={css(styles.paragraph, styles.code)}>
              {`
[
  {
    "data": {
      "id": "5f3512807dbde500568873ae",
      "campaign_name": "campaign1",
      "total_campaign_spend": {
        "amount": 0,
        "currency_code": "USD"
      },
      ...
    },
    "timestamp": 1615579054
  },
  {
    "data": {
      "id": "5f3512807dbde500568873af",
      "campaign_name": "campaign2",
      "total_campaign_spend": {
        "amount": 0,
        "currency_code": "USD"
      },
      ...
    },
    "timestamp": 1615579137
  }
]
              `}
            </div>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="verifying-webhooks">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Verifying Webhooks
            </Text>
            <Markdown
              className={css(styles.paragraph)}
              text={
                i`Each webhook request includes a base64 encoded **Wish-Hmac-Sha256** ` +
                i`header, which is generated using the latest client secret from your app.`
              }
            />
            <Markdown
              className={css(styles.paragraph)}
              text={
                i`To verify the request originates from Wish, you can compute the ` +
                i`HMAC using the following Python code, and compare it with the ` +
                i`**Wish-Hmac-Sha256** header.`
              }
            />
            <div className={css(styles.paragraph, styles.code)}>
              {`
def verify_webhook(data, hmac_header):
  digest = hmac.new(SECRET, data.encode('utf-8'), hashlib.sha256).digest()
  computed_hmac = base64.b64encode(digest)
  return hmac.compare_digest(computed_hmac, hmac_header.encode('utf-8'))

data = request.get_data()
verified = verify_webhook(data, request.headers.get('Wish-Hmac-Sha256')) //
True or False
              `}
            </div>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="responding-to-a-webhook">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Responding to a Webhook
            </Text>
            <Text className={css(styles.paragraph)}>
              Your application acknowledges that it received the webhook
              notification by sending an HTTP 200 OK response to us within 5
              seconds. Wish will designate the webhook notification an error
              response if either of the following happens:
            </Text>
            <div className={css(styles.paragraph, styles.indent)}>
              <Text>
                1. Your server responds with a code outside of the 200 range,
                including the 3XX HTTP redirection code.
              </Text>
              <Text>2. Your server does not respond within 5 seconds.</Text>
            </div>
            <Text className={css(styles.paragraph)} weight="bold">
              To avoid timeout, it is recommended that you send the HTTP 200
              response right after receiving the message, before you start
              processing the message.
            </Text>
          </div>
        </ScrollableAnchor>
        <ScrollableAnchor id="handling-a-failed-delivery">
          <div className={css(styles.subSection)}>
            <Text className={css(styles.subheading)} weight="bold">
              Handling Failed Delivery
            </Text>
            <Markdown
              className={css(styles.paragraph)}
              text={
                i`For each webhook notification with an **error response**, we will ` +
                i`retry the relevant notification every hour for the next 24 hours ` +
                i`after the initial error response (25 attempts in total). If all 24 ` +
                i`retry attempts fail consecutively, we will deactivate the ` +
                i`subscription.`
              }
            />
            <Text className={css(styles.paragraph)}>
              After your subscription gets deactivated, in order to continue to
              receive webhooks, you will need to reactivate your subscription
              via UI (or via API for private apps). You can use the same
              endpoint during reactivation (assuming you have fixed your
              endpoint), or choose to use a different endpoint.
            </Text>
          </div>
        </ScrollableAnchor>
      </div>

      <div className={css(styles.section)}>
        <H4 className={css(styles.heading)}>Webhook Events</H4>
        <ScrollableAnchor id="orders">
          <div className={css(styles.subSection)}>
            <div>
              <Text className={css(styles.subheading)} weight="bold">
                Orders
              </Text>
            </div>
            <OrderEventsTable />
          </div>
        </ScrollableAnchor>
        {showTicketEventPublishing && !showTicketEventPublishingLoading && (
          <ScrollableAnchor id="tickets">
            <div className={css(styles.subSection)}>
              <Text className={css(styles.subheading)} weight="bold">
                Tickets
              </Text>
              <TicketEventsTable />
            </div>
          </ScrollableAnchor>
        )}
        {showPenaltyEventPublishing && !showPenaltyEventPublishingLoading && (
          <ScrollableAnchor id="penalties">
            <div className={css(styles.subSection)}>
              <Text className={css(styles.subheading)} weight="bold">
                Penalties
              </Text>
              <PenaltyEventsTable />
            </div>
          </ScrollableAnchor>
        )}
      </div>
    </PageGuide>
  );
};

const useStylesheet = () => {
  const { greenSurface, textBlack, textWhite, lightGreenSurface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: 48,
        },
        title: {
          fontFamily: fonts.ibm,
          fontWeight: fonts.weightBold,
          color: textBlack,
          fontSize: 40,
          marginBottom: 32,
          letterSpacing: "0.05em",
          lineHeight: "48px",
        },
        heading: {
          marginBottom: 16,
        },
        subheading: {
          fontSize: 14,
          lineHeight: "20px",
          color: greenSurface,
          textTransform: "uppercase",
          marginBottom: 8,
        },
        paragraph: {
          ":not(:last-child)": {
            marginBottom: 32,
          },
        },
        subSection: {
          ":not(:last-child)": {
            marginBottom: 48,
          },
        },
        section: {
          color: textBlack,
          marginBottom: 160,
        },
        code: {
          fontSize: 12,
          fontFamily: fonts.ibm,
          color: lightGreenSurface,
          backgroundColor: textBlack,
          padding: "4px 8px",
          borderRadius: 4,
          whiteSpace: "pre",
          display: "inline-block",
          letterSpacing: "0.005em",
        },
        callout: {
          color: textBlack,
          background: textWhite,
          padding: 32,
        },
        indent: {
          paddingLeft: 16,
        },
      }),
    [greenSurface, textBlack, textWhite, lightGreenSurface],
  );
};

export default observer(BasePage);
