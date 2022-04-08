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
import { AlertList, AlertType, Markdown } from "@ContextLogic/lego";
import CountryShipping from "./CountryShipping";

/* Type Imports */
import ProductShippingEditState from "@merchant/model/products/ProductShippingEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly editState: ProductShippingEditState;
};

const CustomizeShippingSection: React.FC<Props> = ({ editState }: Props) => {
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
        i`refunds associated with the order. `,
      sentiment: "info",
      title: i`Provide Accurate Values`,
    });
  }

  return (
    <div className={css(styles.root)}>
      {editState.showAdvancedSection && (
        <Markdown
          className={css(styles.description)}
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
      )}
      <AlertList alerts={alerts} />
      <CountryShipping editState={editState} />
    </div>
  );
};

export default observer(CustomizeShippingSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        description: {
          marginBottom: 24,
        },
      }),
    []
  );
};
