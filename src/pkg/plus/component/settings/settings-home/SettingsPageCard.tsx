/*
 * SettingsPageCard.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/02/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Text, Link, Layout, Markdown } from "@ContextLogic/lego";
import { useNodeCount, NavigationNode } from "@toolkit/chrome";
import NotificationCountBadge from "@merchant/component/nav/chrome/badges/NotificationCountBadge";
import VerificationStatusLabel from "@plus/component/seller-verification/VerificationStatusLabel";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

import { SettingsHomeInitialData } from "@toolkit/settings-home";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly initialData: SettingsHomeInitialData;
};

const SettingsPageCard: React.FC<Props> = (props: Props) => {
  const { className, style, node, initialData } = props;
  const { label, description, path, nodeid, url } = node;
  const {
    currentMerchant: { sellerVerification },
  } = initialData;
  const [highlight, setHighlight] = useState(false);
  const styles = useStylesheet(highlight);
  const notificationCount = useNodeCount(node);

  const notificationCountNode = notificationCount && (
    <NotificationCountBadge count={notificationCount} />
  );

  const renderAccountSettingsLabel = () => {
    const {
      status,
      isKycVerification,
      gmvCapReached,
      canStart,
      kycVerification,
    } = sellerVerification;
    if (status == null || (isKycVerification && !kycVerification.canStart)) {
      return null;
    }
    return (
      <VerificationStatusLabel
        status={status}
        gmvCapReached={gmvCapReached}
        isKycVerification={isKycVerification}
        canStart={isKycVerification ? kycVerification.canStart : canStart}
      />
    );
  };

  const renderLabel = () => {
    if (nodeid == "account-settings") {
      return renderAccountSettingsLabel();
    }

    return null;
  };

  return (
    <Link
      className={css(styles.root, className, style)}
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      href={path || url}
      fadeOnHover={false}
    >
      <Card
        className={css(styles.cardOuter)}
        contentContainerStyle={css(styles.cardInner)}
      >
        {/* temporarily removed until we re-work svgs */}
        {/* <Icon
          name={highlight ? "gearDarkPalaceBlue" : "gearLightGrey"}
          className={css(styles.icon)}
        /> */}
        <Layout.FlexColumn className={css(styles.text)}>
          <Layout.FlexRow className={css(styles.titleRow)}>
            <Markdown className={css(styles.title)} text={label} />
            {notificationCountNode}
            {renderLabel()}
          </Layout.FlexRow>
          <Text className={css(styles.description)}>{description}</Text>
        </Layout.FlexColumn>
      </Card>
    </Link>
  );
};

export default observer(SettingsPageCard);

const useStylesheet = (highlight: ConstrainBoolean) => {
  const { primary, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          cursor: "pointer",
          maxHeight: 140,
        },
        cardOuter: {
          borderColor: highlight ? primary : undefined,
          height: "100%",
          width: "100%",
        },
        cardInner: {
          padding: "20px 30px", // revert to 20 when adding icons back in
          display: "flex",
          overflow: "hidden",
        },
        icon: {
          height: 30,
          width: 30,
          marginRight: 20,
          flexShrink: 0,
        },
        titleRow: {
          paddingBottom: 12,
        },
        title: {
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          fontWeight: weightSemibold,
          color: highlight ? primary : undefined,
          paddingRight: 8,
          minHeight: 24, // account for notification node when it isn't present
        },
        text: {
          color: textLight,
          overflow: "hidden",
          flex: 1,
          maxHeight: "100%",
        },
        description: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
        },
      }),
    [highlight, primary, textLight],
  );
};
