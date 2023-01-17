import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css, Style } from "@core/toolkit/styling";
import SiteFooter from "@core/components/SiteFooter";

const HIDE_FOOTER_DEFAULT = false;
const CONTENT_MAX_WIDTH = 1024;
const RELAXED_CONTENT_MAX_WIDTH = 1500;
const VERY_RELAXED_CONTENT_MAX_WIDTH = 1864;

export const SidePadding = `max(4%, (100% - ${CONTENT_MAX_WIDTH}px) / 2)`;
export const RelaxedSidePadding = `max(4%, (100% - ${RELAXED_CONTENT_MAX_WIDTH}px) / 2)`;
export const VeryRelaxedSidePadding = `max(24px, (100% - ${VERY_RELAXED_CONTENT_MAX_WIDTH}px) / 2)`;

type Props = BaseProps & {
  readonly relaxed?: boolean;
  readonly veryRelaxed?: boolean;
  readonly hideFooter?: boolean;
  readonly contentContainerStyle?: Style;
};

const PageGuide: React.FC<Props> = observer((props) => {
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
  veryRelaxed = false,
  hideFooter = HIDE_FOOTER_DEFAULT,
}: Props) => {
  let sidePadding = SidePadding;
  let contentMaxWidth = CONTENT_MAX_WIDTH;
  if (veryRelaxed) {
    sidePadding = VeryRelaxedSidePadding;
    contentMaxWidth = VERY_RELAXED_CONTENT_MAX_WIDTH;
  } else if (relaxed) {
    sidePadding = RelaxedSidePadding;
    contentMaxWidth = RELAXED_CONTENT_MAX_WIDTH;
  }

  return useMemo(() => {
    return StyleSheet.create({
      root: {
        flex: 1,
        WebkitFlexShrink: 0,
        WebkitFlexBasis: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        paddingBottom: hideFooter ? "2%" : undefined,
      },
      pageGuideContent: {
        flex: 1,
        width: `min(100%, ${contentMaxWidth}px)`,
      },
    });
  }, [contentMaxWidth, hideFooter, sidePadding]);
};

export default PageGuide;
