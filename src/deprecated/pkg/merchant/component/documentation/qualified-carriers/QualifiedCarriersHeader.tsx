import React, { useMemo } from "react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H4, Markdown } from "@ContextLogic/lego";
import Icon from "@merchant/component/core/Icon";

/* Lego Toolkit */
import { zendeskURL } from "@toolkit/url";
import Illustration from "@merchant/component/core/Illustration";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type QualifiedCarriersHeaderProps = BaseProps;

const QualifiedCarriersHeader = (props: QualifiedCarriersHeaderProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const confirmedDeliveryCarrierLink = zendeskURL("115005882948");
  const pcVatCompliantLink = zendeskURL("360034845594");
  const learnMoreLink = zendeskURL("360008375333");

  return (
    <Layout.FlexRow style={styles.root} justifyContent="space-between">
      <Layout.FlexColumn>
        <H4>Qualified Carriers</H4>
        <Markdown
          style={styles.description}
          openLinksInNewTab
          text={
            i`You are responsible for shipping all orders with a Qualified Carrier. ` +
            i`Additionally, orders bound to certain destinations and above a certain ` +
            i`order value must use a [Confirmed Delivery Carrier]` +
            i`(${confirmedDeliveryCarrierLink}) for shipping. Orders above a certain order ` +
            i`value and bound for the United Kingdom or European Union must use a ` +
            i`carrier that is [PC-VAT-compliant](${pcVatCompliantLink}) for shipping.`
          }
        />
        <Layout.FlexRow style={styles.infoContainer}>
          {!isSmallScreen && <Icon style={styles.info} name="info" size={24} />}
          <Markdown
            style={styles.info}
            openLinksInNewTab
            text={
              i`**WishPost** is the only accepted shipping carrier for **orders shipped** ` +
              i`**from Mainland China**. [Learn more](${learnMoreLink})`
            }
          />
        </Layout.FlexRow>
      </Layout.FlexColumn>
      {!isSmallScreen && (
        <Illustration
          style={styles.illustration}
          name="qualifiedCarriers"
          alt={i`Qualified Carriers`}
        />
      )}
    </Layout.FlexRow>
  );
};

export default observer(QualifiedCarriersHeader);

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: `24px 64px`,
          width: "calc(100% - 128px)",
          backgroundColor: surfaceLightest,
        },
        description: {
          marginTop: 8,
        },
        infoContainer: {
          marginTop: 24,
        },
        info: {
          marginRight: 16,
        },
        illustration: {
          marginLeft: 100,
          minWidth: 200,
        },
      }),
    [surfaceLightest]
  );
};
