/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { weightBold } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const CollectionTileWidth = 218;

type CollectionTilePreviewProps = BaseProps & {
  readonly collectionName: string;
  readonly collectionLogoUrl: string;
};

const CollectionTilePreview = (props: CollectionTilePreviewProps) => {
  const styles = useStylesheet();
  const { collectionName: name, collectionLogoUrl: logoUrl, className } = props;

  const displayCollectionName = name || i`Your collection name`;

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.imageWrapper)}>
        {logoUrl && <img className={css(styles.image)} src={logoUrl} />}
      </div>
      <div className={css(styles.textContainer)}>
        <div className={css(styles.textWrapper)}>
          <div className={css(styles.collectionName)}>
            {displayCollectionName}
          </div>
          <span className={css(styles.shopNow)}>Shop Now</span>
        </div>
      </div>
    </div>
  );
};

export default observer(CollectionTilePreview);

const useStylesheet = () => {
  const { textWhite, borderPrimary, primary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: borderPrimary,
          borderImage: "initial",
          overflow: "hidden",
          width: CollectionTileWidth,
          boxShadow: "0 0 3px",
        },
        imageWrapper: {
          marginBottom: 58,
          position: "relative",
          display: "flex",
          paddingTop: "100%",
        },
        image: {
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: textWhite,
        },
        textContainer: {
          position: "absolute",
          bottom: 0,
          backgroundColor: textWhite,
          width: "100%",
        },
        textWrapper: {
          display: "flex",
          flexDirection: "column",
          padding: 16,
        },
        collectionName: {
          fontSize: 14,
          fontWeight: weightBold,
          color: primary,
          paddingBottom: 4,
          textAlign: "left",
        },
        shopNow: {
          fontSize: 18,
          fontWeight: weightBold,
          color: textDark,
          textAlign: "left",
        },
      }),
    [textWhite, borderPrimary, primary, textDark],
  );
};
