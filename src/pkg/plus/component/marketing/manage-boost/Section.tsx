import React, { useState, useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Markdown, Accordion } from "@ContextLogic/lego";
import { AccordionProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";

export type SectionProps = Omit<
  AccordionProps,
  | "header"
  | "headerContainerStyle"
  | "chevronLocation"
  | "chevronSize"
  | "hideChevron"
> & {
  readonly title: string;
  readonly contentStyle?: CSSProperties | string;
  readonly hasInvalidData?: boolean;
  readonly markdown?: boolean;
  readonly isTip?: boolean;
  readonly renderRight?: () => React.ReactNode;
};

const MARKDOWN_DEFAULT = false;

const Section = (props: SectionProps) => {
  const {
    className,
    style,
    title,
    children,
    contentStyle,
    hasInvalidData,
    markdown = MARKDOWN_DEFAULT,
    isOpen: isOpenProp,
    onOpenToggled: onOpenToggledProp,
    isTip,
    renderRight,
    ...accordionProps
  } = props;
  const { surfaceLight } = useTheme();
  const styles = useStylesheet();
  const [isOpenState, onOpenToggledState] = useState(true);
  const isOpen = isOpenProp ?? isOpenState;
  const onOpenToggled = onOpenToggledProp ?? onOpenToggledState;

  return (
    <Card
      className={css(className, style)}
      style={{ boxShadow: "none" }}
      contentContainerStyle={css(styles.root)}
    >
      <Accordion
        isOpen={isOpen}
        onOpenToggled={onOpenToggled}
        header={() => (
          <div className={css(styles.headerContent)}>
            <Markdown
              className={css(styles.header)}
              text={markdown ? title : `**${title}**`}
            />
            {renderRight ? renderRight() : null}
          </div>
        )}
        headerContainerStyle={{
          padding: "7px 10px",
          backgroundColor: surfaceLight,
        }}
        chevronLocation="left"
        chevronSize={12}
        hideChevron={isTip}
        {...accordionProps}
      >
        <div
          className={css(
            styles.content,
            contentStyle,
            hasInvalidData ? styles.invalidData : null
          )}
        >
          {children}
        </div>
      </Accordion>
    </Card>
  );
};

export default observer(Section);

const useStylesheet = () => {
  const { surfaceLightest, negative, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        header: {
          marginLeft: 7,
          color: textBlack,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: surfaceLightest,
        },
        invalidData: {
          border: `1px solid ${negative}`,
        },
        headerContent: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }),
    [surfaceLightest, negative, textBlack]
  );
};
