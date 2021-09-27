import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import * as fonts from "@toolkit/fonts";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

import { Illustration, IllustrationName } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FulfullmentInsightCardProps = BaseProps & {
  readonly onDismiss: () => unknown;
  readonly illustration: IllustrationName;
  readonly link?: string | null | undefined;
};

const FulfullmentInsightCard = (props: FulfullmentInsightCardProps) => {
  const { className, style, illustration, children, onDismiss, link } = props;

  const styles = useStylesheet(props);

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={{
        height: "100%",
        display: "flex",
      }}
    >
      <div className={css(styles.root)}>
        <Illustration
          name={illustration}
          className={css(styles.illustration)}
          alt={i`illustration`}
        />
        <div className={css(styles.content)}>
          <div className={css(styles.contentInner)}>{children}</div>
          <div className={css(styles.linksRow)}>
            {link && (
              <>
                <Link href={link} style={{ fontSize: 15, opacity: 0.9 }}>
                  Learn more
                </Link>
                <span className={css(styles.divider)}>•</span>
              </>
            )}
            <Link onClick={onDismiss} style={{ fontSize: 15, opacity: 0.9 }}>
              Dismiss
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default observer(FulfullmentInsightCard);

const useStylesheet = (props: FulfullmentInsightCardProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 20,
          "@media (max-width: 1100px)": {
            ":nth-child(1n) > :first-child": {
              display: "none",
            },
          },
        },
        illustration: {
          marginRight: 15,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontWeight: fonts.weightMedium,
          fontSize: 16,
          alignSelf: "stretch",
          height: "100%",
        },
        linksRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "7px 0px",
        },
        divider: {
          margin: "0px 5px",
        },
        contentInner: {
          flex: 1,
        },
      }),
    []
  );
};
