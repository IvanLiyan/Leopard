import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  KEYCODE_R,
  KEYCODE_UP,
  KEYCODE_DOWN,
  KEYCODE_ENTER,
  KEYCODE_ESCAPE,
} from "@core/toolkit/dom";
import { TopBarHeight } from "@chrome/components/chrome/ChromeTopBar";
import { SearchBox, StaggeredFadeIn } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { asyncSleep } from "@ContextLogic/lego/toolkit/mobx";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Toolkit */
import { useLogger } from "@core/toolkit/logger";

/* Relative Imports */
import SearchResults from "@chrome/components/chrome/search/PlusSearchResults";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useEnvironmentStore } from "@core/stores/EnvironmentStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useUserStore } from "@core/stores/UserStore";
import { useTheme, useThemeStore } from "@core/stores/ThemeStore";
import { NavigationSearchResult, useSearchStore } from "@chrome/searchStore";

const SEARCH_WIDTH = 600;
const SEARCH_HEIGHT = TopBarHeight * 0.65;

const MerchantAppSearch: React.FC<BaseProps> = ({
  style,
  className,
}: BaseProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const { isDev } = useEnvironmentStore();
  const { loggedInMerchantUser, isMerchant, su } = useUserStore();
  const { locale } = useLocalizationStore();
  const { surfaceLightest, textBlack } = useTheme();

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const searchStore = useSearchStore();

  const { pageSearchResult, searchResultGroups } = searchStore;

  const { lightenedTopbarBackground } = useThemeStore();
  const currentPagePhrase = pageSearchResult?.search_phrase;
  const [hasFocus, setHasFocus] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);

  const onRefSet = useCallback(
    (ref) => {
      setInputRef(ref);
    },
    [setInputRef],
  );

  const allResults: ReadonlyArray<NavigationSearchResult> = useMemo(() => {
    let results: NavigationSearchResult[] = [];
    for (const resultGroup of searchResultGroups) {
      results = [...results, ...resultGroup.results];
    }

    return results;
  }, [searchResultGroups]);

  const selectedResult =
    selectedElementIndex >= 0 && selectedElementIndex < allResults.length
      ? allResults[selectedElementIndex]
      : null;

  const focusInputOnSearchShortcutPressed = useCallback(
    (e: KeyboardEvent) => {
      if (!inputRef) {
        return;
      }

      const focusedElement = document.activeElement;
      const keyboardShortcutsEnabled =
        focusedElement === inputRef ||
        (!(focusedElement instanceof HTMLInputElement) &&
          !(focusedElement instanceof HTMLTextAreaElement));
      switch (e.keyCode) {
        case KEYCODE_R: {
          if (!keyboardShortcutsEnabled || hasFocus || !isDev) {
            return;
          }

          navigationStore.reload();
          return;
        }
        case KEYCODE_DOWN: {
          if (!hasFocus) {
            return;
          }

          setSelectedElementIndex(
            Math.min(selectedElementIndex + 1, allResults.length - 1),
          );
          return;
        }
        case KEYCODE_UP: {
          if (!hasFocus) {
            return;
          }

          setSelectedElementIndex(Math.max(selectedElementIndex - 1, 0));
          return;
        }
        case KEYCODE_ENTER: {
          if (!hasFocus) {
            return;
          }
          if (selectedResult) {
            searchStore.rawSearchQuery = "";
            navigationStore.navigate(selectedResult.url);
            inputRef.blur();
          }
        }
      }
    },
    [
      hasFocus,
      inputRef,
      searchStore,
      navigationStore,
      setSelectedElementIndex,
      allResults,
      selectedElementIndex,
      selectedResult,
      isDev,
    ],
  );

  const inputBackgroundColor = useMemo(
    () => (hasFocus ? surfaceLightest : lightenedTopbarBackground),
    [lightenedTopbarBackground, hasFocus, surfaceLightest],
  );

  const setSelectedResult = useCallback(
    (result: NavigationSearchResult) => {
      setSelectedElementIndex(
        allResults.findIndex(
          (r) => r.title == result.title && r.url == result.url,
        ),
      );
    },
    [allResults],
  );

  const inputTextColor = textBlack;

  useEffect(() => {
    document.addEventListener("keyup", focusInputOnSearchShortcutPressed);
    return () =>
      document.removeEventListener("keyup", focusInputOnSearchShortcutPressed);
  }, [focusInputOnSearchShortcutPressed]);

  const logger = useLogger("CHROME_SEARCH");
  const loggedQuery = useDebouncer(searchStore.rawSearchQuery, 1500);
  useEffect(() => {
    if (loggedQuery.trim().length == 0) {
      return;
    }

    logger.info({
      userId: su?.id || loggedInMerchantUser?.id,
      merchantId: loggedInMerchantUser?.merchantId,
      query: loggedQuery,
      event: "query",
      locale,
      is_merchant: isMerchant && !su,
    });
  }, [loggedQuery, logger, loggedInMerchantUser, locale, isMerchant, su]);

  const setDropdownVisibility = (visible: boolean) => {
    setDropdownVisible(visible);
  };

  return (
    <div className={css(styles.root, className, style)}>
      <SearchBox
        value={searchStore.rawSearchQuery}
        icon="search"
        height={SEARCH_HEIGHT}
        fontSize={16}
        borderRadius={4}
        onKeyUp={(keyCode) => {
          if (keyCode == KEYCODE_ESCAPE) {
            if (inputRef) {
              inputRef.blur();
            }
          }
        }}
        onBlur={async () => {
          setHasFocus(false);

          // Sleep 100ms so result click event can register
          // before results disappear.
          await asyncSleep(200);
          setDropdownVisibility(false);
        }}
        onFocus={() => {
          setHasFocus(true);
          setDropdownVisibility(true);
          if (searchStore.rawSearchQuery == (currentPagePhrase || "")) {
            searchStore.rawSearchQuery = "";
          }
        }}
        onChange={({ text }) => {
          searchStore.rawSearchQuery = text;
        }}
        inputStyle={{
          backgroundColor: inputBackgroundColor,
          color: inputTextColor,
          transition: "background-color 0.2s linear",
        }}
        inputContainerStyle={{
          backgroundColor: inputBackgroundColor,
          transition: "background-color 0.2s linear",
        }}
        hideBorder
        inputRef={onRefSet}
        className={css(styles.input)}
        autoComplete="false"
      />

      {dropdownVisible && (
        <StaggeredFadeIn animationDurationMs={150} deltaY={1}>
          <div className={css(styles.dropdown)}>
            <SearchResults
              containerRef={resultsRef}
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
            />
          </div>
          <div className={css(styles.backdrop)} />
        </StaggeredFadeIn>
      )}
    </div>
  );
};

export default observer(MerchantAppSearch);

const useStylesheet = () => {
  const { surfaceLightest, modalBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: SEARCH_WIDTH,
          position: "relative",
          height: SEARCH_HEIGHT,
        },
        input: {
          zIndex: 999998,
        },
        dropdown: {
          position: "absolute",
          top: SEARCH_HEIGHT - 2,
          left: 0,
          right: 0,
          maxHeight: 700,
          bottomLeftBorderRadius: 4,
          bottomRightBorderRadius: 4,
          backgroundColor: surfaceLightest,
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          borderLeft: "solid 1px rgba(175, 199, 209, 0.5)",
          borderRight: "solid 1px rgba(175, 199, 209, 0.5)",
          borderBottom: "solid 1px rgba(175, 199, 209, 0.5)",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 999998,
        },
        backdrop: {
          backgroundColor: modalBackground,
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 999997,
        },
      }),
    [surfaceLightest, modalBackground],
  );
};