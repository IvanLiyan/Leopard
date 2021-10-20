import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Text, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeciderKey } from "@stores/ExperimentStore";

export type Props = BaseProps;

const Navbar = (props: Props) => {
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

  return (
    <Layout.FlexColumn className={css(styles.root, className, style)}>
      <div className={css(styles.section)}>
        <Text className={css(styles.header)}>Webhooks</Text>
        <Layout.FlexColumn className={css(styles.linkSection)}>
          <Link className={css(styles.link)} href="#why-webhooks">
            Why Webhooks?
          </Link>
        </Layout.FlexColumn>
      </div>

      <div className={css(styles.section)}>
        <Text className={css(styles.header)}>Features</Text>
        <Layout.FlexColumn className={css(styles.linkSection)}>
          <Link className={css(styles.link)} href="#timeliness">
            Timelines
          </Link>
          <Link className={css(styles.link)} href="#message-ordering">
            Message Ordering
          </Link>
          <Link className={css(styles.link)} href="#schema-consistency">
            Schema Consistency
          </Link>
        </Layout.FlexColumn>
      </div>

      <div className={css(styles.section)}>
        <Text className={css(styles.header)}>Managing Subscriptions</Text>
        <Layout.FlexColumn className={css(styles.linkSection)}>
          <Link className={css(styles.link)} href="#ui">
            UI
          </Link>
          <Link className={css(styles.link)} href="#api">
            API
          </Link>
          <Link className={css(styles.link)} href="#test-endpoint">
            Test Endpoint
          </Link>
        </Layout.FlexColumn>
      </div>

      <div className={css(styles.section)}>
        <Text className={css(styles.header)}>Integrating Webhooks</Text>
        <Layout.FlexColumn className={css(styles.linkSection)}>
          <Link className={css(styles.link)} href="#data-format">
            Data Format
          </Link>
          <Link className={css(styles.link)} href="#headers">
            Headers
          </Link>
          <Link className={css(styles.link)} href="#body">
            Body
          </Link>
          <Link className={css(styles.link)} href="#verifying-webhooks">
            Verifying Webhooks
          </Link>
          <Link className={css(styles.link)} href="#responding-to-a-webhook">
            Responding to a Webhook
          </Link>
          <Link className={css(styles.link)} href="#handling-a-failed-delivery">
            Handling Failed Delivery
          </Link>
        </Layout.FlexColumn>
      </div>

      <Layout.FlexColumn className={css(styles.section)}>
        <Text className={css(styles.header)}>Webhook Events</Text>
        <Layout.FlexColumn className={css(styles.linkSection)}>
          <Link className={css(styles.link)} href="#orders">
            Orders
          </Link>
          {showTicketEventPublishing && !showTicketEventPublishingLoading && (
            <Link className={css(styles.link)} href="#tickets">
              Tickets
            </Link>
          )}
          {showPenaltyEventPublishing && !showPenaltyEventPublishingLoading && (
            <Link className={css(styles.link)} href="#penalties">
              Penalties
            </Link>
          )}
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};
export default observer(Navbar);

const useStylesheet = () => {
  const { textBlack, lightPurpleSurface, pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "48px 32px",
          backgroundColor: textBlack,
        },
        section: {
          marginBottom: 48,
        },
        linkSection: {
          marginLeft: 16,
          marginTop: 8,
        },
        header: {
          color: pageBackground,
          fontSize: 16,
          lineHeight: "24px",
          marginBottom: 16,
        },
        link: {
          marginBottom: 8,
          fontSize: 16,
          lineHeight: "24px",
          color: lightPurpleSurface,
        },
        linkSpace: {
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
      }),
    [textBlack, lightPurpleSurface, pageBackground],
  );
};
