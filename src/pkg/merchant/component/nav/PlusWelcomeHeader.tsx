/* moved from
 * @plus/component/nav/PlusWelcomeHeader.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

/*
 *
 * PlusWelcomeHeader.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4Markdown } from "@ContextLogic/lego";
import WelcomeHeader from "@merchant/component/core/WelcomeHeader";
import { Breadcrumbs, BreadcrumbItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

import { SidePadding, RelaxedSidePadding } from "./PageGuide";

export type PlusWelcomeHeaderProps = BaseProps & {
  readonly title: string;
  readonly breadcrumbs?: ReadonlyArray<BreadcrumbItem>;
  readonly actions?: ReactNode;
  readonly hideBackground?: boolean;
  readonly sticky?: boolean;
  readonly relaxed?: boolean;
};

const PlusWelcomeHeader = (props: PlusWelcomeHeaderProps) => {
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
        <H4Markdown text={title} />
        {renderedActions}
      </div>
    </>
  );

  const sidePadding = relaxed ? RelaxedSidePadding : SidePadding;
  return (
    <WelcomeHeader
      className={css(styles.root, style, className)}
      title={() => header}
      body={children ? () => children : undefined}
      style={{
        padding: `60px ${sidePadding} 20px ${sidePadding}`,
        ...(hideBackground ? { backgroundColor: pageBackground } : {}),
      }}
      hideBorder
      animate={false}
    />
  );
};

const useStylesheet = (props: PlusWelcomeHeaderProps) => {
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
    [sticky]
  );
};

export default observer(PlusWelcomeHeader);
