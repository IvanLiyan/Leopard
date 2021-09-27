import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { copyToClipboard } from "@ContextLogic/lego/toolkit/string";

import { useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { startApplication } from "@toolkit/brand/branded-products/abs";

/* Merchant Components */
import BrandCard from "@merchant/component/brand/branded-products/BrandCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PopoverContentProps = BaseProps & {
  readonly brandId: string;
  readonly showAbsbApplication: boolean;
};

const PopoverContent = ({
  brandId,
  showAbsbApplication,
}: PopoverContentProps) => {
  const COPIED_DELAY_SEC = 1;
  const styles = useStylesheet();
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    copyToClipboard(brandId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, COPIED_DELAY_SEC * 1000);
  };

  const copiedContent = copied ? (
    <Icon name="greenCheckmarkSolid" style={css(styles.copiedIcon)} />
  ) : (
    <Text weight="medium" className={css(styles.text)}>
      Copy Brand ID
    </Text>
  );

  return (
    <div className={css(styles.container)}>
      {showAbsbApplication && (
        <div
          className={css(styles.button)}
          onClick={() => {
            startApplication(brandId);
          }}
        >
          <Icon name="authenticBrandSellerBadge" style={css(styles.icon)} />
          <Text weight="medium" className={css(styles.text)}>
            Become an Authentic Brand Seller
          </Text>
        </div>
      )}
      <div className={css(styles.button)} onClick={onCopy}>
        {copiedContent}
      </div>
    </div>
  );
};

export type TrueBrandDirectoryItemProps = BaseProps & {
  brand_id: string;
  brand_name: string;
  logo_url?: string | null;
  showAbsb: boolean;
};

const TrueBrandDirectoryItem = ({
  brand_id: brandId,
  brand_name: brandName,
  logo_url: logoUrl,
  showAbsb,
}: TrueBrandDirectoryItemProps) => {
  const styles = useStylesheet();

  return (
    <Popover
      popoverContent={() => (
        <PopoverContent brandId={brandId} showAbsbApplication={!showAbsb} />
      )}
      popoverPosition={"top center"}
    >
      <BrandCard
        outerStyle={css(styles.card)}
        brand_id={brandId}
        brand_name={brandName}
        logo_url={logoUrl}
        showAbsb={showAbsb}
        style={{ maxWidth: 400 }}
      />
    </Popover>
  );
};

export default TrueBrandDirectoryItem;

const useStylesheet = () => {
  const { surfaceLight, borderPrimary, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        card: {
          ":hover": {
            backgroundColor: surfaceLight,
          },
        },
        button: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "14px 0px",
          width: "100%",
          ":hover": {
            backgroundColor: surfaceLight,
          },
          ":active": {
            backgroundColor: borderPrimary,
          },
        },
        text: {
          margin: "0px 16px",
          color: textLight,
        },
        icon: {
          height: 14,
          width: 14,
          margin: "0px -11px 0px 16px",
        },
        copiedIcon: {
          height: 20,
          width: 20,
        },
      }),
    [surfaceLight, borderPrimary, textLight]
  );
};
