import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Markdown } from "@ContextLogic/lego";

export type CollectionBoostSearchTermSuggestionProps = BaseProps & {
  readonly showSuggestion: boolean;
  readonly suggestionsMap: Map<string, Map<string, []>>;
  readonly suggestionTerms: string;
  readonly suggestionMessage: string;
};

const CollectionsBoostSearchTermSuggestion = (
  props: CollectionBoostSearchTermSuggestionProps
) => {
  const styles = useStylesheet();
  const [suggestionListOpen, setSuggestionListOpen] = useState(true);
  const {
    showSuggestion,
    suggestionsMap,
    suggestionTerms,
    suggestionMessage,
  } = props;

  if (showSuggestion) {
    return (
      <Accordion
        header={i`Problems and Suggestions:`}
        className={css(styles.accordion)}
        isOpen={suggestionListOpen}
        onOpenToggled={(isOpen) => {
          setSuggestionListOpen(isOpen);
        }}
      >
        {Array.from(suggestionsMap.keys()).map((suggestionKey) => (
          <HorizontalField
            className={css(styles.suggestion)}
            title={suggestionKey}
            titleAlign="start"
            titleWidth="200"
            popoverContent={() => {
              const message = suggestionsMap
                .get(suggestionKey)
                ?.get(suggestionMessage)
                ?.toString();
              if (message) {
                return (
                  <Markdown
                    className={css(styles.markdown)}
                    text={message}
                    openLinksInNewTab
                  />
                );
              }
            }}
          >
            <div className={css(styles.leftMargin)}>
              {" "}
              {suggestionsMap
                .get(suggestionKey)
                ?.get(suggestionTerms)
                ?.join(", ")}
            </div>
          </HorizontalField>
        ))}
      </Accordion>
    );
  }
  return null;
};

export default observer(CollectionsBoostSearchTermSuggestion);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        accordion: {
          width: "60%",
        },
        leftMargin: {
          marginLeft: 10,
        },
        markdown: {
          margin: 10,
        },
        suggestion: {
          marginLeft: 15,
          marginTop: 10,
        },
      }),
    []
  );
};
