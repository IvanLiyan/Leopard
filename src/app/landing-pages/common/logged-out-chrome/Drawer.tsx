import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import posed, { PoseGroup } from "react-pose";

/* Lego Toolkit */
import {
  palettes,
  modalBackdrop,
} from "@deprecated/pkg/toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@core/toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useChromeContext } from "@core/stores/ChromeStore";
import Icon from "@core/components/Icon";
import { SideMenu } from "@ContextLogic/lego";
import AppLocaleSelector from "@chrome/components/AppLocaleSelector";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useTheme as useAtlasTheme } from "@ContextLogic/atlas-ui";

const DrawerContentContainer = posed.nav({
  open: { right: "0%", staggerChildren: 100 },
  closed: { right: "-100%" },
});

const Backdrop = posed.div({
  enter: { opacity: 0.95 },
  exit: { opacity: 0 },
});

type DrawerProps = BaseProps & {
  readonly onClickCta?: () => unknown;
  readonly ctaText?: string;
};

const Drawer: React.FC<DrawerProps> = ({ children, onClickCta, ctaText }) => {
  const chromeContext = useChromeContext();
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const closeDrawer = useCallback(() => {
    chromeContext.setIsDrawerOpen(false);
  }, [chromeContext]);

  const isOpen = chromeContext.isDrawerOpen;

  return (
    <>
      <PoseGroup>
        {isOpen && (
          <Backdrop
            className={css(styles.backdrop)}
            key="backdrop"
            onClick={closeDrawer}
          />
        )}
      </PoseGroup>
      <DrawerContentContainer
        className={css(styles.drawer)}
        key="drawer"
        pose={isOpen ? "open" : "closed"}
      >
        <div className={css(styles.header)}>
          <Icon
            className={css(styles.closeButton)}
            name="x"
            onClick={closeDrawer}
          />
        </div>
        {isOpen && (
          <section className={css(styles.content)}>
            <SideMenu hideOnSmallScreen={false}>
              {children || (
                <>
                  <SideMenu.Item
                    title={i`Log In`}
                    href={
                      navigationStore.queryParams.next
                        ? `/login?next=${navigationStore.queryParams.next}`
                        : "/login"
                    }
                  />
                  {ctaText != null && (
                    <SideMenu.Item
                      title={ctaText}
                      onClick={
                        onClickCta == null
                          ? undefined
                          : () => {
                              onClickCta();
                            }
                      }
                    />
                  )}
                </>
              )}
            </SideMenu>
            <div className={css(styles.bottomSection)}>
              <AppLocaleSelector />
            </div>
          </section>
        )}
      </DrawerContentContainer>
    </>
  );
};

export default observer(Drawer);

const useStylesheet = () => {
  const { zIndex } = useAtlasTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: zIndex.drawer,
          backgroundColor: modalBackdrop,
        },
        header: {
          height: 60,
          borderBottom: "1px solid rgba(196, 205, 213, 0.5)",
          display: "flex",
          alignItems: "center",
          flexDirection: "row-reverse",
        },
        closeButton: {
          padding: 15,
          height: 16,
          cursor: "pointer",
        },
        drawer: {
          position: "fixed",
          top: 0,
          bottom: 0,
          backgroundColor: palettes.textColors.White,
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "60%",
          zIndex: zIndex.drawer,
          boxShadow:
            "-2px 0 4px 0 rgba(175, 199, 209, 0.2), inset 1px 0 0 0 rgba(175, 199, 209, 0.5)",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        bottomSection: {
          borderTop: "1px solid rgba(196, 205, 213, 0.5)",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }),

    [zIndex.drawer],
  );
};
