//
//  component/Flag.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 7/15/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  Flags4x3,
  Flags1x1,
  getCountryName,
  NextSVGLoaderBody,
} from "@toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

import NextImage from "@next-toolkit/Image";

export type FlagAspectRatio = "4x3" | "1x1";

export type FlagProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> &
  BaseProps & {
    readonly alt?: string;
    readonly countryCode: CountryCode | "EU" | "D";
    readonly aspectRatio?: FlagAspectRatio;
    readonly displayCountryName?: boolean;
    readonly customCountryName?: string | null;
    readonly countryNameStyle?: CSSProperties | string;
    readonly flagContainerStyle?: CSSProperties | string;
  };

const propDoc = {
  countryCode: {
    required: true,
    type: "CountryCode",
    description: `Country code of the flag to display`,
  },
  aspectRatio: {
    required: false,
    defaultValue: `"4x3"`,
    type: `"4x3" | "1x1"`,
    description: `Aspect ratio of the flag to display`,
  },
  displayCountryName: {
    required: false,
    defaultValue: "false",
    type: "boolean",
    description: `Controls whether or not the country name is displayed next to the flag`,
  },
  countryNameStyle: {
    required: false,
    defaultValue: "null",
    type: "CSSStyleDeclaration",
    description: `Stylesheet for optional country name`,
  },
  flagContainerStyle: {
    required: false,
    defaultValue: "null",
    type: "CSSStyleDeclaration",
    description: `Stylesheet for the flag container`,
  },
};

const demoProps: FlagProps = {
  countryCode: "US",
  style: { width: 20, height: 20 },
};

const flagUrl = (
  countryCode: string,
  aspectRatio?: FlagAspectRatio | null | undefined,
): NextSVGLoaderBody => {
  switch (aspectRatio) {
    case "4x3":
      return Flags4x3[countryCode.toLowerCase()];
    default:
      return Flags1x1[countryCode.toLowerCase()];
  }
};

const Flag = (props: FlagProps) => {
  const styles = useStylesheet();
  const {
    countryCode,
    aspectRatio = "4x3",
    alt,
    displayCountryName = false,
    countryNameStyle,
    flagContainerStyle,
    customCountryName,
    ...otherProps
  } = props;

  const flag = (
    <NextImage
      alt={alt || `flag for ${countryCode}`}
      src={flagUrl(countryCode, aspectRatio).src}
      height="12px"
      width="16px"
      draggable={false}
      {...otherProps}
    />
  );

  if (displayCountryName) {
    return (
      <div className={css(styles.container, flagContainerStyle)}>
        {flag}
        <div className={css(styles.text, countryNameStyle)}>
          {customCountryName == null
            ? getCountryName(countryCode)
            : customCountryName}
        </div>
      </div>
    );
  }
  return flag;
};

Flag.propDoc = propDoc;
Flag.demoProps = demoProps;

export default Flag;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          alignItems: "center",
        },
        text: {
          marginLeft: 10,
        },
      }),
    [],
  );
