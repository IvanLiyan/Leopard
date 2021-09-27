import React from "react";
import { observer } from "mobx-react";

/* Zeus */
import { IconName } from "@ContextLogic/zeus";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkits */
import { css } from "@toolkit/styling";

/* Toolkit */
import { startApplicationLink } from "@toolkit/brand/branded-products/abs";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBApplicationStatus } from "@toolkit/brand/branded-products/abs";

export type ABSBApplicationDetailTipProps = BaseProps & {
  readonly brandId: string;
  readonly status: ABSBApplicationStatus;
};

const ABSBApplicationDetailTip = ({
  brandId,
  status,
  style,
}: ABSBApplicationDetailTipProps) => {
  const startAppLink = `[${i`Apply for more brands`}](${startApplicationLink()})`;
  const startBrandAppLink = `[${i`Apply with new documents`}](${startApplicationLink(
    brandId
  )})`;
  const { primary, positive, warning, negative } = useTheme();
  const tipText = {
    PENDING:
      i`Your application is pending review. Applications ` +
      i`are processed within ${3} to ${5} business days.`,
    APPROVED: i`Your application has been approved! ${startAppLink}`,
    EXPIRED: i`Your application has expired. ${startBrandAppLink}`,
    REJECTED: i`Your application has been rejected. ${startBrandAppLink}`,
  };
  const tipColor = {
    PENDING: primary,
    APPROVED: positive,
    EXPIRED: warning,
    REJECTED: negative,
  };
  const tipIcon: { readonly [status in ABSBApplicationStatus]: IconName } = {
    PENDING: "tip",
    APPROVED: "checkCircle",
    EXPIRED: "warning",
    REJECTED: "error",
  };

  return (
    <Tip color={tipColor[status]} icon={tipIcon[status]} className={css(style)}>
      <Markdown text={tipText[status]} openLinksInNewTab />
    </Tip>
  );
};

export default observer(ABSBApplicationDetailTip);
