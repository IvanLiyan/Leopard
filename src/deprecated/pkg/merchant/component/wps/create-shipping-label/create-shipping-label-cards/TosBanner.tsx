/*
 * TosBanner.tsx
 *
 * Created by Jonah Dlin on Thu Apr 15 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import {
  Banner,
  CheckboxField,
  Layout,
  Markdown,
  Text,
} from "@ContextLogic/lego";

/* Toolkit */
import { css } from "@toolkit/styling";
import {
  PrivacyPolicySectionId,
  TermsOfUseSectionId,
} from "@toolkit/wps/terms-of-service";

type Props = BaseProps & {
  readonly hideWpsLinks?: boolean;
  readonly isWpsChecked: boolean;
  readonly onCheckWps: () => unknown;
  readonly disableCheckboxes: boolean;
};

const TosBanner: React.FC<Props> = ({
  className,
  style,
  hideWpsLinks,
  isWpsChecked,
  onCheckWps,
  disableCheckboxes,
}: Props) => {
  const styles = useStylesheet();

  const wpsTosLink = `/shipping-label/terms-of-service#${TermsOfUseSectionId}`;
  const wpsPpLink = `/shipping-label/terms-of-service#${PrivacyPolicySectionId}`;
  const wpsText = hideWpsLinks
    ? i`I confirm that I have read and accepted Terms of Use and Privacy Policy of ` +
      i`Wish Parcel.`
    : i`I confirm that I have read and accepted [Terms of Use](${wpsTosLink}) and ` +
      i`[Privacy Policy](${wpsPpLink}) of Wish Parcel.`;

  return (
    <Banner
      className={css(className, style)}
      sentiment="warning"
      iconVerticalAlignment="top"
      contentAlignment="left"
    >
      <Layout.FlexColumn>
        <Text
          className={css(styles.text, styles.bottomMargins)}
          weight="semibold"
        >
          Please read and accept the Terms of Services and Privacy Policy before
          proceeding.
        </Text>
        {!isWpsChecked && (
          <Layout.FlexRow
            className={css(styles.bottomMargins)}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <CheckboxField
              checked={isWpsChecked}
              onChange={onCheckWps}
              disabled={disableCheckboxes}
            />
            <Markdown
              className={css(styles.text)}
              text={wpsText}
              openLinksInNewTab
            />
          </Layout.FlexRow>
        )}
      </Layout.FlexColumn>
    </Banner>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          fontSize: 14,
          lineHeight: "20px",
        },
        bottomMargins: {
          ":not(:last-child)": {
            marginBottom: 12,
          },
        },
      }),
    []
  );
};

export default observer(TosBanner);
