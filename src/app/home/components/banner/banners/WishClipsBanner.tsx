import React from "react";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import Banner from "../Banner";
import { merchFeUrl } from "@core/toolkit/router";

export type WishClipsBannerProps = BaseProps;

const WishClipsBanner: React.FC<WishClipsBannerProps> = ({
  className,
  style,
}) => {
  const { primary, textDark } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={i`Introducing Wish Clips!`}
      body={
        i`A scrollable video feed with its own dedicated tab in the Wish app. ` +
        i`Upload videos now to boost your product sales!`
      }
      textColor={textDark}
      bannerImg="bannerWishClips"
      cta={{
        text: ci18n(
          "Text on a button, to encourage merchants to start using a feature",
          "Get started",
        ),
        href: merchFeUrl("/videos/management-hub"),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(WishClipsBanner);
