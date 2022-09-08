import React from "react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
//import SellerProfilePendingBox from "@merchant/component/seller-profile-settings/SellerProfilePendingBox";
import SellerProfileIncompleteBox from "@merchant/component/seller-profile-settings/SellerProfileIncompleteBox";
//import SellerProfileApprovedBox from "@merchant/component/seller-profile-settings/SellerProfileApprovedBox";
import SellerProfileRejectedBox from "@merchant/component/seller-profile-settings/SellerProfileRejectedBox";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SellerProfileVerificationStatus } from "@schema/types";

type SettingsBoxProps = BaseProps & {
  readonly status: SellerProfileVerificationStatus;
  readonly onReverify: () => unknown;
};

const SellerProfileSettingsBox = (props: SettingsBoxProps) => {
  const { className, style } = props;
  const rootCSS = css(style, className);

  return <div className={rootCSS}>{renderOnStatus(props)}</div>;
};

export default SellerProfileSettingsBox;

const renderOnStatus = (props: SettingsBoxProps) => {
  const { status, onReverify } = props;
  switch (status) {
    case "REVIEWING":
      return null;
    case "INCOMPLETE":
      return <SellerProfileIncompleteBox />;
    case "APPROVED":
      return null;
    case "REJECTED":
      return <SellerProfileRejectedBox onReverify={onReverify} />;
    default:
      return <SellerProfileIncompleteBox />;
  }
};
