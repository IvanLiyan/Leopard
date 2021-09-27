/*
 * CurrencySettings.tsx
 *
 * Created by Jonah Dlin on Fri Jul 02 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Model */
import ProductEditState from "@plus/model/ProductEditState";

/* Toolkit */
import { BaseProps } from "@toolkit/api";
import { Text, Alert, Layout, Markdown, FormSelect } from "@ContextLogic/lego";

type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const CurrencySettings = ({ className, style, editState }: Props) => {
  const viewPaymentSettingsLink = "";

  return (
    <Alert
      className={css(className, style)}
      sentiment="info"
      iconVerticalAlignment="center"
      text={() => (
        <Layout.FlexRow justifyContent="space-between">
          <Layout.FlexColumn>
            <Text weight="semibold">Currency settings</Text>
            <Markdown
              text={
                i`Select a currency code to be used for setting product and shipping` +
                i`prices, as well as receiving payouts from Wish. ` +
                i`[View Payment Settings](${viewPaymentSettingsLink})`
              }
            />
          </Layout.FlexColumn>
          <FormSelect
            onSelected={() => {}}
            selectedValue="USD"
            options={[
              {
                value: "USD",
                text: "USD",
              },
            ]}
          />
        </Layout.FlexRow>
      )}
    />
  );
};

export default observer(CurrencySettings);
