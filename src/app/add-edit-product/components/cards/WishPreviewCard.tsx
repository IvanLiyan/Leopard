/*
 * WishPreviewCard.tsx
 *
 * Created by Jonah Dlin on Mon Jul 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@core/components/Illustration";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import Section from "./Section";
import {
  PreviewType,
  PreviewTypes,
  PreviewTypeIconMap,
} from "@add-edit-product/toolkit";
import WishImagePreview, { WishImagePreviewProps } from "./WishImagePreview";
import { AnimatePresence, motion, Variants } from "framer-motion";
import AddEditProductState from "@add-edit-product/AddEditProductState";

const LEFT_VARIANTS: Variants = {
  enter: {
    x: `-100%`,
    position: "static",
    opacity: 0,
  },
  center: {
    position: "static",
    x: 0,
    opacity: 1,
  },
  exit: {
    position: "absolute",
    x: `-100%`,
    opacity: 0,
  },
};

const RIGHT_VARIANTS: Variants = {
  enter: {
    position: "static",
    x: `100%`,
    opacity: 0,
  },
  center: {
    position: "static",
    x: 0,
    opacity: 1,
  },
  exit: {
    position: "absolute",
    x: `100%`,
    opacity: 0,
  },
};

const TRANSITION = { type: "spring", stiffness: 750, damping: 50 };

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const WishPreviewCard: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();
  const { primary, textDark } = useTheme();
  const [previewType, setPreviewType] = useState<PreviewType>("MOBILE");

  const { variations, mainImageVariation, primaryCurrency, images } = state;

  const variation =
    mainImageVariation == null &&
    (variations.length == 0 || variations[0] == null)
      ? null
      : mainImageVariation || variations[0];

  const previewProps: Omit<WishImagePreviewProps, "previewType"> =
    useMemo(() => {
      return {
        imageUrl: images.length > 0 ? images[0].wishUrl : undefined,
        price:
          variation == null || variation.price == null
            ? undefined
            : variation.price,
        currencyCode: primaryCurrency,
      };
    }, [variation, primaryCurrency, images]);

  return (
    <Section
      className={css(className, style)}
      title={i`Listing preview on Wish feed`}
      contentStyle={{
        padding: 0,
      }}
      alwaysOpen
    >
      <Layout.FlexColumn style={styles.content} alignItems="center">
        <Layout.FlexRow style={styles.previewMenu}>
          {PreviewTypes.map((preview) => (
            <Icon
              key={preview}
              className={css(styles.previewIcon)}
              onClick={() => setPreviewType(preview)}
              name={PreviewTypeIconMap[preview]}
              color={previewType == preview ? primary : textDark}
              size={24}
            />
          ))}
        </Layout.FlexRow>
        <Layout.FlexRow style={styles.previewCarousel}>
          <AnimatePresence initial={false}>
            {previewType == "MOBILE" ? (
              <motion.div
                className={css(styles.previewContainer)}
                key="MOBILE"
                variants={LEFT_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
              >
                <Illustration
                  name="mockMobileHeader"
                  alt={i`Wish mobile navigation bar`}
                />
                <Layout.FlexRow style={styles.mobilePreviews}>
                  <WishImagePreview
                    className={css(styles.mobilePreview)}
                    previewType={previewType}
                    {...previewProps}
                  />
                  <WishImagePreview
                    className={css(styles.mobilePreview)}
                    previewType={previewType}
                  />
                </Layout.FlexRow>
              </motion.div>
            ) : (
              <motion.div
                className={css(styles.previewContainer)}
                key="WEB"
                variants={RIGHT_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
              >
                <WishImagePreview
                  className={css(styles.webPreview)}
                  previewType={previewType}
                  {...previewProps}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Layout.FlexRow>
        <Text style={styles.desc}>
          Great images will attract customers as they shop on Wish&apos;s
          image-only feed.
        </Text>
      </Layout.FlexColumn>
    </Section>
  );
};

export default observer(WishPreviewCard);

const useStylesheet = () => {
  const { surfaceLighter, borderPrimary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          alignSelf: "stretch",
          padding: 24,
          position: "relative",
          overflow: "hidden",
        },
        previewCarousel: {
          position: "relative",
        },
        previewMenu: {
          padding: "12px 28px",
          borderRadius: 48,
          backgroundColor: surfaceLighter,
        },
        previewIcon: {
          cursor: "pointer",
          ":not(:last-child)": {
            marginRight: 16,
          },
        },
        previewContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          marginTop: 32,
          borderRadius: 4,
          border: `1px solid ${borderPrimary}`,
          alignSelf: "center",
          flexBasis: 280,
        },
        webPreview: {
          marginBottom: 18,
        },
        mobilePreviews: {
          alignSelf: "stretch",
          margin: "17px 12px 22px 12px",
        },
        mobilePreview: {
          flexBasis: 122,
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        desc: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
          marginTop: 32,
        },
      }),
    [surfaceLighter, borderPrimary, textDark],
  );
};
