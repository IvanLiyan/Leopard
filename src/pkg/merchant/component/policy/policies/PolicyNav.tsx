import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { configureAnchors } from "react-scrollable-anchor";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { NavSideMenu } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useStringQueryParam } from "@toolkit/url";

import HeadingNumber from "./HeadingNumber";

export type PolicyNavSections = {
  readonly key: string;
  readonly title: string;
}[];

type PolicyNavProps = BaseProps & {
  readonly policies: PolicyNavSections;
  readonly currentSection: string;
};

export const getLocationHash = (): string =>
  (window.location.hash ?? "").substr(1);

const PolicyNav = ({
  className,
  policies,
  currentSection,
  children,
}: PolicyNavProps) => {
  const navigationStore = useNavigationStore();
  // Top offset depends on whether we're on Merchant Plus.
  const { isNavyBlueNav } = navigationStore;
  const offset = isNavyBlueNav ? 80 : 155;

  useEffect(
    () =>
      configureAnchors({
        // This controls at what point during scrolling we're marked as a "new" section.
        offset: -offset - 50,
        scrollDuration: 200,
      }),
    [offset]
  );

  const [currentPolicy, setCurrentPolicy] = useState(getLocationHash());
  useEffect(() => {
    const handler = () => {
      setCurrentPolicy(getLocationHash());
    };

    window.addEventListener("hashchange", handler, false);

    return () => {
      window.removeEventListener("hashchange", handler, false);
    };
  }, [policies]);

  // This logic can be removed once we no longer need a redirect.
  const [queryRedirect, setQueryRedirect] = useStringQueryParam("redirect");
  useEffect(() => {
    if (queryRedirect) {
      setQueryRedirect(null);
      if (currentPolicy) {
        navigationStore.navigate(`#${currentPolicy}`);
      } else {
        navigationStore.navigate(`#${queryRedirect}`);
      }
    }
  }, [queryRedirect, setQueryRedirect, currentPolicy, navigationStore]);

  useEffect(() => {
    if (currentSection) {
      setTimeout(() => {
        navigationStore.navigate(`#${currentSection}`);
      }, 500);
    }
  }, [navigationStore, currentSection]);

  const { isSmallScreen } = useDimenStore();
  const { textLight, textBlack } = useTheme();
  const styles = useStylesheet(offset, { textLight, textBlack });

  return (
    <PageGuide className={css(className, styles.root)}>
      {!isSmallScreen && (
        <div className={css(styles.sideMenuContainer)}>
          <Card className={css(styles.sideMenu)}>
            <NavSideMenu>
              {policies.map(({ key, title }, sectionNumber) => {
                const selected =
                  key == currentPolicy || (!currentPolicy && !sectionNumber);
                return (
                  <Link
                    key={key}
                    className={css(styles.sideMenuLink)}
                    href={`#${key}`}
                  >
                    <NavSideMenu.Item
                      className={css(styles.sideMenuItem)}
                      prefixedPadding={20}
                      title={() => (
                        <div
                          className={css(
                            styles.sideMenuText,
                            selected && styles.sideMenuTextSelected
                          )}
                        >
                          <HeadingNumber
                            className={css(styles.sectionNumber)}
                            index={
                              sectionNumber ? `${sectionNumber}` : undefined
                            }
                          />
                          {title}
                        </div>
                      )}
                      selected={selected}
                    />
                  </Link>
                );
              })}
            </NavSideMenu>
          </Card>
        </div>
      )}
      <div className={css(styles.policyContainer)}>{children}</div>
    </PageGuide>
  );
};

const useStylesheet = (
  offset: number,
  { textLight, textBlack }: { textLight: string; textBlack: string }
) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row-reverse",
        },
        sectionNumber: {
          width: 20,
        },
        sideMenuContainer: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 20,
          marginTop: 20,
        },
        sideMenu: {
          position: "sticky",
          top: offset,
        },
        sideMenuLink: {
          opacity: 1,
          ":hover": {
            opacity: 1,
          },
        },
        sideMenuItem: {
          ":hover > *": {
            color: textBlack,
          },
        },
        sideMenuText: {
          color: textLight,
        },
        sideMenuTextSelected: {
          color: textBlack,
        },
        policyContainer: {
          flex: 3,
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            width: "100%",
          },
        },
      }),
    [offset, textLight, textBlack]
  );

export default observer(PolicyNav);
