/*
 * Section.tsx
 *
 * Created by Jonah Dlin on Thu Oct 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo, ReactElement } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Card,
  Markdown,
  Accordion,
  StaggeredFadeIn,
  Layout,
  Info,
  ErrorText,
} from "@ContextLogic/lego";
import { AccordionProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Toolkit */
import { useTheme } from "@core/stores/ThemeStore";

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
  readonly tooltip?: string;
  readonly errorMessage?: string;
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
    tooltip,
    errorMessage,
    ...accordionProps
  } = props;
  const { surfaceLight } = useTheme();
  const styles = useStylesheet();
  const [isOpenState, onOpenToggledState] = useState(true);
  const isOpen = isOpenProp ?? isOpenState;
  const onOpenToggled = onOpenToggledProp ?? onOpenToggledState;

  const hideChevron = alwaysOpen || isTip;

  return (
    <Layout.FlexColumn
      alignItems="stretch"
      style={[styles.root, !isTip && { position: "relative" }]}
    >
      <Layout.FlexColumn style={[className, style]}>
        <Card
          style={{ boxShadow: "none" }}
          contentContainerStyle={css(styles.root)}
        >
          <Accordion
            isOpen={isOpen}
            onOpenToggled={onOpenToggled}
            header={() => (
              <Layout.FlexRow alignItems="center" style={{ gap: "8px" }}>
                <Markdown
                  className={css(styles.header)}
                  text={markdown ? title : `**${title}**`}
                />
                {tooltip && <Info text={tooltip} />}
              </Layout.FlexRow>
            )}
            headerContainerStyle={{
              padding: `0px ${hideChevron ? 16 : 8}px`,
              height: 48,
              backgroundColor: surfaceLight,
            }}
            chevronLocation="left"
            chevronSize={16}
            hideChevron={hideChevron}
            {...accordionProps}
          >
            <Layout.FlexColumn
              alignItems="stretch"
              style={[
                styles.content,
                contentStyle,
                hasInvalidData ? styles.invalidData : null,
              ]}
            >
              {children}
            </Layout.FlexColumn>
          </Accordion>
        </Card>
        {hasInvalidData && errorMessage && (
          <ErrorText style={{ marginTop: "8px" }}>{errorMessage}</ErrorText>
        )}
      </Layout.FlexColumn>
      {rightCard && isOpen && (
        <StaggeredFadeIn
          style={styles.rightCard}
          deltaY={-5}
          animationDurationMs={400}
        >
          {rightCard}
        </StaggeredFadeIn>
      )}
    </Layout.FlexColumn>
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
        },
        header: {
          marginLeft: 2,
          fontSize: 16,
          lineHeight: "26px",
          color: textBlack,
        },
        content: {
          backgroundColor: surfaceLightest,
          padding: 24,
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
