/*
 * WishPreviewCard.tsx
 *
 * Created by Jonah Dlin on Mon Jul 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, Layout, Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import ProductEditState from "@plus/model/ProductEditState";
import { BaseProps } from "@toolkit/api";
import { Icon, Illustration } from "@merchant/component/core";
import { useTheme } from "@stores/ThemeStore";
import Section from "@plus/component/products/edit-product/Section";
import {
  PreviewType,
  PreviewTypes,
  PreviewTypeIconMap,
} from "@toolkit/product-edit";
import WishImagePreview, { WishImagePreviewProps } from "./WishImagePreview";
import { AnimatePresence, motion, Variants } from "framer-motion";

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
  readonly editState: ProductEditState;
};

const WishPreviewCard: React.FC<Props> = ({
  className,
  style,
  editState,
}: Props) => {
  const styles = useStylesheet();
  const { primary, textDark } = useTheme();
  const [previewType, setPreviewType] = useState<PreviewType>("MOBILE");

  const { variationsList, images, msrp, primaryCurrency } = editState;

  const variation = useMemo(() => {
    if (images.length == 0) {
      return variationsList[0];
    }
    const mainImageVariation = variationsList.find(
      ({ image }) => image?.id == images[0].id,
    );
    if (mainImageVariation == null) {
      return variationsList[0];
    }
    return mainImageVariation;
  }, [variationsList, images]);

  const previewProps: Omit<WishImagePreviewProps, "previewType"> = useMemo(
    () => ({
      imageUrl: variation.image?.wishUrl,
      price: variation.price,
      msrp,
      currencyCode: primaryCurrency,
    }),
    [variation, msrp, primaryCurrency],
  );

  // TODO: FAQ link
  const faqLink = "";

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
        <Layout.FlexColumn style={styles.desc}>
          <Text style={[styles.descText, styles.descBlock]}>
            Great images will attract customers as they shop on Wish’s
            image-only feed.
          </Text>
          <Text style={[styles.descText, styles.descBlock]}>
            Need help with your listing?
          </Text>
          <Link style={[styles.descLink, styles.descBlock]} href={faqLink}>
            View our FAQ
          </Link>
        </Layout.FlexColumn>
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
          padding: "24px 50px 16px 50px",
          position: "relative",
          overflow: "hidden",
        },
        previewCarousel: {
          position: "relative",
          alignSelf: "stretch",
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
          alignSelf: "stretch",
          flex: 1,
        },
        webPreview: {
          marginBottom: 18,
        },
        mobilePreviews: {
          alignSelf: "stretch",
          margin: "17px 12px 22px 12px",
        },
        mobilePreview: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        desc: {
          marginTop: 32,
        },
        descBlock: {
          ":not(:last-child)": {
            marginBottom: 12,
          },
        },
        descText: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        descLink: {
          fontSize: 16,
          lineHeight: 1.5,
        },
      }),
    [surfaceLighter, borderPrimary, textDark],
  );
};
