import { StyleSheet, css as _css, CSSProperties } from "aphrodite";

export type Style =
  | string
  | ItemOf<Parameters<typeof _css>>
  | Parameters<typeof _css>;

const cssRecursive = ({
  configs,
  classNamesSoFar,
  stylesSoFar,
}: {
  readonly configs: ReadonlyArray<Style>;
  readonly classNamesSoFar: string;
  readonly stylesSoFar: Parameters<typeof _css>;
}): { classNames: string; styles: Parameters<typeof _css> } => {
  for (const config of configs) {
    if (!config) {
      continue;
    }

    if (typeof config === "string") {
      classNamesSoFar = `${classNamesSoFar} ${config}`;
    } else if (Array.isArray(config)) {
      const { classNames, styles } = cssRecursive({
        configs: config,
        classNamesSoFar,
        stylesSoFar,
      });
      classNamesSoFar = classNames;
      stylesSoFar = styles;
    } else if (typeof config === "object") {
      // @ts-ignore:: _len exists on object returned from .create
      // eslint-disable-next-line no-underscore-dangle
      if (config._len == undefined) {
        // config is a plain style object
        stylesSoFar = [
          ...stylesSoFar,
          StyleSheet.create({ style: config as CSSProperties }).style,
        ];
      } else {
        // config is a return value from StyleSheet.create()
        stylesSoFar = [...stylesSoFar, config];
      }
    }
  }

  return { classNames: classNamesSoFar, styles: stylesSoFar };
};

export const css = (...configs: ReadonlyArray<Style>): string => {
  /*
   * [styleObj1, styleObj2, className1, styleObj3, className2]
   * will be merged into:
   * "styleObj1_styleObj2_styleObj3 className1 className2"
   */
  const { classNames, styles } = cssRecursive({
    configs,
    classNamesSoFar: "",
    stylesSoFar: [],
  });

  return `${_css(styles)} ${classNames}`;
};
