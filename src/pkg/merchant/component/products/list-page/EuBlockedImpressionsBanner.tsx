import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import gql from "graphql-tag";
import { useQuery, ApolloProvider } from "@apollo/client";

/* Lego Components */
import { Tip, Markdown, Text, Layout, Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useApolloStore } from "@stores/ApolloStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { MerchantSchema } from "@schema/types";

const HAS_IMPRESSIONS_BLOCK = gql`
  query HasImpressionsBlock_EuBlockedImpressionsBanner {
    currentMerchant {
      hasEuComplianceImpressionBlock
    }
  }
`;

export type HasImpressionsResponseType = {
  readonly currentMerchant: Pick<
    MerchantSchema,
    "hasEuComplianceImpressionBlock"
  >;
};

const EuBlockedImpressionsBannerContent = (props: BaseProps) => {
  const { className, style } = props;
  const styles = useStyleSheet();

  const { warning } = useTheme();

  const learnMoreUrl = zendeskURL("4402059013915");

  const { data } = useQuery<HasImpressionsResponseType, void>(
    HAS_IMPRESSIONS_BLOCK,
    {},
  );

  if (data == null || !data.currentMerchant.hasEuComplianceImpressionBlock) {
    return null;
  }

  return (
    <Tip color={warning} icon="warning" className={css(className, style)}>
      <Layout.FlexRow justifyContent="space-between">
        <Layout.FlexColumn>
          <Text weight="bold">Blocked EU Product Impressions</Text>
          <Markdown
            text={
              i`Your product impressions (and in effect, sales) in the EU and Northern ` +
              i`Ireland for CE-marked or relevant products will be blocked until a Responsible ` +
              i`Person is added. [Learn more](${learnMoreUrl})`
            }
            className={css(styles.text)}
            openLinksInNewTab
          />
        </Layout.FlexColumn>
        <Button
          href="/product/responsible-person"
          openInNewTab
          className={css(styles.button)}
        >
          Add Responsible Persons
        </Button>
      </Layout.FlexRow>
    </Tip>
  );
};

const EuBlockedImpressionsBanner = () => {
  const { client } = useApolloStore();

  return (
    <ApolloProvider client={client}>
      <EuBlockedImpressionsBannerContent />
    </ApolloProvider>
  );
};

export default EuBlockedImpressionsBanner;

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        text: {
          marginTop: 4,
        },
        button: {
          marginLeft: 16,
        },
      }),
    [],
  );
