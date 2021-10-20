import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import {
  Card,
  Accordion,
  H5,
  Link,
  LinkProps,
  Layout,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Type Imports */
import { IconName, DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { Page, LogEventNames } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

type Props = BaseProps & {
  readonly title: string;
  readonly titleIconName: IconName;
  readonly content?: React.ReactNode;
  readonly learnMore: React.ReactNode | string;
  readonly linkTitle: string;
  readonly linkUrl: LinkProps["href"];
  readonly linkOnClick?: LinkProps["onClick"];
  readonly dateSnapshot?: string | null;
  readonly aboveThreshold?: boolean;
};

const BaseStoreHealthCard = (props: Props) => {
  const {
    className,
    style,
    title,
    titleIconName,
    content,
    learnMore,
    linkTitle,
    linkUrl,
    linkOnClick,
    aboveThreshold = false,
    dateSnapshot,
  } = props;
  const styles = useStylesheet();
  const [isOpen, setIsOpen] = useState(false);

  const getAccordionLoggerEvent = (
    title: string,
  ): keyof typeof LogEventNames => {
    if (title.toLowerCase().includes("shipping")) {
      return "SHIPPING_LEARN_MORE";
    } else if (title.toLowerCase().includes("product compliance")) {
      return "PRODUCT_COMPLIANCE_LEARN_MORE";
    } else if (title.toLowerCase().includes("refunds")) {
      return "REFUNDS_LEARN_MORE";
    } else if (title.toLowerCase().includes("rating")) {
      return "RATINGS_LEARN_MORE";
    }
    return "CS_LEARN_MORE";
  };

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={css(
        styles.containerStyle,
        aboveThreshold && styles.aboveThresh,
      )}
    >
      <Layout.FlexColumn
        justifyContent="space-between"
        className={css(styles.cardContent)}
      >
        <Layout.FlexRow justifyContent="space-between">
          <Layout.FlexRow>
            <Icon name={titleIconName} className={css(styles.icon)} />
            <H5>{title}</H5>
          </Layout.FlexRow>
          <Link href={linkUrl} onClick={linkOnClick} openInNewTab>
            {linkTitle}
          </Link>
        </Layout.FlexRow>
        {content}
      </Layout.FlexColumn>
      <div>
        {dateSnapshot && <div className={css(styles.date)}>{dateSnapshot}</div>}
        <div className={css(styles.separator)} />
        <Accordion
          header={i`Learn more`}
          onOpenToggled={async (isOpen) => {
            if (isOpen) {
              await logger({
                action: "CLICK_DROPDOWN",
                event_name: getAccordionLoggerEvent(title),
                page: Page.storeHealth,
              });
            }
            setIsOpen(isOpen);
          }}
          isOpen={isOpen}
          headerPadding="10px 25px"
          headerContainerStyle={styles.accordionContainer}
          hideLines={false}
        >
          <div className={css(styles.accordionBody)}>{learnMore}</div>
        </Accordion>
      </div>
    </Card>
  );
};

export default BaseStoreHealthCard;

const useStylesheet = () => {
  const { borderPrimary, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        containerStyle: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        accordionBody: {
          padding: "16px 57px",
        },
        accordionContainer: {
          borderRadius: 4,
        },
        cardContent: {
          padding: 24,
        },
        icon: {
          marginRight: 8,
        },
        separator: {
          borderTop: `1px ${borderPrimary} solid`,
          padding: "0 24px",
        },
        aboveThresh: {
          borderTop: `4px ${negative} solid`,
        },
        date: {
          fontSize: 12,
          padding: 24,
          lineHeight: "16px",
          textAlign: "right",
        },
      }),
    [borderPrimary, negative],
  );
};
