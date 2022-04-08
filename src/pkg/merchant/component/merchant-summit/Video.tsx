import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Vimeo from "@u-wave/react-vimeo";

/* Lego Components */
import { Layout, H2 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

/* Assets */
import videoBackgroundMobileImageURL from "@assets/img/merchant-summit/landing/mobile/video-background-mobile.png";
import videoBackgroundWebURL from "@assets/img/merchant-summit/landing/web/video-background-web.png";

type VideoProps = BaseProps & {
  readonly currentVideoUrl: string;
};

const Video = (props: VideoProps) => {
  const { currentVideoUrl } = props;
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const videoWidth = useMemo(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth != null)
      return isSmallScreen ? windowWidth - 32 : windowWidth - 200;
    return isSmallScreen ? 480 : 1080;
  }, [isSmallScreen]);

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2 style={isSmallScreen ? styles.titleMobile : styles.titleWeb}>
        Wish Merchant Summit 2021 Video
      </H2>
      <Vimeo video={currentVideoUrl} width={videoWidth} />
    </Layout.FlexColumn>
  );
};

export default observer(Video);

const useStylesheet = () => {
  const { textWhite } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          background: `url(${videoBackgroundWebURL})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        },
        rootMobile: {
          padding: "80px 0px",
          background: `url(${videoBackgroundMobileImageURL})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        },
        titleMobile: {
          color: textWhite,
          fontSize: 28,
          margin: "0px 16px 20px",
          textAlign: "center",
          lineHeight: "120%",
        },
        titleWeb: {
          color: textWhite,
          fontSize: 40,
          marginBottom: 60,
          maxWidth: 510,
          textAlign: "center",
          lineHeight: "120%",
        },
      }),
    [textWhite]
  );
};
