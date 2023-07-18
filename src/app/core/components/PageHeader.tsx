import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4Markdown } from "@ContextLogic/lego";
import LegacyHeader from "@core-builder/page-header/WelcomeHeader";
import { Breadcrumbs, BreadcrumbItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { IllustrationName } from "@core/components/Illustration";

import {
  SidePadding,
  RelaxedSidePadding,
  VeryRelaxedSidePadding,
} from "./PageGuide";

export type PageHeaderProps = BaseProps & {
  readonly title?: string;
  readonly breadcrumbs?: ReadonlyArray<BreadcrumbItem>;
  readonly actions?: ReactNode;
  readonly hideBackground?: boolean;
  readonly sticky?: boolean;
  readonly relaxed?: boolean;
  readonly veryRelaxed?: boolean;
  readonly illustration?: (IllustrationName | (() => ReactNode)) | null;
  readonly paddingY?: number;
};

const PageHeader = (props: PageHeaderProps) => {
  const styles = useStylesheet(props);
  const {
    title,
    breadcrumbs,
    actions,
    hideBackground,
    style,
    className,
    children,
    relaxed,
    veryRelaxed,
    illustration,
    paddingY,
  } = props;
  const { pageBackground } = useTheme();

  const renderedActions = actions && (
    <div className={css(styles.actionsContainer)}>{actions}</div>
  );

  const header = (
    <>
      {breadcrumbs && (
        <Breadcrumbs className={css(styles.breadcrumbs)} items={breadcrumbs} />
      )}
      <div className={css(styles.row)}>
        {title && <H4Markdown text={title} />}
        {renderedActions}
      </div>
    </>
  );

  let sidePadding = SidePadding;
  if (veryRelaxed) {
    sidePadding = VeryRelaxedSidePadding;
  } else if (relaxed) {
    sidePadding = RelaxedSidePadding;
  }

  return (
    <LegacyHeader
      className={css(styles.root, style, className)}
      title={() => header}
      body={children ? () => children : undefined}
      style={{
        padding: `${paddingY ?? 60}px ${sidePadding} ${
          paddingY ?? 20
        }px ${sidePadding}`,
        ...(hideBackground ? { backgroundColor: pageBackground } : {}),
      }}
      illustration={illustration}
      hideBorder
      animate={false}
    />
  );
};

const useStylesheet = (props: PageHeaderProps) => {
  const { sticky = false } = props;

  return useMemo(
    () =>
      StyleSheet.create({
        root: sticky
          ? {
              top: 0,
              position: "sticky",
              zIndex: 200,
            }
          : {},
        breadcrumbs: {
          margin: "10px 0px",
        },
        row: {
          display: "flex",
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        },
        actionsContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          "@media (max-width: 900px)": {
            marginTop: 15,
          },
          ":nth-child(1n) > *": {
            ":not(:first-child)": {
              paddingLeft: 12,
            },
          },
        },
      }),
    [sticky],
  );
};

export default observer(PageHeader);
