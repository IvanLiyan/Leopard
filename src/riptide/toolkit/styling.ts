// copied in, can bring up to spec later
/* eslint-disable */
import { StyleSheet, css as _css } from "aphrodite";

const cssRecursive = ({ configs, mergedStyles, styleFragment }: any) => {
  for (const config of configs) {
    if (!config) {
      continue;
    }

    if (typeof config === "string") {
      mergedStyles.push(_css(styleFragment));
      mergedStyles.push(config);
      styleFragment.length = 0; // an awesome way to empty an array
    } else if (Array.isArray(config)) {
      cssRecursive({
        configs: config,
        mergedStyles,
        styleFragment,
      });
    } else if (typeof config === "object") {
      // eslint-disable-next-line no-underscore-dangle
      if (config._len == null) {
        // config is a plain style object
        styleFragment.push(
          StyleSheet.create({
            inline: config,
          }).inline,
        );
      } else {
        // config is a return value from StyleSheet.create()
        styleFragment.push(config);
      }
    }
  }
};

export const css = (
  ...configs: ReadonlyArray<any | null | undefined>
): string => {
  /*
   * [styleObj1, styleObj2, className1, styleObj3]
   * will be merged into:
   * [styleObj1_styleObj2, className1, styleObj3]
   */
  const mergedStyles: string[] = [];
  // TODO [lliepert]: fix legacy any types
  const styleFragment: any[] = [];
  cssRecursive({ configs, mergedStyles, styleFragment });
  mergedStyles.push(_css(styleFragment));

  return mergedStyles.join(" ");
};

export const sleep = (interval: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), interval);
  });
};
