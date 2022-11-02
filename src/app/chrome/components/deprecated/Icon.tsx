//
//  src/Icon.tsx
//  Project-Lego
//
//  Created by Richard Ye on 12/04/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React from "react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import * as icons from "@deprecated/pkg/assets/icons";
import { toSentenceCase } from "@ContextLogic/lego/toolkit/string";

import {
  BaseProps,
  CleanedBaseDivProps,
} from "@ContextLogic/lego/toolkit/react";

import NextImage from "@core/components/Image";

export type IconName = keyof typeof icons;

export type IconProps = BaseProps &
  CleanedBaseDivProps & {
    readonly name: IconName;
    readonly alt?: string;
  };

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { alt, name, className, style, ...otherProps } = props;

  const iconSrc = icons[name];
  if (iconSrc == null) {
    return null;
  }

  const Content = () => (
    <NextImage
      // lliepert: nextjs svg loader returns urls of the form
      // {src: '/_next/static/media/red-x.c35a6eb1.svg', height: 24, width: 24}
      src={iconSrc.src}
      alt={alt || toSentenceCase(name)}
      draggable={false}
      style={{ width: "100%", height: "100%" }}
    />
  );

  return (
    <div className={css(className, style)} {...otherProps}>
      <Content />
    </div>
  );
};

export default Icon;
