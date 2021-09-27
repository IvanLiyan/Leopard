import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import objectHash from "object-hash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Relative Imports */
import SearchResult from "./SearchResult";
import SearchResultsSection from "./SearchResultsSection";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationSearchResult } from "@merchant/stores/NavigationStore";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  // Reason: can't find the type definition for a ref handle.
  readonly containerRef: any;
  readonly selectedResult: NavigationSearchResult | null | undefined;
  readonly setSelectedResult: (result: NavigationSearchResult) => void;
};

const SearchResults = observer((props: Props) => {
  const {
    className,
    style,
    containerRef,
    selectedResult,
    setSelectedResult,
  } = props;
  const styles = useStylesheet();
  const {
    navigationStore: { searchResultGroups },
  } = useStore();

  return (
    <section ref={containerRef} className={css(styles.root, className, style)}>
      {searchResultGroups.map(({ title, type, results }) => (
        <SearchResultsSection key={type} title={title}>
          {results.map((result) => (
            <div
              key={resultKey(result)}
              onMouseEnter={() => {
                setSelectedResult(result);
              }}
            >
              <SearchResult
                result={result}
                isSelected={
                  selectedResult?.title === result.title &&
                  selectedResult?.url === result.url
                }
              />
            </div>
          ))}
        </SearchResultsSection>
      ))}
    </section>
  );
});

const resultKey = (result: NavigationSearchResult): string => {
  return objectHash({
    title: result.title,
    url: result.url,
    breadcrumbs: result.breadcrumbs,
  });
};

export default SearchResults;

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: surfaceLightest,
        },
      }),
    [surfaceLightest]
  );
};
