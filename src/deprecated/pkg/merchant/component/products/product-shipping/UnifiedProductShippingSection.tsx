/*
 *
 * CustomizeShippingSection.tsx
 *
 * Created by Yuqing He on 10/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  AlertList,
  AlertType,
  Layout,
  Markdown,
  Label,
  Text,
  Info,
} from "@ContextLogic/lego";
import CountryShipping from "./CountryShipping";

/* Type Imports */
import ProductShippingEditState from "@merchant/model/products/ProductShippingEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import DefaultShippingSection from "./DefaultShippingSection";
import AdvancedLogisticsSection from "./AdvancedLogisticsSection";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly editState: ProductShippingEditState;
};

const UnifiedProductShippingSection: React.FC<Props> = ({
  editState,
}: Props) => {
  const { greenSurface, textWhite } = useTheme();
  const styles = useStylesheet();
  const alerts: Array<AlertType> = [];

  if (editState.showTTDColumn) {
    alerts.push({
      text:
        i`Max Delivery Days is the maximum delivery timeline shown to ` +
        i`customers on when they can expect your product to be delivered. ` +
        i`It is based on the number of business days it takes for an order to ` +
        i`be processed and delivered to your customer’s door. If you do not ` +
        i`provide a value, the default will be based on your historical delivery times.`,
      sentiment: "info",
      title: i`Max Delivery Days`,
    });
    alerts.push({
      text:
        i`If an order is not confirmed delivered within the Max Delivery ` +
        i`Days provided for that destination, you will be responsible for any ` +
        i`refunds associated with the order.`,
      sentiment: "info",
      title: i`Provide Accurate Values`,
    });
  }

  return (
    <Layout.FlexColumn alignItems="stretch">
      {editState.showAdvancedSection && (
        <div className={css(styles.section)}>
          <Layout.FlexRow>
            <Label
              style={styles.label}
              textColor={textWhite}
              backgroundColor={greenSurface}
              borderRadius={4}
            >
              New
            </Label>
            <Text weight="bold" style={styles.subtitle}>
              Calculated Shipping
            </Text>
          </Layout.FlexRow>
          <AdvancedLogisticsSection editState={editState} />
        </div>
      )}
      <div className={css(styles.section)}>
        <Layout.FlexRow>
          <Text weight="bold" style={styles.subtitle}>
            Default Shipping Price
          </Text>
          <Info
            style={styles.info}
            text={
              i`Shipping price that applies to all orders, unless customized by ` +
              i`using calculated shipping or entering a country shipping price`
            }
            position="right"
            sentiment="info"
          />
        </Layout.FlexRow>
        <DefaultShippingSection editState={editState} />
      </div>
      <div className={css(styles.section)}>
        <Text weight="bold" style={styles.subtitle}>
          Country Shipping Prices
        </Text>
        {editState.showAdvancedSection &&
          (editState.isMerchantInCalculatedShippingBeta ? (
            <Markdown
              style={styles.description}
              text={
                i`View or customize country shipping prices in the table below. ` +
                i`If you selected calculated shipping for countries/regions in ` +
                i`the Advanced Logistics Program, then the table will reflect that. ` +
                i`For all other countries/regions, if you don’t customize the ` +
                i`country shipping price, then your default shipping price will apply.`
              }
            />
          ) : (
            <Markdown
              style={styles.description}
              text={
                i`For destination countries/regions that are currently not included ` +
                i`in Wish’s unification initiative (see details above), you may ` +
                i`customize the Shipping Price for a specifically enabled destination ` +
                i`country/region by inputting a Shipping Price. Otherwise, your Default ` +
                i`Shipping Price will be used, as well as for any new destination ` +
                i`country(ies)/region(s) added. For Unity countries, the shipping price ` +
                i`is automatically calculated. To add new countries/regions you ship ` +
                i`to, please visit your [Shipping Settings](${"/shipping-settings"}).`
              }
            />
          ))}
        <AlertList alerts={alerts} />
        <CountryShipping editState={editState} />
      </div>
    </Layout.FlexColumn>
  );
};

export default observer(UnifiedProductShippingSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          marginBottom: 10,
        },
        subtitle: {
          fontSize: 16,
          marginBottom: 10,
        },
        description: {
          marginBottom: 24,
        },
        label: {
          marginRight: 10,
          marginBottom: 10,
        },
        info: {
          marginBottom: 10,
          marginLeft: 10,
        },
      }),
    []
  );
};
