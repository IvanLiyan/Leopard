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

const Flag: React.FC<FlagProps> = (props) => {
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
