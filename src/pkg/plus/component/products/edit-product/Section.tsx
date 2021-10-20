import React, { useState, useMemo, ReactElement } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Markdown, Accordion, StaggeredFadeIn } from "@ContextLogic/lego";
import { AccordionProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { useTheme } from "@stores/ThemeStore";

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
  readonly rightCard?: ReactElement;
  readonly isTip?: boolean;
  readonly alwaysOpen?: boolean;
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
    rightCard,
    isTip,
    alwaysOpen,
    ...accordionProps
  } = props;
  const { surfaceLight } = useTheme();
  const styles = useStylesheet();
  const [isOpenState, onOpenToggledState] = useState(true);
  const isOpen = isOpenProp ?? isOpenState;
  const onOpenToggled = onOpenToggledProp ?? onOpenToggledState;

  return (
    <div
      className={css(styles.root)}
      style={!isTip ? { position: "relative" } : {}}
    >
      <Card
        className={css(className, style)}
        style={{ boxShadow: "none" }}
        contentContainerStyle={css(styles.root)}
      >
        <Accordion
          isOpen={isOpen}
          onOpenToggled={onOpenToggled}
          header={() => (
            <Markdown
              className={css(styles.header)}
              text={markdown ? title : `**${title}**`}
            />
          )}
          headerContainerStyle={{
            padding: alwaysOpen ? "12px 10px" : "7px 10px",
            backgroundColor: surfaceLight,
          }}
          chevronLocation="left"
          chevronSize={12}
          hideChevron={alwaysOpen || isTip}
          {...accordionProps}
        >
          <div
            className={css(
              styles.content,
              contentStyle,
              hasInvalidData ? styles.invalidData : null,
            )}
          >
            {children}
          </div>
        </Accordion>
      </Card>
      {rightCard && isOpen && (
        <StaggeredFadeIn deltaY={-5} animationDurationMs={400}>
          {React.cloneElement(rightCard, { className: css(styles.rightCard) })}
        </StaggeredFadeIn>
      )}
    </div>
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
          padding: 15,
        },
        invalidData: {
          border: `1px solid ${negative}`,
        },
        rightCard: {
          position: "absolute",
          overflow: "visible",
          top: 0,
          left: "100%",
          "@media (max-width: 900px)": {
            position: "relative",
            left: 0,
            flex: 1,
          },
          "@media (min-width: 900px)": {
            width: "calc((300% / 7) - 37px)",
            marginLeft: 35,
          },
        },
      }),
    [surfaceLightest, negative, textBlack],
  );
};
