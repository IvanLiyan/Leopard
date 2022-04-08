/*
 * SubmissionSuccess.tsx
 *
 * Created by Don Sirivat on Fri Mar 11 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Markdown, Text } from "@ContextLogic/lego";

/* Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Assets */
import { greenCheckmarkSolid } from "@assets/icons";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

import NextImage from "next/image";

const SubmissionSuccess: React.FC<BaseProps> = ({
  className,
  style,
}: BaseProps) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      alignItems="center"
      style={[styles.root, className, style]}
    >
      <NextImage
        src={greenCheckmarkSolid}
        alt="green-check"
        className={css(styles.greenCheck)}
      />
      <Text weight="bold" style={styles.title}>
        We have received your report
      </Text>
      <Markdown
        style={styles.subtext}
        text={
          i`Thank you for reporting this transaction. Remember: ` +
          i`If the transaction falls under the purview of the ` +
          i`Explosives Precursors Regulation (EU) 2019/1148, ` +
          i`then you must also report it to the appropriate authorities ` +
          i`within 24 hours of detection. ` +
          i`[Learn more.](${zendeskURL("4458352228507")})`
        }
      />
      <Markdown
        style={styles.subtext}
        text={
          i`If you have not yet fulfilled this order, ` +
          i`you may cancel and refund it without ` +
          i`that negatively affecting your Wish Standards metrics. ` +
          i`Go to [Unfulfilled Orders](/transactions/action) ` +
          i`and select “Order was reported” as your reason for the refund.`
        }
      />
    </Layout.FlexColumn>
  );
};

export default observer(SubmissionSuccess);

const useStylesheet = () => {
  const { borderPrimary, inputBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: inputBackground,
          borderRadius: 10,
          padding: 24,
          border: `1px solid ${borderPrimary}`,
        },
        greenCheck: {
          height: 28,
          width: 28,
          marginBottom: 24,
        },
        title: {
          fontSize: 17,
          textAlign: "center",
        },
        subtext: {
          marginTop: 24,
          textAlign: "center",
        },
      }),
    [borderPrimary, inputBackground]
  );
};
