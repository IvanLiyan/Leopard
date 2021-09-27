import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Layout, Text, Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { Illustration, IllustrationName } from "@merchant/component/core";

type Props = BaseProps;

type InfoCard = {
  readonly text: string;
  readonly url: string;
  readonly illustName: IllustrationName;
};

const InfoCards = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  const renderInfoCard = ({ text, url, illustName }: InfoCard) => {
    return (
      <Card className={css(styles.card)}>
        <Layout.FlexRow alignItems="stretch">
          <Layout.FlexColumn justifyContent="center">
            <Illustration
              name={illustName}
              alt={illustName}
              className={css(styles.smallIcon)}
            />
          </Layout.FlexColumn>
          <Layout.FlexColumn justifyContent="space-between">
            <Text weight="semibold">{text}</Text>
            <div className={css(styles.smallMargin)}>
              <Link href={url} openInNewTab>
                Learn more{" "}
              </Link>
            </div>
          </Layout.FlexColumn>
        </Layout.FlexRow>
      </Card>
    );
  };

  return (
    <Layout.GridRow
      templateColumns="1fr 1fr 1fr"
      smallScreenTemplateColumns="1fr"
      gap={33}
      className={css(className, style)}
    >
      {renderInfoCard({
        text: i`What is Market Surveillance Regulation (EU) 2019/1020?`,
        url:
          "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32019R1020",
        illustName: "order",
      })}
      {renderInfoCard({
        text: i`What happens to my products if I’m not compliant?`,
        url: "/policy#product_compliance",
        illustName: "notepadList",
      })}
      {renderInfoCard({
        text: i`How do I obtain an EU responsible person for my products?`,
        url: zendeskURL("4402059013915"),
        illustName: "boxWithBlueRibbon",
      })}
    </Layout.GridRow>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flex: 1,
          padding: 24,
        },
        smallIcon: {
          width: 56,
          paddingRight: 16,
        },
        smallMargin: {
          marginTop: 8,
        },
      }),
    []
  );
};

export default observer(InfoCards);
