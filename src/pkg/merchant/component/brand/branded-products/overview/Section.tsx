import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import SectionItem from "./SectionItem";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SectionProps = BaseProps & {
  readonly header?: string;
};

const Section = ({ header, children }: SectionProps) => {
  const styles = useStylesheet();
  const items = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );
  const numItems = React.Children.count(items);
  const styledChildren =
    children &&
    React.Children.map(items, (child, index) => {
      if (!React.isValidElement(child)) {
        return;
      }
      let className = css(styles.section);
      let illustrationStyle = undefined;

      if (index < numItems - 1) {
        className = css(className, styles.leftSection);
      }

      if (numItems > 1) {
        className = css(className, styles.columnSection);
        illustrationStyle = css(styles.columnSectionIllusration);
      }

      return React.cloneElement(child, { className, illustrationStyle });
    });
  return (
    <>
      {header && <H4Markdown text={header} />}
      {numItems === 1 ? (
        styledChildren
      ) : (
        <div className={css(styles.root)}>{styledChildren}</div>
      )}
    </>
  );
};

Section.Item = SectionItem;
export default observer(Section);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
        },
        section: {
          marginTop: 24,
          marginBottom: 24,
        },
        columnSection: {
          minHeight: 277,
          width: "50%",
        },
        leftSection: {
          marginRight: 24,
        },
        columnSectionIllusration: {
          position: "absolute",
          width: "50%",
          height: "50%",
          right: 0,
          bottom: 24,
        },
      }),
    []
  );
