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
import { StaggeredScaleIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as illustrations from "@assets/illustrations";

import {
  BaseProps,
  CleanedBaseImageProps,
} from "@ContextLogic/lego/toolkit/react";

import NextImage from "@next-toolkit/Image";

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
        src={illustrationSrc}
        alt={alt}
        draggable={false}
        style={{ width: "100%", height: "100%" }}
        {...otherProps}
      />
    );

    if (!animate) {
      return (
        <div className={css(className, style)}>
          <Content />
        </div>
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
