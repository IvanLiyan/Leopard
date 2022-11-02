/* moved from
 * @plus/component/nav/chrome/search/SearchResults.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import objectHash from "object-hash";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Relative Imports */
import SearchResult from "./PlusSearchResult";
import SearchResultsSection from "./PlusSearchResultsSection";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import {
  NavigationSearchResult,
  useSearchStore,
} from "@chrome/search/searchStore";

type Props = BaseProps & {
  readonly containerRef: React.LegacyRef<HTMLElement> | undefined;
  readonly selectedResult: NavigationSearchResult | null | undefined;
  readonly setSelectedResult: (result: NavigationSearchResult) => void;
};

const PlusSearchResults = observer((props: Props) => {
  const { className, style, containerRef, selectedResult, setSelectedResult } =
    props;
  const styles = useStylesheet();
  const { searchResultGroups } = useSearchStore();

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

export default PlusSearchResults;

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
    [surfaceLightest],
  );
};
