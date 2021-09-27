/*
 *
 * EditShippingProfileUpperArea.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/25/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Field, TextInput, Markdown } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import ShippingProfileState from "@plus/model/ShippingProfileState";

type Props = BaseProps & {
  readonly profileState: ShippingProfileState;
};

const EditShippingProfileUpperArea: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, profileState } = props;
  const { linkedProductCount } = profileState;

  const linkedProfilesText = ni18n(
    linkedProductCount,
    "1 product linked",
    "**%1$s** products linked"
  );

  return (
    <section className={css(styles.root, style, className)}>
      <div className={css(styles.description)}>
        Once listings are linked to a shipping profile, any changes to the
        profile will immediately apply to all linked listings. Customers will
        not see your shipping profile name.
      </div>
      <Field title={i`Profile name`}>
        <div className={css(styles.field)}>
          <TextInput
            placeholder={i`Name your shipping profile`}
            value={profileState.name}
            onChange={({ text }) => (profileState.name = text)}
            debugValue={faker.company.catchPhrase()}
            className={css(styles.input)}
          />
          <Markdown
            text={
              linkedProductCount == 0
                ? i`No products linked yet`
                : linkedProfilesText
            }
            className={css(styles.linkedProducts)}
          />
        </div>
      </Field>
    </section>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "10px 20px",
          alignItems: "stretch",
        },
        description: {
          margin: "20px 0px",
        },
        field: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        input: {
          "@media (min-width: 900px)": {
            width: "50%",
          },
        },
        linkedProducts: {
          marginLeft: 10,
        },
      }),
    []
  );
};

export default observer(EditShippingProfileUpperArea);
