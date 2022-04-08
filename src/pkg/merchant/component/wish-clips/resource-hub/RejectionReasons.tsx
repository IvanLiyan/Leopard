/* Revamp of @merchant/component/products/add-product-demo/RejectionReasons.tsx */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ci18n } from "@legacy/core/i18n";
import { H5, Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import RejectionReasonList from "@merchant/component/wish-clips/resource-hub/RejectionReasonList";

type Props = BaseProps;

const RejectionReasons: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H5 style={styles.title}>Your video may be rejected if:</H5>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={30}
        smallScreenTemplateColumns="1fr"
      >
        <RejectionReasonList
          title={ci18n(
            "Placed in front of video attribute. E.g 'Video is Blank', 'Video is Small or blurry'",
            "Video is:"
          )}
          list={[
            ci18n("Meaning blank or empty video", "Blank"),
            i`Small or Blurry`,
            i`Incorrectly oriented`,
            i`Screen recording`,
            i`Picture slideshow`,
            i`Pictured with a major brand`,
          ]}
        />

        <RejectionReasonList
          title={ci18n(
            "Placed in front of video attribute. E.g 'Video has Nudity'",
            "Video has:"
          )}
          list={[
            i`Prominent non-English text`,
            ci18n(
              "Short form for 'Video has a person talking to the camera'",
              "Person talking"
            ),
            i`Nudity`,
            i`Hateful symbols`,
            i`Obscenity or graphic content`,
            i`Embedded logo`,
            i`Blurred information`,
            i`Counterfeit products`,
            i`Commercial copyright`,
          ]}
        />

        <RejectionReasonList
          title={ci18n(
            "Placed in front of video attribute. E.g 'Video does: Refer customer off platform'",
            "Video does:"
          )}
          list={[
            i`Refer customer off platform`,
            i`Show product’s factory`,
            i`Show more than 1 product`,
          ]}
        />
      </Layout.GridRow>
    </Layout.FlexColumn>
  );
};

export default observer(RejectionReasons);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          marginBottom: 10,
        },
      }),
    []
  );
};
