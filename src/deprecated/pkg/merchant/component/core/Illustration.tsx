//
//  component/Illustration.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 6/1/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, StaggeredScaleIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import * as illustrations from "@deprecated/pkg/assets/illustrations";

import {
  BaseProps,
  CleanedBaseImageProps,
} from "@ContextLogic/lego/toolkit/react";

import NextImage from "@core/components/Image";

export type IllustrationName = keyof typeof illustrations;

export type IllustrationProps = BaseProps &
  Omit<CleanedBaseImageProps, "alt" | "src"> & {
    readonly name: IllustrationName;
    readonly alt: string;
    readonly animate?: boolean;
  };

const Illustration: React.FC<IllustrationProps> = observer(
  (props: IllustrationProps) => {
    const {
      alt,
      name,
      animate = false,
      className,
      style,
      ...otherProps
    } = props;

    const illustrationSrc = illustrations[name];
    if (illustrationSrc == null) {
      return null;
    }

    const Content = () => (
      <NextImage
        // lliepert: nextjs svg loader returns urls of the form
        // {src: '/_next/static/media/red-x.c35a6eb1.svg', height: 24, width: 24}
        src={illustrationSrc.src}
        alt={alt}
        draggable={false}
        style={{ width: "100%", height: "100%" }}
        {...otherProps}
      />
    );

    if (!animate) {
      return (
        <Layout.FlexRow className={css(className, style)}>
          <Content />
        </Layout.FlexRow>
      );
    }

    return (
      <StaggeredScaleIn
        className={css(className, style)}
        startScale={0.8}
        animationDurationMs={200}
      >
        <Content />
      </StaggeredScaleIn>
    );
  },
);

export default Illustration;
