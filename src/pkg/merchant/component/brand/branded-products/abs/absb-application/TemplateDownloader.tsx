import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBApplicationSellerType } from "@toolkit/brand/branded-products/abs";

type TemplateDownloaderProps = BaseProps & {
  displayText?: string | null | undefined;
  sellerType?: ABSBApplicationSellerType | null | undefined;
  showIcon?: boolean | null | undefined;
};

export const defaultLink =
  "/static/assets/docs/ABSBApplicationTemplates/AuthenticBrandSellerLetterSuggestedTemplates.zip";
export const brandOwnerLink =
  "/static/assets/docs/ABSBApplicationTemplates/AuthenticBrandSellerLetterSuggestedTemplates_BrandOwner.zip";
export const authorizedSellerLink =
  "/static/assets/docs/ABSBApplicationTemplates/AuthenticBrandSellerLetterSuggestedTemplates_AuthorizedSeller.zip";

export const getDownloadLink = (
  sellerType: ABSBApplicationSellerType | null | undefined
) => {
  if (sellerType && sellerType === "BRAND_OWNER") {
    return brandOwnerLink;
  } else if (sellerType && sellerType === "AUTHORIZED_RESELLER") {
    return authorizedSellerLink;
  }

  return defaultLink;
};

const TemplateDownloader = ({
  style,
  sellerType,
  displayText,
  showIcon,
}: TemplateDownloaderProps) => {
  const styles = useStylesheet();
  const downloadLink = getDownloadLink(sellerType);

  return (
    <Link
      style={css(style, styles.downloadLink)}
      href={downloadLink}
      openInNewTab
      download
    >
      {showIcon && (
        <Icon name="downloadBlue" className={css(styles.downloadIcon)} />
      )}
      {displayText || i`Download templates`}
    </Link>
  );
};

export default observer(TemplateDownloader);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        downloadLink: {
          display: "flex",
          alignItems: "center",
          marginTop: 24,
        },
        downloadIcon: {
          height: 14,
          width: 14,
          marginRight: 9,
        },
      }),
    []
  );
