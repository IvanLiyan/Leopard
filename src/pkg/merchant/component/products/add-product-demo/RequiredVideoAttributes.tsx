import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { H5, Card, Text } from "@ContextLogic/lego";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import RequiredAttribute from "./RequiredAttribute";

type Props = BaseProps;

const RequiredVideoAttributes: React.FC<Props> = ({
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  const minimumResoluton = "480p";
  return (
    <div className={css(className, style, styles.root)}>
      <H5 className={css(styles.title)}>Required video attributes</H5>
      <Card contentContainerStyle={css(styles.cardContent)}>
        <Text className={css(styles.titleSection)}>
          Optimize your Demo Videos with these required attributes.
        </Text>
        <div className={css(styles.grid)}>
          <RequiredAttribute
            title={i`High quality`}
            description={i`Make sure your video is as high resolution as possible. Up to ${50} MB in size.`}
            className={css(styles.item)}
          />
          <RequiredAttribute
            title={i`${30} seconds or less`}
            description={i`Keep customers engaged by telling your product’s story in ${30} seconds or less.`}
            className={css(styles.item)}
          />
          <RequiredAttribute
            title={i`Product alignment`}
            description={i`Keep video content aligned with product photos and descriptions.`}
            className={css(styles.item)}
          />
          <RequiredAttribute
            title={i`No audio`}
            description={i`Don’t worry about audio; videos are played in a soundless loop.`}
            className={css(styles.item)}
          />
          <RequiredAttribute
            title={i`${minimumResoluton} minimum resolution`}
            description={i`Upload a video that has at least ${minimumResoluton} resolution.`}
            className={css(styles.item)}
          />
          <RequiredAttribute
            title={i`Good lighting`}
            description={i`Bright lighting will help customers see your product clearly.`}
            className={css(styles.item)}
          />
        </div>
      </Card>
    </div>
  );
};

export default observer(RequiredVideoAttributes);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          marginBottom: 10,
        },
        cardContent: {
          padding: 20,
        },
        titleSection: {
          paddingBottom: 15,
          borderBottom: `1px solid ${borderPrimary}`,
          marginBottom: 15,
        },
        grid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: 15,
        },
        item: {
          marginTop: 10,
        },
      }),
    [borderPrimary],
  );
};
