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

export type Props = BaseProps & {
  readonly stateName: SellerProfileVerificationStatus;
  readonly isMandatory: boolean;
  readonly canStartKyc: boolean;
  readonly enableNonVerifificationFlow: boolean;
  readonly handleReverify: () => void;
};

const KYCVerificationBanner: React.FC<Props> = (props: Props) => {
  const {
    handleReverify,
    stateName,
    isMandatory,
    canStartKyc,
    enableNonVerifificationFlow,
  } = props;
  if (stateName == "APPROVED") {
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
