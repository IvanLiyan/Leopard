//
//  PageGuide.tsx
//  Merchant Plus
//
//  Created by Sola Ogunsakin on 05/16/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Plus Components */
import SiteFooter from "@plus/component/nav/SiteFooter";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const HIDE_FOOTER_DEFAULT = false;

const CONTENT_MAX_WIDTH = 1024;
const RELAXED_CONTENT_MAX_WIDTH = 1500;
export const SidePadding = `max(4%, (100% - ${CONTENT_MAX_WIDTH}px) / 2)`;
export const RelaxedSidePadding = `max(4%, (100% - ${RELAXED_CONTENT_MAX_WIDTH}px) / 2)`;

type Props = BaseProps & {
  readonly relaxed?: boolean;
  readonly hideFooter?: boolean;
  readonly contentContainerStyle?: CSSProperties | string;
};

const PageGuide: React.FC<Props> = observer((props: Props) => {
  const {
    className,
    children,
    style,
    contentContainerStyle,
    hideFooter = HIDE_FOOTER_DEFAULT,
  } = props;
  const styles = useStylesheet(props);

  return (
    <>
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.pageGuideContent, contentContainerStyle)}>
          {children}
        </div>
      </div>
      {/* to properly display the footer at the bottom of the page, 
          the container root must be wrapped in a PageRoot */}
      {!hideFooter && <SiteFooter />}
    </>
  );
});

const useStylesheet = ({
  relaxed = false,
  hideFooter = HIDE_FOOTER_DEFAULT,
}: Props) => {
  return useMemo(() => {
    return StyleSheet.create({
      root: {
        flex: 1,
        WebkitFlexShrink: 0,
        WebkitFlexBasis: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        paddingLeft: relaxed ? RelaxedSidePadding : SidePadding,
        paddingRight: relaxed ? RelaxedSidePadding : SidePadding,
        paddingBottom: !!hideFooter ? "2%" : undefined,
      },
      pageGuideContent: {
        flex: 1,
        width: `min(100%, ${
          relaxed ? RELAXED_CONTENT_MAX_WIDTH : CONTENT_MAX_WIDTH
        }px)`,
      },
    });
  }, [hideFooter, relaxed]);
};

export default PageGuide;
