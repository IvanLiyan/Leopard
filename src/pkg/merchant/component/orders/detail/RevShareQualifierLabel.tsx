/*
 * RevShareQualifierLabel.tsx
 *
 * Created by Jonah Dlin on Wed Jul 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Text, ThemedLabel, Markdown, Layout } from "@ContextLogic/lego";

import { zendeskURL } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";
import { CountryCode, RevShareQualifier } from "@schema/types";

import { Flag, Illustration, IllustrationName } from "@merchant/component/core";

type BadgeInfo = {
  readonly title: string;
  readonly prefix?: string;
  readonly flag?: CountryCode | "EU";
  readonly illustration?: IllustrationName;
  readonly popoverContent?: string | (() => React.ReactNode);
};

type Props = BaseProps & {
  readonly qualifier: RevShareQualifier;
};

const RevShareQualifierLabel: React.FC<Props> = ({
  className,
  style,
  qualifier,
}: Props) => {
  const styles = useStylesheet();

  const renderDestinationPopover = () => {
    return (
      <Layout.FlexColumn className={css(styles.popover)}>
        <Text className={css(styles.popoverText)} weight="semibold">
          Destination
        </Text>
        <Text className={css(styles.popoverText)}>
          The order's destination is used to calculate its revenue share
          percentage.
        </Text>
      </Layout.FlexColumn>
    );
  };
  const renderOriginPopover = () => {
    return (
      <Layout.FlexColumn className={css(styles.popover)}>
        <Text className={css(styles.popoverText)} weight="semibold">
          Origin
        </Text>
        <Text className={css(styles.popoverText)}>
          The order's origin region is used to calculate its revenue share
          percentage.
        </Text>
      </Layout.FlexColumn>
    );
  };
  const renderLegalEstablishmentPopover = () => {
    return (
      <Layout.FlexColumn className={css(styles.popover)}>
        <Text className={css(styles.popoverText)} weight="semibold">
          Legal Establishment
        </Text>
        <Text className={css(styles.popoverText)}>
          Your region of domicile or legal establishment is used to calculate
          this order's revenue share percentage.
        </Text>
      </Layout.FlexColumn>
    );
  };
  const renderWishExpressPopover = () => {
    return (
      <Text className={css(styles.popover, styles.popoverText)}>
        The order's Wish Express status is used to calculate its revenue share
        percentage.
      </Text>
    );
  };
  const renderCategoryPopover = () => {
    return (
      <Layout.FlexColumn className={css(styles.popover)}>
        <Text className={css(styles.popoverText)} weight="semibold">
          Product Category
        </Text>
        <Markdown
          className={css(styles.popoverText)}
          text={
            i`The order's product category is used to calculate its revenue share ` +
            i`percentage. If multiple product categories are shown here, the category that ` +
            i`receives the lowest revenue share is used for calculation here. Merchants may ` +
            i`dispute product category. [Learn more](${zendeskURL(
              "4403535077403"
            )})`
          }
        />
      </Layout.FlexColumn>
    );
  };

  const QualifierBadgeMap: {
    readonly [badge in RevShareQualifier]: BadgeInfo;
  } = {
    ENTITY_EU: {
      title: i`EU`,
      flag: "EU",
      prefix: i`Legal Establishment`,
      popoverContent: renderLegalEstablishmentPopover,
    },
    ENTITY_NA: {
      title: i`NA`,
      prefix: i`Legal Establishment`,
      popoverContent: renderLegalEstablishmentPopover,
    },
    SOURCE_EU: {
      title: i`EU`,
      flag: "EU",
      prefix: i`Origin`,
      popoverContent: renderOriginPopover,
    },
    SOURCE_NA: {
      title: i`NA`,
      prefix: i`Origin`,
      popoverContent: renderOriginPopover,
    },
    DEST_EU: {
      title: i`EU`,
      flag: "EU",
      prefix: i`Destination`,
      popoverContent: renderDestinationPopover,
    },
    DEST_NA: {
      title: i`NA`,
      prefix: i`Destination`,
      popoverContent: renderDestinationPopover,
    },
    CATEGORY_SEX_TOY: {
      title: i`Sex Toys`,
      popoverContent: renderCategoryPopover,
    },
    CATEGORY_HOUSEHOLD: {
      title: i`Household Supplies`,
      popoverContent: renderCategoryPopover,
    },
    IS_WISH_EXPRESS: {
      title: i`Wish Express`,
      illustration: "wishExpressTruck",
      popoverContent: renderWishExpressPopover,
    },
  };

  const {
    title: titleText,
    prefix: prefixText,
    illustration: illustrationName,
    flag: flagName,
    popoverContent,
  } = QualifierBadgeMap[qualifier];

  return (
    <ThemedLabel
      className={css(
        className,
        style,
        popoverContent != null && styles.cursorPointer
      )}
      theme="LightGrey"
      popoverContent={popoverContent}
    >
      <Layout.FlexRow
        className={css(styles.labelContent)}
        alignItems="center"
        justifyContent="center"
      >
        {prefixText != null && (
          <Layout.FlexRow>
            <Text className={css(styles.text, styles.prefixText)}>
              {prefixText}
            </Text>
            <Text className={css(styles.text, styles.prefixDot)}>•</Text>
          </Layout.FlexRow>
        )}
        {flagName != null && (
          <Layout.FlexRow
            className={css(styles.flagContainer)}
            alignItems="center"
            justifyContent="center"
          >
            <Flag className={css(styles.flag)} countryCode={flagName} />
          </Layout.FlexRow>
        )}
        {illustrationName != null && (
          <Illustration
            className={css(styles.icon)}
            name={illustrationName}
            alt={illustrationName}
          />
        )}
        {titleText != null && (
          <Text className={css(styles.text)}>{titleText}</Text>
        )}
      </Layout.FlexRow>
    </ThemedLabel>
  );
};

export default observer(RevShareQualifierLabel);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        cursorPointer: {
          cursor: "pointer",
        },
        labelContent: {
          margin: "5px 0",
        },
        flagContainer: {
          height: 20,
          width: 20,
          overflow: "hidden",
          borderRadius: "50%",
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        flag: {
          height: 20,
          maxWidth: "unset",
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        icon: {
          height: 20,
          width: 20,
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        text: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        prefixText: {
          marginRight: 8,
        },
        prefixDot: {
          marginRight: 8,
        },
        popover: {
          padding: 15,
          maxWidth: 250,
        },
        popoverText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
      }),
    [textDark, textBlack]
  );
};
