import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Relative Imports */

import { InjunctionAdminReply } from "@merchant/api/brand/merchant-tro";

import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

export type ShowTroMessagesModalContentProps = {
  readonly replies: ReadonlyArray<InjunctionAdminReply>;
  readonly onClose: () => unknown;
};

const ShowTroMessagesModalContent = (
  props: ShowTroMessagesModalContentProps
) => {
  const styles = useStylesheet(props);
  const { replies } = props;

  return (
    <div className={css(styles.root)}>
      {replies.map((reply) => (
        <>
          <div className={css(styles.title)}>{reply.date}</div>
          <div className={css(styles.body)}>{reply.message}</div>
        </>
      ))}
    </div>
  );
};

export default ShowTroMessagesModalContent;

const useStylesheet = (props: ShowTroMessagesModalContentProps) => {
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();
  const { borderPrimaryDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontWeight: fonts.weightBold,
          marginTop: 24,
          marginBottom: 24,
        },
        root: {
          minHeight: 450,
          display: "flex",
          flexDirection: "column",
          padding: `0px ${pageX} 10px ${pageX}`,
        },
        body: {
          paddingBottom: 24,
          borderBottom: `solid 1px ${borderPrimaryDark}`,
        },
      }),
    [pageX, borderPrimaryDark]
  );
};
