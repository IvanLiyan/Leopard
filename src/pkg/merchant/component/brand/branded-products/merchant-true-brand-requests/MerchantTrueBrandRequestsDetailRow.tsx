import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Conversation } from "@ContextLogic/lego";
import { H5 } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { useTheme } from "@merchant/stores/ThemeStore";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Merchant Imports */
import BrandCard from "@merchant/component/brand/branded-products/BrandCard";

/* Relative Imports*/
import IntellectualPropertyModal from "./IntellectualPropertyModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MerchantTrueBrandRequestObject } from "@merchant/api/brand/true-brands";
import { TrademarkCountryCode } from "@schema/types";

export type MerchantTrueBrandRequestsDetailRowProps = BaseProps & {
  readonly request: MerchantTrueBrandRequestObject;
  readonly acceptedTrademarkCountries: ReadonlyArray<TrademarkCountryCode>;
};

const resubmitMerchantRequestBody = i`Additional information provided.`;

const MerchantTrueBrandRequestsDetailRow = ({
  request,
  acceptedTrademarkCountries,
}: MerchantTrueBrandRequestsDetailRowProps) => {
  const styles = useStylesheet();
  const { locale } = useLocalizationStore();

  const merchantRequestBody =
    request.state === "RESUBMIT_PENDING_REVIEW"
      ? resubmitMerchantRequestBody
      : request.merchant_notes;

  const merchRequest = (
    <Conversation.Item locale={locale}>
      <H5 className={css(styles.title)}>
        Merchant Suggests - {request.brand_name}
      </H5>
      <div className={css(styles.body)}>{merchantRequestBody}</div>
    </Conversation.Item>
  );

  let wishResponse;
  let brandItem: ReactNode = null;
  if (request.brand_id) {
    brandItem = (
      <BrandCard
        brand_id={request.brand_id}
        brand_name={
          request.approved_brand_name ? request.approved_brand_name : ""
        }
        logo_url={request.approved_brand_logo_url}
        style={{ maxWidth: 400 }}
      />
    );
  }
  if (request.state === "PENDING_REVIEW") {
    wishResponse = (
      <Conversation.Item locale={locale} isWish>
        <H5 className={css(styles.title)}>Review by Wish</H5>
        <div className={css(styles.body)}>
          This suggestion is currently under review. The review process can take
          3 to 5 business days, so check back later for status updates.
        </div>
      </Conversation.Item>
    );
  } else if (request.state === "COMPLETED") {
    wishResponse = (
      <Conversation.Item locale={locale} isWish>
        <H5 className={css(styles.title)}>Response from Wish</H5>
        <div className={css(styles.body)}>
          Your request has been approved! This brand and brand ID can now be
          used to tag products.
        </div>
        {brandItem}
      </Conversation.Item>
    );
  } else if (request.state === "RESUBMIT") {
    wishResponse = (
      <Conversation.Item locale={locale} isWish>
        <H5 className={css(styles.title)}>Response from Wish</H5>
        <div className={css(styles.body)}>
          <Markdown
            text={
              i`We can not verify the brand based on the information provided. Please ` +
              i`**add additional intellectual property information** and resubmit for review.`
            }
          />
        </div>
        <SecondaryButton
          onClick={() => {
            new IntellectualPropertyModal({
              request,
              acceptedTrademarkCountries,
            }).render();
          }}
        >
          Add information
        </SecondaryButton>
      </Conversation.Item>
    );
  } else if (request.state === "RESUBMIT_PENDING_REVIEW") {
    wishResponse = (
      <Conversation.Item locale={locale} isWish>
        <H5 className={css(styles.title)}>Response from Wish</H5>
        <div className={css(styles.body)}>
          <Markdown
            text={
              i`The additional information you provided is under review. The review ` +
              i`process can take up to 3-5 days, so check back later for status updates.`
            }
          />
        </div>
      </Conversation.Item>
    );
  } else {
    const markdownText = `[${i`View guidelines`}](${zendeskURL(
      "360046520933"
    )})`;
    const faqText = i`Learn how to successfully submit a brand request. ${markdownText}`;
    wishResponse = (
      <Conversation.Item locale={locale} isWish>
        <H5 className={css(styles.title)}>Response from Wish</H5>
        <div className={css(styles.body)}>{request.admin_notes}</div>
        <div className={css(styles.body)}>
          <Markdown text={faqText} openLinksInNewTab />
        </div>
        {brandItem}
      </Conversation.Item>
    );
  }

  return (
    <Conversation style={css(styles.conversation)}>
      {merchRequest}
      {wishResponse}
    </Conversation>
  );
};

export default MerchantTrueBrandRequestsDetailRow;

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          padding: "15px 20px",
        },
        conversation: {
          padding: 28,
          backgroundColor: pageBackground,
        },
        title: {
          margin: "10px 15px",
        },
        body: {
          margin: "20px 15px 38px 15px",
        },
      }),
    [pageBackground]
  );
};
