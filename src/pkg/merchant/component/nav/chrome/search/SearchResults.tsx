import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import objectHash from "object-hash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Relative Imports */
import SearchResult from "./SearchResult";
import SearchResultsSection from "./SearchResultsSection";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  NavigationSearchResult,
  useNavigationStore,
} from "@stores/NavigationStore";

type Props = BaseProps & {
  // Reason: can't find the type definition for a ref handle.
  readonly containerRef: any;
  readonly selectedResult: NavigationSearchResult | null | undefined;
  readonly setSelectedResult: (result: NavigationSearchResult) => void;
};

const SearchResults = observer((props: Props) => {
  const { className, style, containerRef, selectedResult, setSelectedResult } =
    props;
  const styles = useStylesheet();
  const { searchResultGroups } = useNavigationStore();

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
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: palettes.textColors.White,
        },
      }),
    []
  );
};
