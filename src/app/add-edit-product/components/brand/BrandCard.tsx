import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";
import { H6 } from "@ContextLogic/lego";
import Icon from "@core/components/Icon";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { useTheme } from "@core/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Image from "@core/components/Image";
import Illustration from "@core/components/Illustration";

export type BrandCardProps = Readonly<
  BaseProps & {
    readonly brand_id: string;
    readonly brand_name: string;
    readonly logo_url: string | null | undefined;
    readonly outerStyle?: CSSProperties | string;
    readonly innerStyle?: CSSProperties | string;
    readonly onDelete?: () => unknown;
    readonly showAbsb?: boolean;
    readonly padding?: number;
  }
>;

const DEFAULT_PADDING = 20;

const BrandCard = ({
  style,
  className,
  outerStyle,
  innerStyle,
  brand_name: brandName,
  logo_url: logoUrl,
  brand_id: brandId,
  onDelete,
  showAbsb,
  padding,
}: BrandCardProps) => {
  const styles = useStylesheet(padding);

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={css(styles.root, outerStyle)}
    >
      {onDelete && (
        <div className={css(styles.deleteButtonContainer)}>
          <Icon
            onClick={onDelete}
            className={css(styles.deleteButton)}
            name="x"
          />
        </div> // shli TODO: test if this looks good
      )}
      {showAbsb && (
        <div className={css(styles.absBadgeContainer)}>
          <Illustration
            name="authenticBrandSellerBadge"
            style={css(styles.absBadge)}
            alt={i`authentic brand seller`}
          />
        </div>
      )}
      <div className={css(styles.content, innerStyle)}>
        <div className={css(styles.leftSection)}>
          <H6>{brandName}</H6>
          <ObjectId style={styles.objectId} id={brandId} />
        </div>
        {logoUrl && (
          <div className={css(styles.imageContainer)}>
            <Image
              className={css(styles.image)}
              src={logoUrl}
              alt={i`${brandName}'s logo`}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default BrandCard;

const useStylesheet = (padding?: number) => {
  const { borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: padding || DEFAULT_PADDING,
        },
        content: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        leftSection: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
        imageContainer: {
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          border: `solid 1px ${borderPrimary}`,
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: surfaceLightest,
        },
        image: {
          maxHeight: 35,
          maxWidth: 35,
        },
        objectId: {
          padding: 0,
        },
        absBadgeContainer: {
          position: "absolute",
          left: 8,
          top: 8,
        },
        absBadge: {
          width: 16,
        },
        deleteButtonContainer: {
          position: "absolute",
          right: 8,
          top: 8,
        },
        deleteButton: {
          width: 12,
          height: 12,
          cursor: "pointer",
        },
      }),
    [padding, borderPrimary, surfaceLightest],
  );
};
