import React, { useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { StyleSheet } from "aphrodite";
import { css } from "@toolkit/styling";

export type Props = Pick<ImageProps, "width" | "alt"> & {
  readonly height?: number;
  readonly cc: string; // TODO [lliepert]: better typing
};

const Flag: React.FC<Props> = ({ cc, height = 12, alt }: Props) => {
  const width = (4 / 3) * height;
  const styles = useStylesheet();
  const src = `/flags/${cc}.svg`;
  return (
    <Image
      className={css(styles.root)}
      src={src}
      height={height}
      width={width}
      alt={alt}
    />
  );
};

export default Flag;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: "1px",
        },
      }),
    [],
  );
