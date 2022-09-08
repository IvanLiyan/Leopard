import React from "react";

import { RichTextBanner } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { zendeskURL } from "@toolkit/url";

import { SellerProfileVerificationStatus } from "@schema/types";

const incompleteText =
  i`Per the regulations of the European Economic Area (EEA) and/or the ` +
  i`UK, please complete our Know Your Customer (KYC) process to validate ` +
  i`your store and continue receiving payments from Wish. [Learn more](${zendeskURL(
    "360045537433"
  )})`;
const reviewingText =
  i`Please be patient with us as it can take up to **${3} ` +
  i`business days** to validate your store.`;
const rejectedText =
  i`Note that payment may be withheld from your store ` +
  i`if you do not complete this process. Please validate ` +
  i`your store again.`;
const approvedText =
  i`Your store is now successfully validated! Your store is ` +
  i`now eligible for unlimited sales and additional merchant ` +
  i`features to further grow your business. `;

const incompleteTextV2 =
  i`In order to start selling on Wish and operate within the ` +
  i`European Economic Area (EEA), you need to complete ` +
  i`your store validation. Store validation also allows you ` +
  i`to boost your store’s impressions. ` +
  i`Thanks for doing your part to keep Wish a safe and trusted marketplace.`;
const reviewTextV2 =
  i`Generally it takes us a few days to complete the process ` +
  i`after you have provided us with the requested information. ` +
  i`However, in some cases we will need additional information from you, ` +
  i`in those cases we will contact you in order to complete the ` +
  i`Know Your Customer (KYC) process.`;
const rejectedTextV2 =
  i`Unfortunately, we could not validate your store at this time. ` +
  i`There are various reasons why your Know Your Customer (KYC) ` +
  i`submission could be rejected. You can resubmit your store for validation. ` +
  i`Please make sure all of your information and documents are ` +
  i`complete and accurate. ` +
  i`If you still have any questions, please contact your Account Manager.`;
const approvedTextV2 =
  i`You may still have outstanding things to do to finish your account setup. ` +
  i`Visit your ` +
  i`[Merchant Dashboard home page](${"/home"}) ` +
  i`to complete these tasks.`;

export type Props = BaseProps & {
  readonly stateName: SellerProfileVerificationStatus;
  readonly isMandatory: boolean;
  readonly canStartKyc: boolean;
  readonly enableNonVerifificationFlow: boolean;
  readonly handleReverify: () => void;
  readonly fromV2Flow: boolean;
};

const KYCVerificationBanner: React.FC<Props> = (props: Props) => {
  const {
    handleReverify,
    stateName,
    isMandatory,
    canStartKyc,
    enableNonVerifificationFlow,
    fromV2Flow,
  } = props;
  if (stateName == "APPROVED") {
    if (fromV2Flow) {
      return (
        <RichTextBanner
          title={i`Congratulations! Wish has validated your store.`}
          description={approvedTextV2}
          sentiment="success"
          contentAlignment="left"
          iconVerticalAlignment="top"
        />
      );
    }
    return (
      <RichTextBanner
        title={i`You have unlocked unlimited sales and additional merchant features!`}
        description={approvedText}
        sentiment="success"
        contentAlignment="left"
        iconVerticalAlignment="top"
      />
    );
  } else if (stateName == "REVIEWING") {
    if (fromV2Flow) {
      return (
        <RichTextBanner
          title={i`Thank you for completing your store validation`}
          description={reviewTextV2}
          sentiment="info"
          contentAlignment="left"
          iconVerticalAlignment="top"
          onClick={handleReverify}
        />
      );
    }
    return (
      <RichTextBanner
        title={i`Thanks for your submission!`}
        description={reviewingText}
        sentiment="info"
        contentAlignment="left"
        iconVerticalAlignment="top"
        onClick={handleReverify}
      />
    );
  } else if (stateName == "REJECTED") {
    if (fromV2Flow) {
      return (
        <RichTextBanner
          title={i`Your Store Validation was Rejected`}
          description={rejectedTextV2}
          sentiment="warning"
          contentAlignment="left"
          iconVerticalAlignment="top"
          buttonText={i`Resubmit`}
          onClick={handleReverify}
        />
      );
    }
    return (
      <RichTextBanner
        title={i`Your store validation is rejected`}
        description={rejectedText}
        sentiment="warning"
        contentAlignment="left"
        iconVerticalAlignment="top"
        buttonText={i`Validate store`}
        onClick={handleReverify}
      />
    );
  }

  if (isMandatory && fromV2Flow) {
    return (
      <RichTextBanner
        title={i`Finish Validating Your Store`}
        description={incompleteTextV2}
        sentiment="warning"
        contentAlignment="left"
        iconVerticalAlignment="top"
        buttonText={i`Complete Validation`}
        onClick={handleReverify}
      />
    );
  }

  if (isMandatory) {
    return (
      <RichTextBanner
        title={i`Validate your store to receive payments`}
        description={incompleteText}
        sentiment="warning"
        contentAlignment="left"
        iconVerticalAlignment="top"
        buttonText={i`Validate store`}
        onClick={handleReverify}
      />
    );
  } else if (canStartKyc) {
    return (
      <RichTextBanner
        sentiment={"info"}
        title={i`Validate your store to access new features`}
        description={
          i`You can continue selling on Wish without validating your store ` +
          i`right now. However, you can start the process to gain ` +
          i`access to new features. We'll notify you when validation is ` +
          i`required to continue selling.`
        }
        contentAlignment="left"
        iconVerticalAlignment="top"
        buttonText={i`Validate store`}
        onClick={handleReverify}
      />
    );
  } else if (enableNonVerifificationFlow) {
    return (
      <RichTextBanner
        sentiment={"warning"}
        title={i`Please provide your country/region of domicile`}
        description={
          i`We need your country/region of domicile in order to properly ` +
          i`set up your taxes and automate tax collection and reports. ` +
          i`[Learn more](${zendeskURL("360050893133")})`
        }
        contentAlignment="left"
        iconVerticalAlignment="top"
        buttonText={i`Continue`}
        onClick={handleReverify}
      />
    );
  }

  return null;
};

export default KYCVerificationBanner;
