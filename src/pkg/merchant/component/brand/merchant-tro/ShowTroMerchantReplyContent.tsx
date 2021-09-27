import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Relative liImports */

import { InjunctionMerchantReply } from "@merchant/api/brand/merchant-tro";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type ShowMerchantReplyContentProps = {
  readonly reply: InjunctionMerchantReply;
  readonly onClose: () => unknown;
};

const ShowTroMerchantReplyContent = (props: ShowMerchantReplyContentProps) => {
  const styles = useStylesheet(props);
  const { reply } = props;
  const replyType = reply.reply_type;
  const lawyerInfo = reply.lawyer_info;
  const supportDoc = reply.support_doc;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.question)}>{reply.date}</div>
      {replyType === "HIRED_LAWYER" && (
        <>
          <HorizontalField
            title={i`Law Firm Name`}
            centerTitleVertically
            className={css(styles.field)}
          >
            {lawyerInfo.firm_name}
          </HorizontalField>
          <HorizontalField
            title={i`Lawyer Name`}
            centerTitleVertically
            className={css(styles.field)}
          >
            {lawyerInfo.lawyer_name}
          </HorizontalField>
          <HorizontalField
            title={i`Lawyer Email`}
            centerTitleVertically
            className={css(styles.field)}
          >
            {lawyerInfo.lawyer_email}
          </HorizontalField>
          <HorizontalField title={i`Message`} className={css(styles.field)}>
            {reply.message}
          </HorizontalField>
          <HorizontalField
            title={i`Confirmation`}
            className={css(styles.field)}
          >
            <CheckboxField onChange={() => {}} disabled checked>
              I have obtained legal representation for this case.*
            </CheckboxField>
          </HorizontalField>
        </>
      )}
      {replyType === "RESOLVED" && (
        <>
          <HorizontalField
            title={i`Attached document`}
            className={css(styles.field)}
          >
            <Link href={`/merchant-file/${supportDoc.id}`} openInNewTab>
              {supportDoc.filename}
            </Link>
          </HorizontalField>
          <HorizontalField title={i`Message`} className={css(styles.field)}>
            {reply.message}
          </HorizontalField>
          <HorizontalField
            title={i`Confirmation`}
            className={css(styles.field)}
          >
            <CheckboxField onChange={() => {}} disabled checked>
              I certify that I have reached a settlement and/or was dismissed
              from the case.*
            </CheckboxField>
          </HorizontalField>
        </>
      )}
      {replyType === "NORMAL_REPLY" && (
        <HorizontalField title={i`Message`} className={css(styles.field)}>
          {reply.message}
        </HorizontalField>
      )}
    </div>
  );
};
export default ShowTroMerchantReplyContent;

const useStylesheet = (props: ShowMerchantReplyContentProps) => {
  const {
    dimenStore: { pageGuideXForPageWithTable: pageX },
  } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          minHeight: 450,
          display: "flex",
          flexDirection: "column",
          padding: `0px ${pageX} 10px ${pageX}`,
        },
        question: {
          alignSelf: "center",
          textAlign: "center",
          fontWeight: fonts.weightBold,
          lineHeight: 1.5,
          fontSize: "16px",
          fontFamily: fonts.proxima,
          paddingTop: "20px",
          paddingBottom: "20px",
        },
        field: {
          ":first-child": {
            paddingTop: 40,
          },
          ":not(:first-child)": {
            paddingTop: 20,
          },
          paddingBottom: 20,
          paddingRight: "5%",
        },
      }),
    [pageX]
  );
};
