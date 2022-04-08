import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";
import { H4, Layout, PrimaryButton, Text } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import Illustration from "@merchant/component/core/Illustration";
import Icon from "@merchant/component/core/Icon";
import { useDeviceStore } from "@stores/DeviceStore";

type Props = {
  readonly paddingX: string | number;
};

const GetStartedBanner: React.FC<Props> = (props) => {
  const { paddingX } = props;
  const styles = useStylesheet({ paddingX });
  const { isSmallScreen } = useDeviceStore();
  return (
    <Layout.FlexRow
      alignItems="center"
      justifyContent="space-evenly"
      className={css(styles.root)}
    >
      {!isSmallScreen && (
        <Illustration
          className={css(styles.videoFilmIcon)}
          name="videoFilmIcon"
          alt={i`video/film icon`}
        />
      )}
      <H4 style={styles.bannerText}>
        Ready to get started? Go to your Video Management Hub to start uploading
        videos!
      </H4>
      <PrimaryButton href={"/videos/management-hub/store-overview"}>
        <Layout.FlexRow>
          <Text>Start Now</Text>
          <Icon
            color="white"
            name="chevronRightLarge"
            size="medium"
            style={styles.buttonIcon}
          />
        </Layout.FlexRow>
      </PrimaryButton>
    </Layout.FlexRow>
  );
};

export default observer(GetStartedBanner);

const useStylesheet = ({
  paddingX,
}: {
  readonly paddingX: string | number;
}) => {
  const { textWhite, primaryDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 250,
          backgroundColor: primaryDark,
          padding: `0 ${paddingX}`,
          gap: 20,
        },
        videoFilmIcon: {
          minWidth: 93,
        },
        bannerText: {
          color: textWhite,
          maxWidth: 550,
        },
        buttonIcon: {
          marginLeft: 10,
        },
      }),
    [paddingX, textWhite, primaryDark]
  );
};
