import React, { ReactNode, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Illustration, { IllustrationName } from "@core/components/Illustration";
import {
  Layout,
  Markdown,
  PrimaryButton,
  PrimaryButtonProps,
  StaggeredFadeIn,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import { Heading, Text } from "@ContextLogic/atlas-ui";

export type BannerProps = BaseProps & {
  readonly title: string | (() => ReactNode);
  readonly body: string | (() => ReactNode);
  readonly bannerImg: IllustrationName | (() => React.ReactNode);
  readonly cta?: PrimaryButtonProps & {
    readonly text: ReactNode;
  };
  readonly textColor?: string;
};

const Banner: React.FC<BannerProps> = ({
  textColor,
  bannerImg,
  cta,
  title,
  body,
  className,
  style,
}) => {
  const { textBlack } = useTheme();
  const styles = useStylesheet({ textColor: textColor ?? textBlack });

  const renderBannerImg = () => {
    if (typeof bannerImg === "function") {
      return <div className={css(styles.img)}>{bannerImg()}</div>;
    }
    return (
      <Illustration
        className={css(styles.img)}
        draggable={false}
        name={bannerImg}
        alt="illustration"
      />
    );
  };

  const renderPrimaryButton = () => {
    if (cta) {
      const { text, ...buttonProps } = cta;
      return (
        <PrimaryButton
          {...buttonProps}
          openInNewTab
          style={[
            {
              fontSize: 18,
              border: "none",
              padding: "11px 60px",
            },
            styles.cta,
            buttonProps.style,
          ]}
        >
          {text}
        </PrimaryButton>
      );
    }

    return null;
  };

  const stringOrRender = (
    value?: (string | (() => ReactNode)) | null | undefined,
  ) => {
    if (!value) {
      return null;
    }

    return (
      <>{typeof value === "function" ? value() : <Markdown text={value} />}</>
    );
  };

  return (
    <StaggeredFadeIn
      className={css(styles.root, className, style)}
      deltaY={10}
      animationDurationMs={500}
    >
      <Layout.FlexColumn
        className={css(styles.content)}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Layout.FlexColumn alignItems="flex-start">
          <Heading variant="h2" className={css(styles.title)}>
            {stringOrRender(title)}
          </Heading>
          <Text variant="bodyLStrong" className={css(styles.body)}>
            {stringOrRender(body)}
          </Text>
        </Layout.FlexColumn>
        {renderPrimaryButton()}
      </Layout.FlexColumn>
      {renderBannerImg()}
    </StaggeredFadeIn>
  );
};

export default observer(Banner);

const useStylesheet = ({ textColor }: { readonly textColor: string }) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          padding: `20px 0px`,
          alignItems: "center",
          justifyContent: "space-between",
        },
        content: {
          maxWidth: "60%",
          alignSelf: "stretch",
          padding: "10px 15px 10px 0px",
        },
        img: {
          maxWidth: "40%",
          alignSelf: "center",
        },
        title: {
          color: textColor,
          marginBottom: 15,
          cursor: "default",
          wordWrap: "break-word",
          whiteSpace: "normal",
        },
        body: {
          color: textColor,
          marginBottom: 25,
          cursor: "default",
          wordWrap: "break-word",
          whiteSpace: "normal",
        },
        cta: {
          alignSelf: "flex-start",
        },
      }),
    [textColor],
  );
};
