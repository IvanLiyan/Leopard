import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Layout,
  Text,
  H5,
  Field,
  TextInput,
  Radio,
  H6,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { VideoVisibility } from "@schema/types";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import VideoCatalogState from "@merchant/model/products/VideoCatalogState";

type Props = BaseProps & {
  readonly state: VideoCatalogState;
};

const VideoInformation = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  const [videoVisibility, setVideoVisibility] =
    useState<VideoVisibility>("LIVE");

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Field title={i`Title`} style={styles.input}>
        <TextInput
          value={state.videoTitle}
          onChange={({ text }) => (state.videoTitle = text)}
        />
      </Field>
      <Field title={i`Description`} style={styles.input}>
        <TextInput
          isTextArea
          canResize
          rows={4}
          placeholder={i`Tell viewers about your video`}
          value={state.videoDescription}
          onChange={({ text }) => (state.videoDescription = text)}
        />
      </Field>
      <H5>Visibility</H5>
      <Text style={styles.text}>
        Choose when to publish and who can see your video
      </Text>
      <Layout.FlexColumn>
        <Layout.FlexRow
          alignItems="flex-start"
          onClick={() => setVideoVisibility("LIVE")}
          style={[
            styles.radioOption,
            videoVisibility === "LIVE" && styles.radioSelected,
          ]}
        >
          <Radio
            checked={videoVisibility === "LIVE"}
            style={styles.radioItem}
          />
          <Layout.FlexColumn justifyContent="flex-start">
            <H6>Live</H6>
            <Text>
              Video will be made available on Wish Clips and other channels once
              approved
            </Text>
          </Layout.FlexColumn>
        </Layout.FlexRow>
        <Layout.FlexRow
          alignItems="flex-start"
          // Disabled until feature is supported in the future
          // onClick={() => setVideoVisibility("UNLISTED")}
          style={[
            styles.radioOption,
            videoVisibility === "UNLISTED" && styles.radioSelected,
            // Disabled until feature is supported in the future
            styles.disabled,
          ]}
        >
          <Radio
            checked={videoVisibility === "UNLISTED"}
            style={styles.radioItem}
          />
          <Layout.FlexColumn justifyContent="flex-end">
            <H6>Unlisted</H6>
            <Text>
              Video will be seen in the "Unlisted" tab of your Video Catalog and
              will not be viewable by customers if approved
            </Text>
          </Layout.FlexColumn>
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { primary, borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          size: 14,
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        input: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        radioItem: {
          marginRight: 12,
        },
        radioOption: {
          borderRadius: 4,
          border: `1px ${borderPrimary} solid`,
          backgroundColor: surfaceLightest,
          ":not(:last-child)": {
            marginBottom: 16,
          },
          padding: 16,
          ":hover": {
            cursor: "pointer",
          },
        },
        radioSelected: {
          border: `1px ${primary} solid`,
        },
        disabled: {
          opacity: 0.6,
          ":hover": {
            cursor: "not-allowed",
          },
        },
      }),
    [primary, borderPrimary, surfaceLightest]
  );
};

export default observer(VideoInformation);
